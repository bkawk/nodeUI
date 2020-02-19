export interface XYInterface {
  x: number;
  y: number;
}

export interface MainToolbarInterface {
  [key: string]: any;
}

export interface ControlInterface {
  view: { x: number; y: number; zoom: number };
  viewPos: {
    prevX: number | null;
    prevY: number | null;
    isDragging: boolean;
  };
}

export interface NodesInterface {
  canvasSize: XYInterface;
  controls: ControlInterface;
}

export interface InputHandlerInterface {
  setZoom(event: WheelEvent): void;
  setPan(event: MouseEvent, mouseDown: boolean): void;
  setMouseDown(event: MouseEvent, mouseDown: boolean): void;
  setMove(event: MouseEvent, mouseDown: boolean): void;
  setMouseUp(event: MouseEvent): void;
}

export interface NodeObjectInterface {
  canvasSize: XYInterface;
  position: XYInterface;
  size: XYInterface;
  name: string;
  update(tick: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  updatePosition(position: XYInterface): void;
}
