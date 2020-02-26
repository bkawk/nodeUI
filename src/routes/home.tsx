import React, { useContext, useEffect, useRef, useState } from 'react';
import { Inspector } from '../components/inspector';
import { ObjectInterface, XYInterface } from '../components/interfaces';
import { MainToolbar } from '../components/mainToolbar';
import { Selection } from '../components/selection';
import { Tools } from '../components/tools';
import {
  ADD_OBJECT,
  CLEAR_SELECTED,
  Dispatch,
  DRAW,
  Global,
  NEW_SELECTED,
  REMOVE_OBJECT,
} from '../globalState';
import { useWindowSize } from '../hooks/useWindowSize';
import '../scss/index.scss';

// IMAGES TO CACHE
import gridImageBg from '../images/grid.svg';
import shapesImage from '../images/shapes.svg';

interface ControlsInterface {
  prevX: number | null;
  prevY: number | null;
  isDragging: boolean;
}
const Home: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowSize = useWindowSize();
  const [dragBg, setDragBg] = useState(true);
  const [canvasImage, setCanvasImage] = useState<HTMLImageElement>(); // TODO: move to image cache
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastHovered, setLastHovered] = useState<ObjectInterface | null>();
  const [imageCache, setImageCache] = useState<HTMLImageElement[]>();
  const [viewPos, setViewPos] = useState<ControlsInterface>({
    isDragging: true,
    prevX: 0,
    prevY: 0,
  });
  const [view, setview] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

  const objectWasHit = (event: MouseEvent) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const zoom = view.zoom;
    let index = 0;
    let objectHit = false;
    let nodeObjects = 0;
    for (const value of global.objects.objectArray) {
      index++;
      if (
        x - view.x > value.position.x * zoom &&
        x - view.x < value.position.x * zoom + value.size.x * zoom &&
        y - view.y > value.position.y * zoom &&
        y - view.y < value.position.y * zoom + value.size.y * zoom
      ) {
        nodeObjects = index;
        objectHit = true;
      }
    }
    if (objectHit) {
      return global.objects.objectArray[nodeObjects - 1];
    } else {
      return null;
    }
  };

  const selectObject = (hitObject: ObjectInterface | null) => {
    if (hitObject) {
      setDragBg(false);
      // TODO: unselect the item not all
      for (const value of global.objects.objectArray) {
        value.toggleSelected(false);
      }
      hitObject.toggleSelected(true);
      dispatch({ type: NEW_SELECTED, value: [hitObject] });
      draw();
    } else {
      setDragBg(true);
      dispatch({ type: CLEAR_SELECTED, value: null });
      // TODO: unselect the item not all
      for (const value of global.objects.objectArray) {
        value.toggleSelected(false);
      }
      draw();
    }
    // TODO: if you click another node with Shift then push it into the global selected array (PUSH_SELECTED)
    // this opens up drag to select over multiple
  };

  const startSelection = () => {
    setDragBg(false);
    dispatch({ type: CLEAR_SELECTED, value: null });
    for (const value of global.objects.objectArray) {
      value.toggleSelected(false);
    }
    const x = Math.floor((mousePosition.x - view.x) / view.zoom);
    const y = Math.floor((mousePosition.y - view.y) / view.zoom);
    dispatch({ type: ADD_OBJECT, value: new Selection({ x, y }) });
  };

  const setMouseDown = (event: React.MouseEvent) => {
    const hitObject = objectWasHit(event.nativeEvent);
    if (!global.tools.selector) selectObject(hitObject);
    else if (canvas && global.tools.selector) startSelection();
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    if (canvas && !global.tools.selector) canvas.style.cursor = 'grab';
    if (canvas && global.tools.selector) canvas.style.cursor = 'default';
    setViewPos(() => ({
      isDragging: true,
      prevX: Math.floor(x),
      prevY: Math.floor(y),
    }));
  };

  const dropSelection = () => {
    if (canvas) canvas.style.cursor = 'default';
    const objectArray = global.objects.objectArray;
    const selected: ObjectInterface[] = [];
    let selctedPosition: XYInterface = { x: 0, y: 0 };
    let selectedSize: XYInterface = { x: 0, y: 0 };
    // TODO: change the first for loop below for a filter
    for (const value in objectArray) {
      if (value && objectArray[value].name === 'Selection') {
        selctedPosition = objectArray[value].position;
        selectedSize = objectArray[value].size;
      }
    }
    for (const value in objectArray) {
      if (value && objectArray[value].name !== 'Selection') {
        const targetPosition = objectArray[value].position;
        const targetSize = objectArray[value].size;
        if (
          selctedPosition.x > targetPosition.x + targetSize.x ||
          selctedPosition.x + selectedSize.x < targetPosition.x ||
          selctedPosition.y > targetPosition.y + targetSize.y ||
          selctedPosition.y + selectedSize.y < targetPosition.y
        ) {
          //
        } else {
          objectArray[value].selected = true;
          selected.push(objectArray[value]);
          draw();
        }
      }
    }
    for (const value in objectArray) {
      if (value && objectArray[value].name === 'Selection') {
        dispatch({ type: REMOVE_OBJECT, value: objectArray[value] });
        dispatch({ type: NEW_SELECTED, value: selected });
      }
    }
  };

  const setMouseUp = (event: React.MouseEvent) => {
    if (canvas && !global.tools.selector) canvas.style.cursor = 'crosshair';
    else if (canvas && global.tools.selector) dropSelection();
    setViewPos(() => ({
      isDragging: false,
      prevX: null,
      prevY: null,
    }));
  };

  const hoverObject = (hitObject: ObjectInterface | null) => {
    if (!hitObject && lastHovered) {
      lastHovered.toggleHovered(false);
      setLastHovered(null);
      draw();
      if (canvas) canvas.style.cursor = 'crosshair';
    }
    if (lastHovered && hitObject && hitObject !== lastHovered) {
      lastHovered.toggleHovered(false);
      hitObject.toggleHovered(true);
      setLastHovered(hitObject);
      draw();
      if (canvas) canvas.style.cursor = 'pointer';
    }
    if (!lastHovered && hitObject) {
      hitObject.toggleHovered(true);
      setLastHovered(hitObject);
      draw();
      if (canvas) canvas.style.cursor = 'pointer';
    }
  };

  const drawSelection = (event: React.MouseEvent) => {
    const objectArray = global.objects.objectArray;
    const x = Math.floor((mousePosition.x - view.x) / view.zoom);
    const y = Math.floor((mousePosition.y - view.y) / view.zoom);
    for (const value in objectArray) {
      if (value) {
        if (objectArray[value].name === 'Selection') {
          objectArray[value].updateSize({ x, y });
          draw();
        }
      }
    }
  };

  const setMouseMove = (event: React.MouseEvent) => {
    const x: number = event.nativeEvent.offsetX;
    const y: number = event.nativeEvent.offsetY;
    const hitObject = objectWasHit(event.nativeEvent);
    if (!global.tools.selector) hoverObject(hitObject);
    setMousePosition({ x, y });
    if (viewPos.isDragging && dragBg) setPan(event.nativeEvent);
    if (viewPos.isDragging && !dragBg) setMove(event.nativeEvent);
    if (viewPos.isDragging && global.tools.selector) drawSelection(event);
  };

  const setPan = (event: MouseEvent) => {
    const x = event.offsetX;
    const y = event.offsetY;
    let dx = 0;
    let dy = 0;
    if (viewPos.prevX) dx = x - viewPos.prevX;
    if (viewPos.prevY) dy = y - viewPos.prevY;
    if (viewPos.prevX || viewPos.prevY) {
      if (dx !== 0) setview((prev) => ({ ...prev, x: view.x += dx }));
      if (dy !== 0) setview((prev) => ({ ...prev, y: view.y += dy }));
      setViewPos(() => ({
        isDragging: true,
        prevX: Math.floor(x),
        prevY: Math.floor(y),
      }));
    }
  };

  const setMove = (event: MouseEvent) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const selected = global.objects.selectedArray;
    const zoom = view.zoom;
    const snap = global.tools.snap;
    if (selected && selected.length > 0) {
      for (const value of selected) {
        if (!snap) {
          value.updatePosition({
            x: Math.floor((x - view.x - (value.size.x / 2) * zoom) / zoom),
            y: Math.floor((y - view.y - (value.size.y / 2) * zoom) / zoom),
          });
        } else {
          value.updatePosition({
            x:
              Math.floor((x - view.x - (value.size.x / 2) * zoom) / zoom / 10) *
              10,
            y:
              Math.floor((y - view.y - (value.size.y / 2) * zoom) / zoom / 10) *
              10,
          });
        }
      }
      draw();
    }
  };

  const setZoom = (event: React.WheelEvent) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const { deltaY } = event;
    const weighted = { x: 0, y: 0 };
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.02;
    const zoom = direction * factor;
    if (direction === 1 && canvas) canvas.style.cursor = 'zoom-in';
    if (direction === -1 && canvas) canvas.style.cursor = 'zoom-out';
    if (view.zoom + zoom < 1.5 && view.zoom + zoom > 0.5) {
      weighted.x = (x - view.x) / (windowSize.x * view.zoom);
      weighted.y = (y - view.y) / (windowSize.y * view.zoom);
      setview((prev) => ({
        ...prev,
        x: Math.floor((view.x -= weighted.x * windowSize.x * zoom)),
        y: Math.floor((view.y -= weighted.y * windowSize.y * zoom)),
        zoom: view.zoom += zoom,
      }));
    }
  };

  const setKeyDown = (event: React.KeyboardEvent<Element>) => {
    if (event.keyCode === 8) {
      alert('Delete');
    }
  };

  useEffect(() => {
    // TODO: Add an index to the image cache so when we have many objects we have a key for the image
    const cachedShapesImage = new Image();
    cachedShapesImage.src = shapesImage;
    cachedShapesImage.onload = () => {
      setImageCache([cachedShapesImage]);
    };
  }, []);

  useEffect(() => {
    // TODO: Get these values from local storage instead of asuming zoom 1 etc
    setview((prev) => ({
      ...prev,
      x: 0,
      y: 0,
      zoom: 1,
    }));
    const img = new Image();
    img.src = gridImageBg;
    img.onload = () => {
      setCanvasImage(img);
      const initCanvas = canvasRef.current;
      if (initCanvas) initCanvas.style.cursor = 'crosshair';
      if (initCanvas) {
        setCanvas(initCanvas);
        const dpr = window.devicePixelRatio || 1;
        // TODO: looko at using.. const rect = initCanvas.getBoundingClientRect();
        initCanvas.width = windowSize.x * dpr;
        initCanvas.height = windowSize.y * dpr;
        const initCtx = initCanvas.getContext('2d');
        if (initCtx) initCtx.scale(dpr, dpr);
        setCtx(initCtx);
        dispatch({ type: DRAW, value: Date.now() });
      }
    };
  }, [windowSize, dispatch]);

  useEffect(() => {
    if (canvas && global.tools.selector) {
      canvas.style.cursor = 'default';
    } else if (canvas && !global.tools.selector) {
      canvas.style.cursor = 'crosshair';
    }
  }, [global.tools.selector, canvas, dispatch]);

  useEffect(() => {
    const paint = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, Math.floor(windowSize.x), Math.floor(windowSize.y));
        ctx.save();
        ctx.translate(Math.floor(view.x), Math.floor(view.y));
        ctx.scale(view.zoom, view.zoom);
        ctx.rect(0, 0, Math.floor(windowSize.x), Math.floor(windowSize.y));
        const gridPatternBackground = ctx.createPattern(
          canvasImage as CanvasImageSource,
          'repeat'
        );
        if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
        if (gridPatternBackground) ctx.fill();
        global.objects.objectArray.forEach((object) =>
          object.draw(ctx, imageCache)
        );
        ctx.restore();
      }
    };
    requestAnimationFrame(paint);
  }, [
    imageCache,
    windowSize,
    view,
    global.objects.objectArray,
    global.draw,
    canvas,
    canvasImage,
    ctx,
  ]);

  return (
    <div className='container'>
      <div className='container--main-toolbar'>
        <MainToolbar />
      </div>
      <div className='container--center'>
        <div className='container--tools'>
          <Tools />
        </div>
        <div className='container--canvas'>
          <div className='container--location'>
            x: {Math.floor((mousePosition.x - view.x) / view.zoom)} y:{' '}
            {Math.floor((mousePosition.y - view.y) / view.zoom)} z:{' '}
            {view.zoom.toFixed(2)}
          </div>
          <canvas
            id='canvas'
            ref={canvasRef}
            className='canvas'
            tabIndex={0}
            onMouseDown={(e: React.MouseEvent) => setMouseDown(e)}
            onMouseUp={(e: React.MouseEvent) => setMouseUp(e)}
            onMouseMove={(e: React.MouseEvent) => setMouseMove(e)}
            onWheel={(e: React.WheelEvent) => setZoom(e)}
            onKeyDown={(e: React.KeyboardEvent) => setKeyDown(e)}
          />
        </div>
        <div className='container--inspector'>
          <Inspector />
        </div>
      </div>
      <div className='container--footer'></div>
    </div>
  );
};

export { Home };
