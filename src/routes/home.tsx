import React, { useContext, useEffect, useRef, useState } from 'react';
import { Inspector } from '../components/inspector';
import { ObjectInterface } from '../components/interfaces';
import { MainToolbar } from '../components/mainToolbar';
import { Tools } from '../components/tools';
import { Dispatch, Global, SELECTED } from '../globalState';
import { useWindowSize } from '../hooks/useWindowSize';
import gridImageBg from '../images/grid.svg';
import '../scss/index.scss';

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
  const [dragBg, setDragBg] = useState(true);
  const [draw, setDraw] = useState(0);
  const [canvasImage, setCanvasImage] = useState<HTMLImageElement>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [lastHovered, setLastHovered] = useState<ObjectInterface | null>();

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

  const setMouseDown = (event: React.MouseEvent) => {

    // Select
    // if you clicked an object add it to the selected array
    // if you click another node with Alt then push it into the array
    // if you click another node without alt then clear the array and push it in
    // if you dont click another object clear the array
    const selectedNode = objectWasHit(event.nativeEvent);
    if (selectedNode) {
      setDragBg(false);
      dispatch({ type: SELECTED, value: selectedNode });
    } else {
      setDragBg(true);
      dispatch({ type: SELECTED, value: selectedNode });
    }
    // END SELECT

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    if (canvas) canvas.style.cursor = 'grab';
    setViewPos(() => ({
      isDragging: true,
      prevX: Math.floor(x),
      prevY: Math.floor(y),
    }));
  };

  const setMouseUp = (event: React.MouseEvent) => {
    if (canvas) canvas.style.cursor = 'crosshair';
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
      setDraw(Date.now());
  };

  const setMouseMove = (event: React.MouseEvent) => {
    const x: number = event.nativeEvent.offsetX;
    const y: number = event.nativeEvent.offsetY;
    const hitObject = objectWasHit(event.nativeEvent);
    hoverObject(hitObject);
    setMousePosition({ x, y });
    if (viewPos.isDragging && dragBg) setPan(event.nativeEvent);
    if (viewPos.isDragging && !dragBg) setMove(event.nativeEvent);
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
      setViewPos(() => ({ isDragging: true, prevX: Math.floor(x), prevY: Math.floor(y) }));
    }
  };

  const setMove = (event: MouseEvent) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const selected = global.objects.selected;
    const zoom = view.zoom;
    if (selected) {
      selected.updatePosition({
        x: (x - view.x - (selected.size.x / 2) * zoom) / zoom,
        y: (y - view.y - (selected.size.y / 2) * zoom) / zoom,
      });
      setDraw(x + y);
    }
  };

  const setZoom = (event: React.WheelEvent) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const { deltaY } = event;
    const weighted = { x: 0, y: 0 };
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
    if (direction === 1 && canvas) canvas.style.cursor = 'zoom-in';
    if (direction === -1 && canvas) canvas.style.cursor = 'zoom-out';
    if (view.zoom + zoom < 3 && view.zoom + zoom > 0.8) {
      weighted.x = (x - view.x) / (windowSize.x * view.zoom);
      weighted.y = (y - view.y) / (windowSize.y * view.zoom);
      setview((prev) => ({
        ...prev,
        x: Math.floor(view.x -= weighted.x * windowSize.x * zoom),
        y: Math.floor(view.y -= weighted.y * windowSize.y * zoom),
        zoom: view.zoom += zoom,
      }));
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = gridImageBg;
    img.onload = () => {
      setCanvasImage(img);
      const initCanvas = canvasRef.current;
      if (initCanvas) {
        setCanvas(initCanvas);
        initCanvas.width = windowSize.x;
        initCanvas.height = windowSize.y;
        const initCtx = initCanvas.getContext('2d');
        setCtx(initCtx);
        setLoaded(true);
      }
    };
  }, [windowSize]);

  useEffect(() => {
    const paint = () => {
      if (canvas && ctx) {
        ctx.clearRect(
          0,
          0,
          Math.floor(windowSize.x),
          Math.floor(windowSize.y)
        );
        ctx.save();
        ctx.translate(Math.floor(view.x), Math.floor(view.y));
        ctx.scale(view.zoom, view.zoom);
        ctx.rect(
          0,
          0,
          Math.floor(windowSize.x),
          Math.floor(windowSize.y)
        );
        const gridPatternBackground = ctx.createPattern(
          canvasImage as CanvasImageSource,
          'repeat'
        );
        if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
        if (gridPatternBackground) ctx.fill();
        global.objects.objectArray.forEach((object) => object.draw(ctx));
        ctx.restore();
      }
    };
    requestAnimationFrame(paint);
  }, [windowSize, view, loaded, global.objects.objectArray, draw, canvas, canvasImage, ctx]);

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
            x: {mousePosition.x}, y: {mousePosition.y} | x:{' '}
            {mousePosition.x - view.x}, y: {mousePosition.y - view.y}
          </div>
          <canvas
            id='canvas'
            ref={canvasRef}
            className='canvas'
            onMouseDown={(e: React.MouseEvent) => setMouseDown(e)}
            onMouseUp={(e: React.MouseEvent) => setMouseUp(e)}
            onMouseMove={(e: React.MouseEvent) => setMouseMove(e)}
            onWheel={(e: React.WheelEvent) => setZoom(e)}
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
