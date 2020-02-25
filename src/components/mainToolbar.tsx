import React, { useContext, useState } from 'react';
import { ToolbarInterface } from '../components/interfaces';
import { Square } from '../components/square';
import { ADD_OBJECT, Dispatch } from '../globalState';

const MainToolbar: React.FC  = () => {
  const { dispatch } = useContext(Dispatch);
  const toolbar = {
    shapes: [
      new Square(),
    ],
    data: [new Square(), new Square(), ], // tslint:disable-line
  } as ToolbarInterface;

  const tabs = Object.keys(toolbar);
  const nodes = (tab: string) => {
    const arr = [];
    for (const value of toolbar[tab]) {
      arr.push({ name: value.name, mainToolbarIcon: value.mainToolbarIcon, description: value.description });
    }
    return arr;
  };

  const [state, setState] = useState({
    nodes: nodes(tabs[0]),
    selected: 'shapes',
  });

  const newNode = (event: React.MouseEvent<HTMLDivElement>) => {
    const nodeToPush = event.currentTarget.id;
    if (nodeToPush === 'Square') {
      dispatch({ type: ADD_OBJECT, value: new Square() });
    }

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
              <div className='main-toolbar--help'>
                <div className='main-toolbar--help-title'>{item.name}</div>
                <div>{item.description}</div>
              </div>
            </div>
          ))
        )}
        <div className='main-toolbar--button-blank'></div>
      </div>
    </div>
  );
};

export { MainToolbar };
