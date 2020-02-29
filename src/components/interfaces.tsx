export interface XYInterface {
  x: number;
  y: number;
}

export interface ControlsInterface {
  prevX: number | null;
  prevY: number | null;
  isDragging: boolean;
}

export interface ObjectInterface {
  category: string;
  color: string;
  categoryImage: string;
  description: string;
  hidden: boolean;
  hovered: boolean;
  mainToolbarIcon: string;
  name: string;
  named: string;
  offSet: XYInterface;
  placeholder: boolean;
  position: XYInterface;
  selected: boolean;
  size: XYInterface;
  draw(ctx: CanvasRenderingContext2D, imageCache: HTMLImageElement[] | undefined): void;
  updateSize(position: XYInterface): void;
}

export interface ActionInterface {
  type: string;
  value: ObjectInterface | ObjectInterface[] | number | null | boolean | string;
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
    align: string | null;
    delete: boolean;
  };
}

export interface ToolbarInterface {
  [key: string]: ObjectInterface[];
 }
