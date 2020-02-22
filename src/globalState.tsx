import { createContext } from 'react';
import { ActionInterface, StateInterface } from './components/interfaces';

const Dispatch = createContext({
  dispatch: (action: ActionInterface) => {
    //
  },
});

const InitialState: StateInterface = {
  objects: {
    objectArray: [],
    selected: null,
  },
};

const Global = createContext({
  global: InitialState,
});

const SELECTED = 'SELECTED';
const ADD_OBJECT = 'ADD_OBJECT';

// tslint:disable-next-line: no-any
const Reducer = (state: StateInterface, action: any) => {
  switch (action.type) {
    case 'SELECTED':
      return {
        ...state,
        objects: { ...state.objects, selected: action.value },
      };
    case 'ADD_OBJECT':
      return {
        ...state,
        objects: { ...state.objects, objectArray: [...state.objects.objectArray, action.value]},
      };
    default:
      return state;
  }
};

export { Dispatch, Global, InitialState, Reducer, SELECTED, ADD_OBJECT };
