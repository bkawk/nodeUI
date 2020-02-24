export interface XYInterface {
  x: number;
  y: number;
}

export interface ObjectInterface {
  categoryImageSrc: string;
  name: string;
  named: string;
  category: string;
  mainToolbarIcon: string;
  position: XYInterface;
  size: XYInterface;
  draw(ctx: CanvasRenderingContext2D): void;
  updatePosition(position: XYInterface): void;
  updateColor(color: string): void;
  toggleSelected(toggle: boolean): void;
  toggleHovered(toggle: boolean): void;
}

export interface ActionInterface {
  type: string;
  value: ObjectInterface | ObjectInterface[] | number | null;
}

export interface StateInterface {
  draw: number;
  objects: {
    objectArray: ObjectInterface[];
    selectedArray: ObjectInterface[] | null;
  };
}

export interface ToolbarInterface {
  [key: string]: ObjectInterface[];
 }
