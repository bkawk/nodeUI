import React from 'react';
import { Grid } from '../grid';
import circle from '../images/circle.svg';
import line from '../images/line.svg';
import square from '../images/square.svg';

interface PropsInterface {
  grid: Grid;
}

const MainToolbar: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { grid } = props;

  const newNode = () => {
    grid.newNode();
  };

  return (
    <div className='main-toolbar'>
      <div className='main-toolbar--tab-container'>
        <div className='main-toolbar--tab-selected'>Shapes</div>
        <div className='main-toolbar--tab'>Data</div>
        <div className='main-toolbar--blank'></div>
      </div>
      <div className='main-toolbar--button-container'>
        <div className='main-toolbar--button' onClick={newNode}>
          <div className='main-toolbar--button-img'><img src={square} /></div>
          <div className='main-toolbar--button-txt'>Square</div>
        </div>
        <div className='main-toolbar--button'>
          <div className='main-toolbar--button-img'><img src={circle} /></div>
          <div className='main-toolbar--button-txt'>Circle</div>
        </div>
        <div className='main-toolbar--button'>
          <div className='main-toolbar--button-img'><img src={line} /></div>
          <div className='main-toolbar--button-txt'>Line</div>
        </div>
        <div className='main-toolbar--button-blank'></div>
      </div>
    </div>
  );
};

export { MainToolbar };
