import React, { useContext, useEffect, useState } from 'react';
import { DELETE_SELECTED, Dispatch, Global, TOGGLE_SELECTOR, TOGGLE_SNAP} from '../globalState';
import deleteImage from '../images/delete.svg';
import fullScreenImage from '../images/full-screen.svg';
import pointerImage from '../images/pointer.svg';
import snapImage from '../images/snap.svg';

const Tools: React.FC = () => {
  const { global } = useContext(Global);
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
  const deleteSelected = () => {
    const value = true;
    dispatch({ type: DELETE_SELECTED, value });
  };

  useEffect(() => {
    if (selector === true && global.tools.selector === false) {
      setSelector(false);
    }
    if (selector === false && global.tools.selector === true) {
      setSelector(true);
    }
  }, [global.tools.selector, selector]);

  return (
    <div className='tools'>
      <div className='tools--container'>
        <div className={`${selector ? 'tools--box-on' : 'tools--box'}`} onClick={toggleSelector}>
          <img src={pointerImage} alt='Select' />
          <div className='tools--help'>Select</div>
        </div>
        <div className='tools--box' onClick={deleteSelected}>
          <img src={deleteImage} alt='Delete selected' />
          <div className='tools--help'>Delete selected</div>
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
