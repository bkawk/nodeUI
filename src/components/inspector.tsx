import React, { useContext, useEffect, useState } from 'react';
import { Dispatch, Global } from '../globalState';
import { DRAW } from '../globalState';
import colors from '../images/colors.svg';
import { ObjectInterface, XYInterface } from './interfaces';

const Inspector: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const [position, setPosition] = useState<XYInterface>({ x: 0, y: 0 });
  const [selected, setSelected] = useState<ObjectInterface | null>();
  const [showColors, setShowColors] = useState<boolean>(false);
  const [categoryImage, setCategoryImage] = useState<string>();
  const [categoryName, setCategoryName] = useState<string>();
  const [named, setNamed] = useState<string>();

  const hexColors = [
    '#C81B00',
    '#FA2200',
    '#F54E44',
    '#FBB0AE',
    '#FB8AA0',
    '#9D5666',
    '#8F5C00',
    '#B28500',
    '#F5C926',
    '#FCFAA3',
    '#FAEF00',
    '#FABB00',
    '#4D8600',
    '#78CF00',
    '#C2FF88',
    '#9FDDC2',
    '#31A98C',
    '#368674',
    '#2D5CB4',
    '#578EE6',
    '#9BC5FF',
    '#B9C7FF',
    '#878EC0',
    '#63688F',
    '#564198',
    '#785DD0',
    '#947DE0',
    '#E16CC6',
    '#92377C',
    '#613056',
    '#000000',
    '#4E4E4E',
    '#7A7A7A',
    '#999999',
    '#D6D6D6',
    '#FFFFFF',
  ];
  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

  const changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamed(event.target.value.replace(' ', '_'));
    if (selected) selected.named = event.target.value;
    draw();
  };
  const changePosition = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'x') {
      setPosition({x: +event.target.value , y: position.y});
      if (selected) selected.position = {x: +event.target.value , y: position.y};
      draw();
    } else {
      setPosition({x: position.x , y: +event.target.value});
      if (selected) selected.position = {x: position.x , y: +event.target.value};
      draw();
    }
  };

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const generateColors = () => {
    const arr = [];
    for (const value in hexColors) {
      if (value) {
        arr.push(
          <div
            id={hexColors[value]}
            onClick={setColor}
            className='inspector--color'
            style={{ backgroundColor: `${hexColors[value]}` }}
          ></div>
        );
      }
    }
    return arr;
  };

  const setColor = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const color = event.currentTarget.id;
    if (selected) selected.updateColor(color);
    draw();
    // push draw event to canvas by dispatching it to global state, then have the canvas use efect listen for changes
  };

  useEffect(() => {
    setSelected(null);
    if (
      global.objects.selectedArray &&
      global.objects.selectedArray.length === 1
    ) {
      const selectedOne = global.objects.selectedArray[0];
      setPosition({ x: selectedOne.position.x, y: selectedOne.position.y });
      setSelected(selectedOne);
      setCategoryImage(selectedOne.categoryImageSrc);
      setCategoryName(selectedOne.category);
      setNamed(selectedOne.named);
    }
  }, [global.objects.selectedArray, global.draw]);

  return (
    <div className='inspector'>
      {selected && (
        <React.Fragment>
          <div className='inspector--shelf'>
            <img src={categoryImage} className='inspector--category-icon' />
            <p className='inspector--category-name'>{categoryName}</p>
            <input
              type='text'
              className='inspector--name-input'
              spellCheck='false'
              onChange={changeName}
              value={named}
            />
            <img
              src={colors}
              alt='colors'
              onClick={toggleColors}
              className='inspector--colors-buutton'
            />
          </div>
          <div className='inspector--container'>
            <div
              className={`${
                showColors === true
                  ? 'inspector--colors'
                  : 'inspector--colors-hidden'
              }`}
            >
              {generateColors()}
            </div>

            <div className='inspector--item-two'>
              <div className='inspector--description'>Position</div>
              <input type='number' value={position.x} id='x' onChange={changePosition} />
              <input type='number' value={position.y} id='y' onChange={changePosition} />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export { Inspector };