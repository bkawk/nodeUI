export interface XYInterface {
  x: number;
  y: number;
}

export interface ControlsInterface {
  isDragging: boolean;
  prevX: number | null;
  prevY: number | null;
}

export interface ObjectInterface {
  category: string;
  categoryImage: string;
  color: string;
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
  settings: any;
  draw(
    ctx: CanvasRenderingContext2D,
    imageCache: HTMLImageElement[] | undefined
  ): void;
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
    align: string | null;
    delete: boolean;
    selector: boolean;
    snap: boolean;
  };
}

export interface ToolbarInterface {
  [key: string]: ObjectInterface[];
}


export interface Category {
  name: string; // Tab name
  image: string; // Image for all nodes in that category
}