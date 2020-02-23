import { createContext } from 'react';
import { ActionInterface, StateInterface } from './components/interfaces';

const Dispatch = createContext({
  dispatch: (action: ActionInterface) => {
    //
  },
});

const InitialState: StateInterface = {
  draw: 0,
  objects: {
    objectArray: [],
    selectedArray: [],
  },
};

const Global = createContext({
  global: InitialState,
});

const NEW_SELECTED = 'NEW_SELECTED';
const PUSH_SELECTED = 'PUSH_SELECTED';
const CLEAR_SELECTED = 'CLEAR_SELECTED';
const ADD_OBJECT = 'ADD_OBJECT';
const DRAW = 'DRAW';

// tslint:disable-next-line: no-any
const Reducer = (state: StateInterface, action: any) => {
  switch (action.type) {
    case 'NEW_SELECTED':
      return {
        ...state,
        objects: { ...state.objects, selectedArray: action.value },
      };
    case 'CLEAR_SELECTED':
      return {
        ...state,
        objects: { ...state.objects, selectedArray: action.value },
      };
    case 'ADD_OBJECT':
      return {
        ...state,
        objects: {
          ...state.objects,
          objectArray: [...state.objects.objectArray, action.value],
        },
      };
    case 'DRAW':
      return {
        ...state,
        draw: action.value,
      };
    default:
      return state;
  }
};

export {
  ADD_OBJECT,
  CLEAR_SELECTED,
  Dispatch,
  DRAW,
  Global,
  InitialState,
  NEW_SELECTED,
  PUSH_SELECTED,
  Reducer,
};
