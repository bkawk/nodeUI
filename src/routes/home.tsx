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
    let index = 0;
    let objectHit = false;
    let nodeObjects = 0;
    for (const target of global.objects.objectArray) {
      index++;
      if (
        mousePosition.x > target.position.x &&
        mousePosition.x < target.position.x + target.size.x * view.zoom &&
        mousePosition.y > target.position.y &&
        mousePosition.y < target.position.y + target.size.y * view.zoom
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

  const startSelection = (hitObject: ObjectInterface | null) => {
    setDragBg(false);
    if (hitObject) {
      console.log('move');
    } else {
      dispatch({ type: CLEAR_SELECTED, value: null });
      for (const value of global.objects.objectArray) {
        value.toggleSelected(false);
      }
      const x = mousePosition.x;
      const y = mousePosition.y;
      dispatch({ type: ADD_OBJECT, value: new Selection({ x, y }) });
    }
  };

  const setMouseDown = (event: React.MouseEvent) => {
    const selectedArray = global.objects.objectArray;
    for (const value in selectedArray) {
      if (value) {
        const object = selectedArray[value];
        object.offSet = {
          x: mousePosition.x - object.position.x,
          y: mousePosition.y - object.position.y,
        };
      }
    }
    const hitObject = objectWasHit(event.nativeEvent);
    if (!global.tools.selector) selectObject(hitObject);
    else if (canvas && global.tools.selector) {
      startSelection(hitObject);
    }
    if (canvas && !global.tools.selector) canvas.style.cursor = 'grab';
    if (canvas && global.tools.selector) canvas.style.cursor = 'default';
    const prevX = Math.floor(event.nativeEvent.offsetX);
    const prevY = Math.floor(event.nativeEvent.offsetY);
    setViewPos(() => ({
      isDragging: true,
      prevX,
      prevY,
    }));
  };

  const dropSelection = (event: React.MouseEvent) => {
    const droppedX = mousePosition.x;
    const droppedY = mousePosition.y;
    if (canvas) canvas.style.cursor = 'default';
    const objectArray = global.objects.objectArray;
    const selected: ObjectInterface[] = [];
    let selectionPosition: XYInterface = { x: 0, y: 0 };
    let selectionSize: XYInterface = { x: 0, y: 0 };
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (selection) {
      selectionPosition = selection.position;
      selectionSize = selection.size;
      for (const value in objectArray) {
        if (value && objectArray[value].name !== 'Selection') {
          const targetPosition = objectArray[value].position;
          const targetSize = objectArray[value].size;
          const x1 =
            selectionPosition.x > droppedX ? selectionPosition.x : droppedX;
          const x2 =
            selectionPosition.x > droppedX ? droppedX : selectionPosition.x;
          const y1 =
            selectionPosition.y > droppedY ? selectionPosition.y : droppedY;
          const y2 =
            selectionPosition.y > droppedY ? droppedY : selectionPosition.y;
          const targetX1 = targetPosition.x;
          const targetX2 = targetPosition.x + targetSize.x;
          const targetY1 = targetPosition.y;
          const targetY2 = targetPosition.y + targetSize.y;
          if (
            x1 > targetX1 &&
            x2 < targetX2 &&
            y1 > targetY1 &&
            y2 < targetY2
          ) {
            objectArray[value].selected = true;
            selected.push(objectArray[value]);
            draw();
          }
        }
      }
      dispatch({ type: REMOVE_OBJECT, value: selection });
      dispatch({ type: NEW_SELECTED, value: selected });
    }
  };

  const setMouseUp = (event: React.MouseEvent) => {
    if (canvas && !global.tools.selector) canvas.style.cursor = 'crosshair';
    else if (canvas && global.tools.selector) dropSelection(event);
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
    const x = mousePosition.x;
    const y = mousePosition.y;
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
    const x: number = (event.nativeEvent.offsetX - view.x) / view.zoom;
    const y: number = (event.nativeEvent.offsetY - view.y) / view.zoom;
    setMousePosition({ x, y });
    const hitObject = objectWasHit(event.nativeEvent);
    if (!global.tools.selector) hoverObject(hitObject);
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
    const mx = ((x - view.x) * zoom) / zoom;
    const my = ((y - view.y) * zoom) / zoom;
    if (selected) {
      for (const value of selected) {
        if (!snap) {
          const rx = (mx - value.offSet.x * zoom) / zoom;
          const ry = (my - value.offSet.y * zoom) / zoom;
          value.updatePosition({ x: rx, y: ry });
        } else {
          const rxr = Math.floor((mx - value.offSet.x * zoom) / zoom / 10) * 10;
          const ryr = Math.floor((my - value.offSet.y * zoom) / zoom / 10) * 10;
          value.updatePosition({ x: rxr, y: ryr });
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
        x: view.x -= weighted.x * windowSize.x * zoom,
        y: view.y -= weighted.y * windowSize.y * zoom,
        zoom: view.zoom += zoom,
      }));
    }
  };

  const setKeyDown = (event: React.KeyboardEvent<Element>) => {
    // Delete an object
    if (event.keyCode === 8) alert('Delete');
    // Drop selection on escape
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (event.keyCode === 27 && selection) {
      dispatch({ type: REMOVE_OBJECT, value: selection });
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
            x: {Math.floor(mousePosition.x)} y: {Math.floor(mousePosition.y)} z:{' '}
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
