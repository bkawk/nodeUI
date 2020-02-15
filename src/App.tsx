import React, { useEffect, useRef } from 'react';
import { Grid } from './grid';
import gridImageBg from './images/grid.svg';
import './scss/index.scss';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = window.innerWidth;
  const height = window.innerHeight - 60;
  const grid = new Grid({ x: width, y: height });

  const setGrid = () => {
    const gridImage = document.getElementById('gridImageBg');
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && gridImage) {
        let now = 0;
        const tickLoop = (epoch: number) => {
          const tick = epoch - now;
          now = epoch;
          ctx.clearRect(0, 0, width, height);
          grid.update(tick);
          grid.draw(ctx, gridImage as CanvasImageSource);
          requestAnimationFrame(tickLoop);
        };
        requestAnimationFrame(tickLoop);
      }
    }
  };

  useEffect(() => {
    setGrid();
  });

  const pStyle = {
    display: 'none',
  };

  const newNode = () => {
    grid.newNode();
  };

  return (
    <div className='container'>
      <div className='container--canvas'>
        <img src={gridImageBg} id='gridImageBg' style={pStyle} alt='grid'/>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
      <div className='container--inspector'>inspector</div>
      <div className='container--buttons'>
        <button onClick={newNode}>New Node</button>
      </div>
    </div>
  );
};

export { App };
