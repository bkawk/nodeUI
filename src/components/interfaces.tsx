export interface XYInterface {
  x: number;
  y: number;
}

export interface ObjectInterface {
  offSet: XYInterface;
  selected: boolean;
  description: string;
  categoryImage: string;
  name: string;
  named: string;
  category: string;
  mainToolbarIcon: string;
  position: XYInterface;
  size: XYInterface;
  draw(ctx: CanvasRenderingContext2D, imageCache: HTMLImageElement[] | undefined): void;
  updatePosition(position: XYInterface): void;
  updateSize(position: XYInterface): void;
  updateColor(color: string): void;
  toggleSelected(toggle: boolean): void;
  toggleHovered(toggle: boolean): void;
}

export interface ActionInterface {
  type: string;
  value: ObjectInterface | ObjectInterface[] | number | null | boolean;
}

export interface StateInterface {
  draw: number;
  objects: {
    objectArray: ObjectInterface[];
    selectedArray: ObjectInterface[];
  };
  tools: {
    snap: boolean;
    selector: boolean;
  };
}

export interface ToolbarInterface {
  [key: string]: ObjectInterface[];
 }
