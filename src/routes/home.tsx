import React, { useContext, useEffect, useRef, useState } from 'react';
import { Inspector } from '../components/inspector';
import { ControlsInterface, ObjectInterface } from '../components/interfaces';
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
  const [viewPosition, setViewPosition] = useState<ControlsInterface>({
    isDragging: true,
    prevX: 0,
    prevY: 0,
  });
  const [view, setview] = useState({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const setMouseDown = (event: React.MouseEvent) => {
    setOffSets();
    if (!global.tools.selector) selectObject();
    if (global.tools.selector) startSelection();
    if (canvas && !global.tools.selector) canvas.style.cursor = 'grab';
    if (canvas && global.tools.selector) canvas.style.cursor = 'default';
    const prevX = Math.floor(event.nativeEvent.offsetX);
    const prevY = Math.floor(event.nativeEvent.offsetY);
    setViewPosition(() => ({
      isDragging: true,
      prevX,
      prevY,
    }));
  };

  const setMouseUp = () => {
    if (canvas && !global.tools.selector) canvas.style.cursor = 'crosshair';
    else if (canvas && global.tools.selector) selectedObjects();
    setViewPosition(() => ({
      isDragging: false,
      prevX: null,
      prevY: null,
    }));
  };

  const setMouseMove = (event: React.MouseEvent) => {
    const x = (event.nativeEvent.offsetX - view.x) / view.zoom;
    const y = (event.nativeEvent.offsetY - view.y) / view.zoom;
    setMousePosition({ x, y });
    if (!global.tools.selector) hoverObject();
    if (viewPosition.isDragging && dragBg) setPan(event.nativeEvent);
    if (viewPosition.isDragging && !dragBg) setMove();
    if (viewPosition.isDragging && global.tools.selector) drawSelection();
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
    if (view.zoom + zoom < 1.5 && view.zoom + zoom > 0.7) {
      weighted.x = (x - view.x) / (windowSize.x * view.zoom);
      weighted.y = (y - view.y) / (windowSize.y * view.zoom);
      setview({
        x: view.x -= weighted.x * windowSize.x * zoom,
        y: view.y -= weighted.y * windowSize.y * zoom,
        zoom: view.zoom += zoom,
      });
    }
  };

  const setKeyDown = (event: React.KeyboardEvent<Element>) => {
    // TODO: Delete object/s
    if (event.keyCode === 8) alert('Delete');
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (event.keyCode === 27 && selection) {
      dispatch({ type: REMOVE_OBJECT, value: selection });
    }
  };

  const setPan = (event: MouseEvent) => {
    const prevX = event.offsetX;
    const prevY = event.offsetY;
    let dx = 0;
    let dy = 0;
    if (viewPosition.prevX) dx = prevX - viewPosition.prevX;
    if (viewPosition.prevY) dy = prevY - viewPosition.prevY;
    if (viewPosition.prevX || viewPosition.prevY) {
      if (dx !== 0 && dy !== 0) setview((prev) => ({ ...prev, x: view.x += dx, y: view.y += dy }));
      setViewPosition({isDragging: true, prevX, prevY });
    }
  };

  const setMove = () => {
    const selected = global.objects.selectedArray;
    if (selected) {
      const snap = global.tools.snap;
      for (const value of selected) {
        let position = { x: 0, y: 0 };
        if (!snap) {
          position = {
            x: mousePosition.x - value.offSet.x,
            y: mousePosition.y - value.offSet.y,
          };
        } else {
          position = {
            x: Math.floor((mousePosition.x - value.offSet.x) / 10) * 10,
            y: Math.floor((mousePosition.y - value.offSet.y) / 10) * 10,
          };
        }
        value.updatePosition(position);
      }
      draw();
    }
  };

  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

  const setOffSets = () => {
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
  };

  const selectedObject = () => {
    for (const target of global.objects.objectArray) {
      if (
        mousePosition.x > target.position.x &&
        mousePosition.x < target.position.x + target.size.x * view.zoom &&
        mousePosition.y > target.position.y &&
        mousePosition.y < target.position.y + target.size.y * view.zoom
      ) {
        return target;
      }
    }
    return null;
  };

  const unselectAll = () => {
    for (const value of global.objects.objectArray) {
      value.toggleSelected(false);
      dispatch({ type: CLEAR_SELECTED, value: null });
    }
  };

  const selectObject = () => {
    const hitObject = selectedObject();
    unselectAll();
    if (hitObject) {
      setDragBg(false);
      hitObject.toggleSelected(true);
      dispatch({ type: NEW_SELECTED, value: [hitObject] });
    } else {
      setDragBg(true);
    }
    draw();
    // TODO: if you click another node with Shift then push it into the global selected array (PUSH_SELECTED)
  };

  const startSelection = () => {
    const hitObject = selectedObject();
    if (!hitObject) {
      unselectAll();
      setDragBg(false);
      dispatch({
        type: ADD_OBJECT,
        value: new Selection({ x: mousePosition.x, y: mousePosition.y }),
      });
    }
  };

  const drawSelection = () => {
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (selection) selection.updateSize({ x: mousePosition.x, y: mousePosition.y});
    draw();
  };

  const selectedObjects = () => {
    if (canvas) canvas.style.cursor = 'default';
    const objectArray = global.objects.objectArray;
    const selected: ObjectInterface[] = [];
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (selection) {
      for (const value in objectArray) {
        if (value && objectArray[value].name !== 'Selection') {
          const targetPosition = objectArray[value].position;
          const targetSize = objectArray[value].size;
          const x1 =
            selection.position.x > mousePosition.x
              ? selection.position.x
              : mousePosition.x;
          const x2 =
            selection.position.x > mousePosition.x
              ? mousePosition.x
              : selection.position.x;
          const y1 =
            selection.position.y > mousePosition.y
              ? selection.position.y
              : mousePosition.y;
          const y2 =
            selection.position.y > mousePosition.y
              ? mousePosition.y
              : selection.position.y;
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
          }
        }
      }
      dispatch({ type: REMOVE_OBJECT, value: selection });
      dispatch({ type: NEW_SELECTED, value: selected });
      draw();
    }
  };

  const hoverObject = () => {
    const hitObject = selectedObject();
    if (!hitObject && lastHovered) {
      lastHovered.toggleHovered(false);
      setLastHovered(null);
      if (canvas) canvas.style.cursor = 'crosshair';
    }
    if (lastHovered && hitObject && hitObject !== lastHovered) {
      lastHovered.toggleHovered(false);
      hitObject.toggleHovered(true);
      setLastHovered(hitObject);
      if (canvas) canvas.style.cursor = 'pointer';
    }
    if (!lastHovered && hitObject) {
      hitObject.toggleHovered(true);
      setLastHovered(hitObject);
      if (canvas) canvas.style.cursor = 'pointer';
    }
    draw();
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
    setview({x: 0, y: 0, zoom: 1});
    const img = new Image();
    img.src = gridImageBg;
    img.onload = () => {
      setCanvasImage(img);
      if (canvasRef.current) canvasRef.current.style.cursor = 'crosshair';
      if (canvasRef.current) {
        setCanvas(canvasRef.current);
        const dpr = window.devicePixelRatio || 1;
        // TODO: looko at using.. const rect = canvasRef.current.getBoundingClientRect();
        canvasRef.current.width = windowSize.x * dpr;
        canvasRef.current.height = windowSize.y * dpr;
        const initCtx = canvasRef.current.getContext('2d');
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
  }, [global.tools.selector, canvas]);

  useEffect(() => {
    const paint = () => {
      if (ctx) {
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
            onMouseUp={setMouseUp}
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
