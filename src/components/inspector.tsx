import React, { useEffect, useState } from 'react';
import { Grid } from '../grid';

interface PropsInterface {
  grid: Grid;
}

const Inspector: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { grid } = props;

  const [state, setState] = useState({
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.addEventListener(
        'mousemove',
        (event) => {
          setState((prev) => ({
            ...prev,
            offsetX: event.offsetX,
            offsetY: event.offsetY,
          }));
        },
        false
      );
    }
  }, []);

  return (
    <div className='inspector'>
      <div className='inspector--container'>
        <div className='inspector--description'>Cursor X</div>
        <input type='text' value={state.offsetX} />
      </div>

      <div className='inspector--container'>
        <div className='inspector--description'>Cursor Y</div>
        <input type='text' value={state.offsetY} />
      </div>
    </div>
  );
};

export { Inspector };
