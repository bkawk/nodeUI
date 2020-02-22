import React, { useContext, useEffect, useState } from 'react';
import { Global } from '../globalState';

const Inspector: React.FC = () => {
  const { global } = useContext(Global);
  const [state, setState] = useState({
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.addEventListener(
        'mouseup',
        (event) => {
          //
        },
        false
      );
    }
  }, []);

  return (
    <div className='inspector'>
      <div className='inspector--container'>
        <div className='inspector--description'>Cursor X</div>
        <input type='text' value={0} />
      </div>

      <div className='inspector--container'>
        <div className='inspector--description'>Cursor Y</div>
        <input type='text' value={0} />
      </div>

      <div className='inspector--container'>
        <div className='inspector--description'>Canvas X</div>
        <input type='text' value={0} />
      </div>

      <div className='inspector--container'>
        <div className='inspector--description'>Canvas Y</div>
        <input type='text' value={0} />
      </div>
    </div>
  );
};

export { Inspector };
