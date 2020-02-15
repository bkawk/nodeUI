import React, { useEffect, useRef, useState } from 'react';
import { Grid } from './grid';
import gridImageBg from './images/grid.svg';
import './scss/index.scss';

const App: React.FC = () => {
  const [state, setState] = useState({canvasSize: { x: 0, y: 0 }});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = new Grid(state.canvasSize);

  const calcCanvasSize = () => {
    const x = window.innerWidth - 300;
    const y = window.innerHeight - 60;
    setState((prev) => ({ canvasSize: { x, y} }));
  };
  let resizeTimer: any;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(calcCanvasSize, 500);
  });
  document.addEventListener('DOMContentLoaded', calcCanvasSize);

  useEffect(() => {
    const gridImage = document.getElementById('gridImageBg');
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && gridImage) {
        let now = 0;
        const tickLoop = (epoch: number) => {
          const tick = epoch - now;
          now = epoch;
          grid.update(tick);
          grid.draw(ctx, gridImage as CanvasImageSource);
          requestAnimationFrame(tickLoop);
        };
        requestAnimationFrame(tickLoop);
      }
    }
  }, [grid]);

  const newNode = () => {
    grid.newNode();
  };

  return (
    <div className='container'>
      <div className='container--top'>
        <div className='container--canvas'>
          <img src={gridImageBg} id='gridImageBg' alt='grid' />
          <canvas ref={canvasRef} width={state.canvasSize.x} height={state.canvasSize.y} />
        </div>
        <div className='container--inspector'>inspector</div>
      </div>
      <div className='container--buttons'>
        <button onClick={newNode}>New Node</button>
      </div>
    </div>
  );
};

export { App };
