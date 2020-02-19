import React, { useEffect, useRef, useState } from 'react';
import { Inspector } from './components/inspector';
import { MainToolbar } from './components/mainToolbar';
import { Tools } from './components/tools';
import { Grid } from './grid';
import gridImageBg from './images/grid.svg';
import './scss/index.scss';

const App: React.FC = () => {
  const [state, setState] = useState({ canvasSize: { x: 0, y: 0 } });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = new Grid(state.canvasSize);
  const calcCanvasSize = () => {
    const x = window.innerWidth - 540;
    const y = window.innerHeight - 130;
    setState((prev) => ({ canvasSize: { x, y } }));
  };

  let debounceResize: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(debounceResize);
    debounceResize = setTimeout(calcCanvasSize, 500);
  });
  document.addEventListener('DOMContentLoaded', calcCanvasSize);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const gridImage = document.getElementById('gridImageBg');
      if (ctx && gridImage && canvas) {
        grid.update(ctx, gridImage as CanvasImageSource, canvas);
      }
    }
  }, [grid]);

  return (
    <div className='container'>
      <div className='container--main-toolbar'>
        <MainToolbar grid={grid} />
      </div>
      <div className='container--center'>
        <div className='container--tools'>
          <Tools grid={grid}/>
        </div>
        <div className='container--canvas'>
          <img src={gridImageBg} id='gridImageBg' alt='grid' className='hidden'/>
          <canvas
            id='canvas'
            ref={canvasRef}
            width={state.canvasSize.x}
            height={state.canvasSize.y}
          />
        </div>
        <div className='container--inspector'>
          <Inspector grid={grid} />
        </div>
      </div>
      <div className='container--footer'></div>
    </div>
  );
};

export { App };
