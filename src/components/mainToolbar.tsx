import React, { useState } from 'react';
import { Grid } from '../grid';

interface PropsInterface {
  grid: Grid;
}

const MainToolbar: React.FC<PropsInterface> = (props: PropsInterface) => {
  const { grid } = props;
  const tabs = Object.keys(grid.mainToolbar);
  const nodes = (tab: string) => {
    const arr = [];
    for (const value of grid.mainToolbar[tab]) {
      arr.push({ name: value.name, mainToolbarIcon: value.mainToolbarIcon });
    }
    return arr;
  };
  const [state, setState] = useState({
    nodes: nodes(tabs[0]),
    selected: 'shapes',
  });

  const newNode = (event: React.MouseEvent<HTMLDivElement>) => {
    const nodeToPush = event.currentTarget.id;
    grid.newNode(nodeToPush);
  };

  const changeTab = (event: React.MouseEvent<HTMLDivElement>) => {
    event.persist();
    const tab = event.currentTarget.id;
    setState((prev) => ({
      ...prev,
      nodes: nodes(tab),
      selected: tab,
    }));
  };

  return (
    <div className='main-toolbar'>
      <div className='main-toolbar--tab-container'>
        {React.Children.toArray(
          tabs.map((item) => (
            <div
              className={`${
                state.selected === item
                  ? 'main-toolbar--tab-selected'
                  : 'main-toolbar--tab'
              }`}
              onClick={changeTab}
              id={item}
            >
              {item}
            </div>
          ))
        )}
        <div className='main-toolbar--blank'></div>
      </div>
      <div className='main-toolbar--button-container'>
        {React.Children.toArray(
          state.nodes.map((item, i) => (
            <div
              className='main-toolbar--button'
              id={item.name}
              onClick={newNode}
            >
              <div className='main-toolbar--button-img'>
                <img src={item.mainToolbarIcon} alt={item.name} />
              </div>
              <div className='main-toolbar--button-txt'>{item.name}</div>
            </div>
          ))
        )}
        <div className='main-toolbar--button-blank'></div>
      </div>
    </div>
  );
};

export { MainToolbar };
