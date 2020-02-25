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

  const alignLeft = () => {
    //
  };
  const alignCenter = () => {
    //
  };
  const alignRight = () => {
    //
  };
  const alignTop = () => {
    //
  };
  const alignMiddle = () => {
    //
  };
  const alignBottom = () => {
    //
  };

  return (
    <div className='tools'>
      <div className='tools--container'>
        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={pointerImage} alt='Select' />
          <div className='tools--help'>Select</div>
        </div>

        <div className='tools--box' onClick={alignLeft}>
          <img src={leftImage} alt='Align left' />
          <div className='tools--help'>Align left</div>
        </div>

        <div className='tools--box' onClick={alignCenter}>
          <img src={centerImage} alt='Align center' />
          <div className='tools--help'>Align center</div>
        </div>

        <div className='tools--box' onClick={alignRight}>
          <img src={rightImage} alt='Align right' />
          <div className='tools--help'>Align right</div>
        </div>

        <div className='tools--box' onClick={alignTop}>
          <img src={topImage} alt='Align Top' />
          <div className='tools--help'>Align top</div>
        </div>

        <div className='tools--box' onClick={alignMiddle}>
          <img src={middleImage} alt='Align Middle' />
          <div className='tools--help'>Align middle</div>
        </div>
        <div className='tools--box' onClick={alignBottom}>
          <img src={bottomImage} alt='Align bottom' />
          <div className='tools--help'>Align bottom</div>
        </div>

        <div className={`${snap ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSnap}>
          <img src={snapImage} alt='Snap to grid' />
          <div className='tools--help'>Snap to grid</div>
        </div>
        <div className={`${fullScreen ? 'tools--box-on' : 'tools--box'}`} onClick={toggleFullScreen}>
          <img src={fullScreenImage} alt='Full Screen' />
          <div className='tools--help'>Full screen</div>
        </div>
      </div>
    </div>
  );
};

export { Tools };
