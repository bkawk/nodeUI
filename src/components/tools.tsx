import React, { useState } from 'react';
import { Grid } from '../grid';
import colors from '../images/colors.svg';
import fullScreen from '../images/full-screen.svg';

interface PropsInterface {
  grid: Grid;
}

const Tools: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { grid } = props;

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
          <img
            src={fullScreen}
            alt='full screen'
            onClick={goFullScreen}
          />
        </div>
        <div className='tools--box'>
          <img
            src={colors}
            alt='colors'
          />
        </div>
      </div>
    </div>
  );
};

export { Tools };
