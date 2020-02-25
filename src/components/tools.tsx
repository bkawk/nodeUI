import React, { useContext, useState } from 'react';
import { Dispatch, TOGGLE_SELECTOR, TOGGLE_SNAP } from '../globalState';
import bottomImage from '../images/bottom.svg';
import centerImage from '../images/center.svg';
import fullScreenImage from '../images/full-screen.svg';
import leftImage from '../images/left.svg';
import middleImage from '../images/middle.svg';
import pointerImage from '../images/pointer.svg';
import rightImage from '../images/right.svg';
import snapImage from '../images/snap.svg';
import topImage from '../images/top.svg';

const Tools: React.FC = () => {
  const { dispatch } = useContext(Dispatch);
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
    const value = !selector;
    dispatch({ type: TOGGLE_SELECTOR, value });
    setSelector(value);
  };

  const toggleSnap = () => {
    const value = !snap;
    dispatch({ type: TOGGLE_SNAP, value });
    setSnap(value);
  };

  return (
    <div className='tools'>
      <div className='tools--container'>
        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={pointerImage} alt='pooiinter' />
        </div>

        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={leftImage} alt='pooiinter' />
        </div>

        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={centerImage} alt='pooiinter' />
        </div>

        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={rightImage} alt='pooiinter' />
        </div>

        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={topImage} alt='pooiinter' />
        </div>

        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={middleImage} alt='pooiinter' />
        </div>
        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={bottomImage} alt='pooiinter' />
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
