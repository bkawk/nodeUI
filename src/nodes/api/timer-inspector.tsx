import React, { useContext, useEffect, useState } from 'react';
import { ObjectInterface, XYInterface } from '../../components/interfaces';
import { Dispatch, DRAW, Global } from '../../globalState';

interface PropsInterface {
  selected: ObjectInterface;
}

const TimerInspector: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { dispatch } = useContext(Dispatch);
  const [position, setPosition] = useState<XYInterface>({ x: 0, y: 0 });
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [timeLeftLabel, setTimeLeftLabel] = useState<number>(20);
  const [start, setStart] = useState<boolean>(false);
  const [circleDasharray, setCircleDasharray] = useState<number>(-1000);

  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

  const slider = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeLimit(+event.currentTarget.value);
  };

  const sliderDown = () => setStart(false);
  const sliderUp = () => setStart(true);

  const changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'x') {
      setPosition({ x: +event.target.value, y: position.y });
      if (props.selected) {
        props.selected.position = { x: +event.target.value, y: position.y };
      }
    } else {
      setPosition({ x: position.x, y: +event.target.value });
      if (props.selected) {
        props.selected.position = { x: position.x, y: +event.target.value };
      }
    }
    draw();
  };

  const changeSeconds = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = +event.currentTarget.value;
    if (value > 240) value = 240;
    if (value < 1) value = 1;
    props.selected.settings.seconds = +value;
    setTimeLimit(+value);
  };

  const toggleStart = () => {
    const localStart = !start;
    setStart(localStart);
  };

  const test = () => {
    console.log('fire');
  };

  useEffect(() => {
    setCircleDasharray(-1000);
    const setTime = timeLimit * 100;
    let timePassed = (setTime);
    let timeLeft = setTime;
    if (timeLeft && start) {
      const timerInterval = setInterval(() => {
        if (timeLeft <= 0) timePassed = 0;
        timePassed += 1;
        timeLeft = setTime - timePassed;
        const dash = ((setTime - timePassed) / setTime - (1 / setTime) * (1 - (setTime - timePassed) / setTime)) * 283;
        setTimeLeftLabel(setTime - timePassed);
        setCircleDasharray(dash);
      }, 10);
      return () => {
        clearInterval(timerInterval);
      };
    }
  }, [start]);

  useEffect(() => {
    setPosition({ x: props.selected.position.x, y: props.selected.position.y });
  }, [props.selected.position]);

  return (
    <React.Fragment>
      <div className='inspector--item-two'>
        <div className='inspector--description'>Position</div>
        <input
          type='number'
          value={Math.floor(position.x)}
          id='x'
          onChange={changePosition}
        />
        <input
          type='number'
          value={Math.floor(position.y)}
          id='y'
          onChange={changePosition}
        />
      </div>
      <div className='inspector--item-two'>
        <div className='inspector--description'>Seconds</div>
        <input
          type='number'
          value={Math.floor(timeLimit)}
          min={1}
          max={240}
          onChange={changeSeconds}
        />
        <input
          type='range'
          id='points'
          name='points'
          min='1'
          max='240'
          value={timeLimit}
          onChange={slider}
          onMouseDown={sliderDown}
          onMouseUp={sliderUp}
        />
      </div>

      <div className='inspector--item-two'>
        <div className='inspector--description'></div>
        <button onClick={toggleStart}>{start ? 'Stop' : 'Start'} </button>
        <button onClick={test}>Test</button>
      </div>

{ start &&
      <div className='timer'>
        <svg
          className='timer--svg'
          viewBox='0 0 100 100'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g className='timer--circle'>
            <circle
              className='timer--ring'
              cx='50'
              cy='50'
              r='45'
            ></circle>
            <path
              stroke-dasharray={`${circleDasharray.toFixed(0)} 283`}
              className={ start ? 'timer--dash' : 'timer--dash-none'}
              d='
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        '
            ></path>
          </g>
        </svg>
        <div className='timer--label'>{(timeLeftLabel / 100).toFixed(1)}</div>
      </div>
      }
    </React.Fragment>
  );
};

export { TimerInspector };
