import React, { useState } from 'react';
import fullScreen from '../images/full-screen.svg';
import pointer from '../images/pointer.svg';
import snap from '../images/snap.svg';

const Tools: React.FC = () => {
  const [state, setState] = useState({
    fullScreen: false,
  });

  const goFullScreen = () => {
    setState((prev) => ({
      ...prev,
      fullScreen: !state.fullScreen,
    }));
    const elem = document.documentElement;

    if (elem.requestFullscreen && !state.fullScreen) {
      elem.requestFullscreen();
    }
    if (document.exitFullscreen && state.fullScreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className='tools'>
      <div className='tools--container'>
        <div className='tools--box'>
          <img src={pointer} alt='pooiinter' />
        </div>
        <div className='tools--box'>
          <img src={snap} alt='snap' />
        </div>
        <div className='tools--box'>
          <img src={fullScreen} alt='full screen' onClick={goFullScreen} />
        </div>
      </div>
    </div>
  );
};

export { Tools };
