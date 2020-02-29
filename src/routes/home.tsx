import React, { useContext, useEffect, useRef, useState } from 'react';
import { Inspector } from '../components/inspector';
import { ControlsInterface, ObjectInterface, XYInterface } from '../components/interfaces';
import { MainToolbar } from '../components/mainToolbar';
import { Selection } from '../components/selection';
import { Tools } from '../components/tools';
import {
  ADD_OBJECT,
  DELETE_SELECTED,
  Dispatch,
  DRAW,
  Global,
  NEW_SELECTED,
  REMOVE_OBJECT,
  SET_ALIGN,
  TOGGLE_SELECTOR,
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
  const [shiftOn, setShiftOn] = useState(false);
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

  const dropPlaceholder = () => {
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.placeholder === true)[0];
    if (selection) {
      selection.position = {x: mousePosition.x - 50, y: mousePosition.y - 15};
      selection.placeholder = false;
    }
  };

  const setMouseDown = (event: React.MouseEvent) => {
    setOffSets();
    if (!global.tools.selector) selectObject();
    if (global.tools.selector) startSelection();
    if (canvas && !global.tools.selector) canvas.style.cursor = 'grab';
    if (canvas && global.tools.selector) canvas.style.cursor = 'default';
    dropPlaceholder();
    const prevX = Math.floor(event.nativeEvent.offsetX);
    const prevY = Math.floor(event.nativeEvent.offsetY);
    setViewPosition(() => ({
      isDragging: true,
      prevX,
      prevY,
    }));
  };

  const unselectAll = () => {
    for (const value of global.objects.objectArray) {
      value.selected = false;
      dispatch({ type: NEW_SELECTED, value: [] });
    }
  };

  const selectObject = () => {
    const hitObject = objectClicked();
    if (!hitObject) {
      setDragBg(true);
      unselectAll();
    } else {
      setDragBg(false);
    }

    if (!shiftOn && hitObject && !hitObject.selected) {
      unselectAll();
      hitObject.selected = true;
      dispatch({ type: NEW_SELECTED, value: [hitObject] });
    }
    if (shiftOn && hitObject && hitObject.selected) {
      hitObject.selected = false;
      const selected = global.objects.selectedArray.filter(
        (obj) => obj !== hitObject
      );
      dispatch({ type: NEW_SELECTED, value: selected });
    } else if (shiftOn && hitObject && !hitObject.selected) {
      hitObject.selected = true;
      const selected = [...global.objects.selectedArray, hitObject];
      dispatch({ type: NEW_SELECTED, value: selected });
    }
    draw();
  };

  const startSelection = () => {
    const hitObject = objectClicked();
    if (!hitObject) {
      unselectAll();
      setDragBg(false);
      dispatch({
        type: ADD_OBJECT,
        value: new Selection({ x: mousePosition.x, y: mousePosition.y }),
      });
    }
  };

  const setMouseUp = () => {
    if (canvas && !global.tools.selector) canvas.style.cursor = 'crosshair';
    else if (canvas && global.tools.selector) objectsSelected();
    setViewPosition(() => ({
      isDragging: false,
      prevX: null,
      prevY: null,
    }));
  };

  const movePlaceholder = () => {
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.placeholder === true)[0];
    const position: XYInterface = {x: 0, y: 0};
    if (selection) {
      if (canvas) canvas.style.cursor = 'grab';
      if (global.tools.snap) {
        position.x =  Math.floor((mousePosition.x - 50) / 10) * 10;
        position.y = Math.floor((mousePosition.y - 15) / 10) * 10;
      } else {
        position.x = mousePosition.x - 50;
        position.y = mousePosition.y - 15;
      }
      selection.position = position;
      selection.hidden = false;
    }
  };

  const setMouseMove = (event: React.MouseEvent) => {
    const x = (event.nativeEvent.offsetX - view.x) / view.zoom;
    const y = (event.nativeEvent.offsetY - view.y) / view.zoom;
    setMousePosition({ x, y });
    movePlaceholder();

    if (!global.tools.selector) hoverObject();
    if (viewPosition.isDragging && dragBg) setPan(event.nativeEvent);
    if (viewPosition.isDragging && !dragBg) setMove();
    if (viewPosition.isDragging) drawSelection();
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
      setview({
        x: view.x -= weighted.x * windowSize.x * zoom,
        y: view.y -= weighted.y * windowSize.y * zoom,
        zoom: view.zoom += zoom,
      });
    }
  };

  const deleteSelected = () => {
    const selected = global.objects.selectedArray;
    for (const value in selected) {
      if (value) dispatch({ type: REMOVE_OBJECT, value: selected[value] });
    }
    dispatch({ type: NEW_SELECTED, value: null });
  };

  const setKeyUp = (event: React.KeyboardEvent<Element>) => {
    if (event.keyCode === 16) setShiftOn(false);
  };

  const setKeyDown = (event: React.KeyboardEvent<Element>) => {
    if (event.keyCode === 16) setShiftOn(true);
    if (event.keyCode === 8) deleteSelected();
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
      if (dx !== 0 && dy !== 0) {
        setview((prev) => ({ ...prev, x: view.x += dx, y: view.y += dy }));
      }
      setViewPosition({ isDragging: true, prevX, prevY });
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
        value.position = position;
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

  const objectClicked = () => {
    for (const target of global.objects.objectArray) {
      if (
        mousePosition.x > target.position.x &&
        mousePosition.x < target.position.x + target.size.x &&
        mousePosition.y > target.position.y &&
        mousePosition.y < target.position.y + target.size.y
      ) {
        return target;
      }
    }
    return null;
  };

  const drawSelection = () => {
    const objectArray = global.objects.objectArray;
    const selection = objectArray.filter((obj) => obj.name === 'Selection')[0];
    if (selection) {
      const x = mousePosition.x - selection.position.x;
      const y = mousePosition.y - selection.position.y;
      selection.size = { x, y };
    }
    draw();
  };

  const objectsSelected = () => {
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
      dispatch({ type: TOGGLE_SELECTOR, value: false });
      dispatch({ type: REMOVE_OBJECT, value: selection });
      dispatch({ type: NEW_SELECTED, value: selected });
      draw();
    }
  };

  const hoverObject = () => {
    const hitObject = objectClicked();
    if (!hitObject && lastHovered) {
      lastHovered.hovered = false;
      setLastHovered(null);
      if (canvas) canvas.style.cursor = 'crosshair';
    }
    if (lastHovered && hitObject && hitObject !== lastHovered) {
      lastHovered.hovered = false;
      hitObject.hovered = true;
      setLastHovered(hitObject);
      if (canvas) canvas.style.cursor = 'pointer';
    }
    if (!lastHovered && hitObject) {
      hitObject.hovered = true;
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
    setview({ x: 0, y: 0, zoom: 1 });
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
    deleteSelected();
    const value = false;
    dispatch({ type: DELETE_SELECTED, value });
  }, [global.tools.delete]);

  useEffect(() => {
    const align = global.tools.align;

    if (align) {
      const array = [];
      let result = 0;
      const objectArray = global.objects.selectedArray;
      for (const value in objectArray) {
        if (value) {
          const targets = objectArray[value];
          if (align === 'left' || align === 'center' || align === 'right') {
            array.push(targets.position.x);
          } else array.push(targets.position.y);
        }
      }
      array.sort((a, b) => a - b);
      const small = array[0];
      const big = array[array.length - 1];
      if (align === 'center' || align === 'middle') {
        result = small + big / 2 + small;
      }
      if (align === 'left' || align === 'top') result = small;
      if (align === 'right' || align === 'bottom') result = big;
      for (const value in objectArray) {
        if (value) {
          if (align === 'left' || align === 'center' || align === 'right') {
            objectArray[value].position.x = result;
          } else objectArray[value].position.y = result;
        }
      }
      draw();
      dispatch({ type: SET_ALIGN, value: null });
    }
  }, [global.tools.align]);

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

        global.objects.objectArray.forEach((object) => {
          object.draw(ctx, imageCache);
        });
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
            onKeyUp={(e: React.KeyboardEvent) => setKeyUp(e)}
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
