import React, { useContext, useEffect, useState } from 'react';
import { Dispatch, Global } from '../globalState';
import { DRAW } from '../globalState';
import colors from '../images/colors.svg';
import { ObjectInterface, XYInterface } from './interfaces';

const Inspector: React.FC = () => {
  const { global } = useContext(Global);
  const { dispatch } = useContext(Dispatch);
  const [size, setSize] = useState<XYInterface>({x: 0, y: 0});
  const [position, setPosition] = useState<XYInterface>({x: 0, y: 0});
  const [selected, setSelected] = useState<ObjectInterface>();
  const [showColors, setShowColors] = useState<boolean>(false);

  const draw = () => {
    dispatch({ type: DRAW, value: Date.now() });
  };

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const setColor = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const color = event.currentTarget.id;
    if (selected) selected.updateColor(color);
    draw();
    // push draw event to canvas by dispatching it to global state, then have the canvas use efect listen for changes
  };

  useEffect(() => {
    if (global.objects.selectedArray && global.objects.selectedArray.length > 0) {
      const selectedOne = global.objects.selectedArray[0];
      setSize({x: selectedOne.size.x, y: selectedOne.size.y});
      setPosition({x: selectedOne.position.x, y: selectedOne.position.y});
      setSelected(selectedOne);
    }
  }, [global.objects.selectedArray, global.draw]);

  return (
    <div className='inspector'>
      <div className='inspector--shelf'>
        <img src={colors} alt='colors' onClick={toggleColors} className='inspector--colors-buutton'/>
      </div>
      <div className='inspector--container'>
        <div className={`${showColors === true ? 'inspector--colors' : 'inspector--colors-hidden'}`}>

          <div id='#C81B00' onClick={setColor} className='inspector--color' style={{backgroundColor: '#C81B00'}}></div>
          <div id='#FA2200' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FA2200'}}></div>
          <div id='#F54E44' onClick={setColor} className='inspector--color' style={{backgroundColor: '#F54E44'}}></div>
          <div id='#FBB0AE' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FBB0AE'}}></div>
          <div id='#FB8AA0' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FB8AA0'}}></div>
          <div id='#9D5666' onClick={setColor} className='inspector--color' style={{backgroundColor: '#9D5666'}}></div>
          <div id='#8F5C00' onClick={setColor} className='inspector--color' style={{backgroundColor: '#8F5C00'}}></div>
          <div id='#B28500' onClick={setColor} className='inspector--color' style={{backgroundColor: '#B28500'}}></div>
          <div id='#F5C926' onClick={setColor} className='inspector--color' style={{backgroundColor: '#F5C926'}}></div>
          <div id='#FCFAA3' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FCFAA3'}}></div>
          <div id='#FAEF00' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FAEF00'}}></div>
          <div id='#FABB00' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FABB00'}}></div>
          <div id='#4D8600' onClick={setColor} className='inspector--color' style={{backgroundColor: '#4D8600'}}></div>
          <div id='#78CF00' onClick={setColor} className='inspector--color' style={{backgroundColor: '#78CF00'}}></div>
          <div id='#C2FF88' onClick={setColor} className='inspector--color' style={{backgroundColor: '#C2FF88'}}></div>
          <div id='#9FDDC2' onClick={setColor} className='inspector--color' style={{backgroundColor: '#9FDDC2'}}></div>
          <div id='#31A98C' onClick={setColor} className='inspector--color' style={{backgroundColor: '#31A98C'}}></div>
          <div id='#368674' onClick={setColor} className='inspector--color' style={{backgroundColor: '#368674'}}></div>
          <div id='#2D5CB4' onClick={setColor} className='inspector--color' style={{backgroundColor: '#2D5CB4'}}></div>
          <div id='#578EE6' onClick={setColor} className='inspector--color' style={{backgroundColor: '#578EE6'}}></div>
          <div id='#9BC5FF' onClick={setColor} className='inspector--color' style={{backgroundColor: '#9BC5FF'}}></div>
          <div id='#B9C7FF' onClick={setColor} className='inspector--color' style={{backgroundColor: '#B9C7FF'}}></div>
          <div id='#878EC0' onClick={setColor} className='inspector--color' style={{backgroundColor: '#878EC0'}}></div>
          <div id='#63688F' onClick={setColor} className='inspector--color' style={{backgroundColor: '#63688F'}}></div>
          <div id='#564198' onClick={setColor} className='inspector--color' style={{backgroundColor: '#564198'}}></div>
          <div id='#785DD0' onClick={setColor} className='inspector--color' style={{backgroundColor: '#785DD0'}}></div>
          <div id='#947DE0' onClick={setColor} className='inspector--color' style={{backgroundColor: '#947DE0'}}></div>
          <div id='#E16CC6' onClick={setColor} className='inspector--color' style={{backgroundColor: '#E16CC6'}}></div>
          <div id='#92377C' onClick={setColor} className='inspector--color' style={{backgroundColor: '#92377C'}}></div>
          <div id='#613056' onClick={setColor} className='inspector--color' style={{backgroundColor: '#613056'}}></div>
          <div id='#000000' onClick={setColor} className='inspector--color' style={{backgroundColor: '#000000'}}></div>
          <div id='#4E4E4E' onClick={setColor} className='inspector--color' style={{backgroundColor: '#4E4E4E'}}></div>
          <div id='#7A7A7A' onClick={setColor} className='inspector--color' style={{backgroundColor: '#7A7A7A'}}></div>
          <div id='#7A7A7A' onClick={setColor} className='inspector--color' style={{backgroundColor: '#7A7A7A'}}></div>
          <div id='#D6D6D6' onClick={setColor} className='inspector--color' style={{backgroundColor: '#D6D6D6'}}></div>
          <div id='#FFFFFF' onClick={setColor} className='inspector--color' style={{backgroundColor: '#FFFFFF'}}></div>
        </div>
        <div className='inspector--item'>
          <div className='inspector--description'>Width</div>
          <input type='text' value={size.x} />
        </div>

        <div className='inspector--item'>
          <div className='inspector--description'>Height</div>
          <input type='text' value={size.y} />
        </div>

        <div className='inspector--item'>
          <div className='inspector--description'>Position X</div>
          <input type='text' value={position.x} />
        </div>

        <div className='inspector--item'>
          <div className='inspector--description'>Position Y</div>
          <input type='text' value={position.y} />
        </div>
      </div>
    </div>
  );
};

export { Inspector };
