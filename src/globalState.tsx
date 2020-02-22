import { createContext } from 'react';

interface ActionInterface {
  type: string;
  value: object;
}

interface ObjectInterface {
  position: {
    x: number,
    y: number,
  };
  size: {
    x: number,
    y: number,
  };
  draw(ctx: CanvasRenderingContext2D): void;
}

const Dispatch = createContext({
  dispatch: (action: ActionInterface) => {
    //
  },
});

interface StateInterface {
  objects: {
    objectArray: ObjectInterface[];
    selected: object;
  };
}

const InitialState: StateInterface = {
  objects: {
    objectArray: [],
    selected: {},
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
