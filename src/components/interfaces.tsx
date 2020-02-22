export interface XYInterface {
  x: number;
  y: number;
}

export interface ObjectInterface {
  name: string;
  mainToolbarIcon: string;
  position: XYInterface;
  size: XYInterface;
  draw(ctx: CanvasRenderingContext2D): void;
  updatePosition(position: XYInterface): void;
  toggleSelected(toggle: boolean): void;
}

export interface ActionInterface {
  type: string;
  value: ObjectInterface | null;
}

export interface StateInterface {
  objects: {
    objectArray: ObjectInterface[];
    selected: ObjectInterface | null;
  };
}

export interface ToolbarInterface {
  [key: string]: ObjectInterface[];
 }

