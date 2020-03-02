import React, { useContext, useState } from 'react';
import { ToolbarInterface } from '../components/interfaces';
import { ADD_OBJECT, Dispatch } from '../globalState';
import { Auth } from '../nodes/api/auth';
import { Headers } from '../nodes/api/headers';
import { Params } from '../nodes/api/params';
import { Request } from '../nodes/api/request';
import { Response } from '../nodes/api/response';
import { Socket } from '../nodes/api/socket';
import { Timer } from '../nodes/api/timer';
import { Trigger } from '../nodes/api/trigger';
import { Rectangle } from '../nodes/shapes/rectangle';
import { Square } from '../nodes/shapes/square';

const MainToolbar: React.FC  = () => {
  const { dispatch } = useContext(Dispatch);
  const toolbar = {
    API: [new Trigger(), new Timer(), new Request(), new Socket(), new Params(), new Auth(), new Headers(), new Response() ], // tslint:disable-line
    Shapes: [
      new Square(), new Rectangle(),
    ],
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
    selected: 'API',
  });

  const newNode = (event: React.MouseEvent<HTMLDivElement>) => {
    const nodeToPush = event.currentTarget.id;
    if (nodeToPush === 'Square') {
      dispatch({ type: ADD_OBJECT, value: new Square() });
    }
    if (nodeToPush === 'Rectangle') {
      dispatch({ type: ADD_OBJECT, value: new Rectangle() });
    }
    if (nodeToPush === 'Trigger') {
      dispatch({ type: ADD_OBJECT, value: new Trigger() });
    }
    if (nodeToPush === 'Timer') {
      dispatch({ type: ADD_OBJECT, value: new Timer() });
    }
    if (nodeToPush === 'Request') {
      dispatch({ type: ADD_OBJECT, value: new Request() });
    }
    if (nodeToPush === 'Socket') {
      dispatch({ type: ADD_OBJECT, value: new Socket() });
    }
    if (nodeToPush === 'Params') {
      dispatch({ type: ADD_OBJECT, value: new Params() });
    }
    if (nodeToPush === 'Auth') {
      dispatch({ type: ADD_OBJECT, value: new Auth() });
    }
    if (nodeToPush === 'Headers') {
      dispatch({ type: ADD_OBJECT, value: new Headers() });
    }
    if (nodeToPush === 'Response') {
      dispatch({ type: ADD_OBJECT, value: new Response() });
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
