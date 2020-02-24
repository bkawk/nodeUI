import React, { useState } from 'react';
import fullScreenImage from '../images/full-screen.svg';
import pointerImage from '../images/pointer.svg';
import snapImage from '../images/snap.svg';

const Tools: React.FC = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [selector, setSelector] = useState(false);
  const [snap, setSnap] = useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
    const elem = document.documentElement;
    if (elem.requestFullscreen && !fullScreen) elem.requestFullscreen();
    if (document.exitFullscreen && fullScreen) document.exitFullscreen();
  };

  const toggleSelector = () => {
    setSelector(!selector);
  };

  const toggleSnap = () => {
    setSnap(!snap);
  };

  return (
    <div className='tools'>
      <div className='tools--container'>
        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={pointerImage} alt='pooiinter' />
        </div>
        <div className={`${snap ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSnap}>
          <img src={snapImage} alt='snap' />
        </div>
        <div className={`${fullScreen ? 'tools--box-on' : 'tools--box'}`} onClick={toggleFullScreen}>
          <img src={fullScreenImage} alt='full screen' />
        </div>
      </div>
    </div>
  );
};

export { Tools };
