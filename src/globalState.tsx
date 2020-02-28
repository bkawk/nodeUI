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
  tools: {
    align: null,
    delete: false,
    selector: false,
    snap: false,
  },
};

const Global = createContext({
  global: InitialState,
});

const ADD_OBJECT = 'ADD_OBJECT';
const CLEAR_SELECTED = 'CLEAR_SELECTED';
const DELETE_SELECTED = 'DELETE_SELECTED';
const DRAW = 'DRAW';
const NEW_SELECTED = 'NEW_SELECTED';
const PUSH_SELECTED = 'PUSH_SELECTED';
const REMOVE_OBJECT = 'REMOVE_OBJECT';
const SET_ALIGN = 'SET_ALIGN';
const TOGGLE_SELECTOR = 'TOGGLE_SELECTOR';
const TOGGLE_SNAP = 'TOGGLE_SNAP';

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
    case 'TOGGLE_SNAP':
      return {
        ...state,
        tools: { ...state.tools, snap: action.value },
      };
    case 'DELETE_SELECTED':
      return {
        ...state,
        tools: { ...state.tools, delete: action.value },
      };
    case 'SET_ALIGN':
      return {
        ...state,
        tools: { ...state.tools, align: action.value },
      };
    case 'TOGGLE_SELECTOR':
      return {
        ...state,
        tools: { ...state.tools, selector: action.value },
      };
    case 'ADD_OBJECT':
      return {
        ...state,
        objects: {
          ...state.objects,
          objectArray: [...state.objects.objectArray, action.value],
        },
      };
    case 'REMOVE_OBJECT':
      return {
        ...state,
        objects: {
          ...state.objects,
          objectArray: state.objects.objectArray.filter(
            (obj) => obj !== action.value
          ),
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
  DELETE_SELECTED,
  Dispatch,
  DRAW,
  Global,
  InitialState,
  NEW_SELECTED,
  PUSH_SELECTED,
  Reducer,
  REMOVE_OBJECT,
  SET_ALIGN,
  TOGGLE_SELECTOR,
  TOGGLE_SNAP,
};
