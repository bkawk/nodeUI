import React, { useContext, useEffect, useState } from 'react';
import { ObjectInterface, XYInterface } from '../../components/interfaces';
import { Dispatch, DRAW, Global } from '../../globalState';

interface PropsInterface {
  selected: ObjectInterface;
}

const TimerInspector: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const [position, setPosition] = useState<XYInterface>({ x: 0, y: 0 });
  const [size, setSize] = useState<XYInterface>({ x: 50, y: 50 });

  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

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

  const changeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'x') {
      setSize({ x: +event.target.value, y: size.y });
      if (props.selected) {
        props.selected.size = { x: +event.target.value, y: size.y };
      }
    } else {
      setSize({ x: size.x, y: +event.target.value });
      if (props.selected) {
        props.selected.size = { x: size.x, y: +event.target.value };
      }
    }
    draw();
  };

  useEffect(() => {
    setPosition({ x: props.selected.position.x, y: props.selected.position.y });
    setSize({ x:  props.selected.size.x, y:  props.selected.size.y });
  }, [props.selected]);

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
    <div className='inspector--description'>Size</div>
    <input
      type='number'
      value={Math.floor(size.x)}
      id='x'
      onChange={changeSize}
    />
    <input
      type='number'
      value={Math.floor(size.y)}
      id='y'
      onChange={changeSize}
    />
    </div>
    </React.Fragment>
  );
};

export { TimerInspector };
