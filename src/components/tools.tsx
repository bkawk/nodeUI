import React, { useState } from 'react';
import { Grid } from '../grid';
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
      <img
        src={fullScreen}
        alt='full screen'
        className='tools--full-screen'
        onClick={goFullScreen}
      />
    </div>
  );
};

export { Tools };
