import React, { useContext, useEffect, useRef, useState } from 'react';
import { Inspector } from '../components/inspector';
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
  const [mousePosition, setmousePosition] = useState({x: 0, y: 0});

  const objectHitWas = (event: MouseEvent) => {
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
      const selectedNode = global.objects.objectArray[nodeObjects - 1];
      setDragBg(false);
      dispatch({ type: SELECTED, value: selectedNode });
    } else {
      const selectedNode = null;
      setDragBg(true);
      dispatch({ type: SELECTED, value: selectedNode });
    }
  };

  const setMouseDown = (event: React.MouseEvent) => {
    objectHitWas(event.nativeEvent);
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    if (canvas) canvas.style.cursor = 'grab';
    setViewPos(() => ({
      isDragging: true,
      prevX: x,
      prevY: y,
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

  const setMouseMove = (event: React.MouseEvent) => {
    const x: number = event.nativeEvent.offsetX;
    const y: number = event.nativeEvent.offsetY;
    setmousePosition({x, y});
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
    if (dx !== 0) setview((prev) => ({...prev, x: view.x += dx}));
    if (dy !== 0) setview((prev) => ({...prev, y: view.y += dy}));
    setViewPos(() => ({isDragging: true, prevX: x, prevY: y}));
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
    const weigthed = { x: 0, y: 0 };
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
    if (direction === 1 && canvas) canvas.style.cursor = 'zoom-in';
    if (direction === -1 && canvas) canvas.style.cursor = 'zoom-out';
    if (view.zoom + zoom < 3 && view.zoom + zoom > 0.8) {
      weigthed.x = (x - view.x) / (windowSize.width * view.zoom);
      weigthed.y = (y - view.y) / (windowSize.height * view.zoom);
      setview((prev) => ({...prev,
        x: view.x -= weigthed.x * windowSize.width * zoom,
        y: view.y -= weigthed.y * windowSize.height * zoom,
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
        initCanvas.width = windowSize.width;
        initCanvas.height = windowSize.height;
        const initCtx = initCanvas.getContext('2d');
        setCtx(initCtx);
        setLoaded(true);
      }
    };
  }, [windowSize]);

  useEffect(() => {
    const paint = () => {
      if (canvas && ctx) {
        const gridPatternBackground = ctx.createPattern(canvasImage as CanvasImageSource, 'repeat');
        ctx.clearRect(0, 0, Math.floor(windowSize.width), Math.floor(windowSize.height));
        ctx.save();
        ctx.translate(Math.floor(view.x), Math.floor(view.y));
        ctx.scale(view.zoom, view.zoom);
        ctx.rect(0, 0, Math.floor(windowSize.width), Math.floor(windowSize.height));
        if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
        if (gridPatternBackground) ctx.fill();
        global.objects.objectArray.forEach((object) => object.draw(ctx));
        ctx.restore();
      }
    };
    requestAnimationFrame(paint);
  }, [windowSize, view, loaded, global.objects.objectArray, draw]);

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
