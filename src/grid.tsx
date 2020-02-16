import { InputHandler } from './components/inputHandler';
import { Placeholder } from './components/placeholder';
import { Square } from './components/square';

export interface XYInterface {
  x: number;
  y: number;
}

export interface ControlInterface {
  view: { x: number; y: number; zoom: number };
  viewPos: {
    prevX: number | null;
    prevY: number | null;
    isDragging: boolean;
    dragBg: boolean;
  };
}

export interface InputHandlerInterface {
  setZoom(event: WheelEvent): void;
  setPan(event: MouseEvent, mouseDown: boolean): void;
  setMouseDown(event: MouseEvent, mouseDown: boolean): void;
}

export interface NodeObjectInterface {
  canvasSize: XYInterface;
  position: XYInterface;
  size: XYInterface;
  name: string;
  update(tick: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

class Grid implements InputHandlerInterface {
  canvasSize: XYInterface;
  controls: ControlInterface;
  nodeObjects: NodeObjectInterface[];
  ctx!: CanvasRenderingContext2D;
  gridImage!: CanvasImageSource;

  constructor(canvasSize: XYInterface) {
    this.canvasSize = canvasSize;
    this.nodeObjects = [];
    this.controls = {
      view: { x: 0, y: 0, zoom: 1 },
      viewPos: { prevX: null, prevY: null, isDragging: false, dragBg: true },
    };
    new InputHandler(this);
  }

  newNode() {
    this.nodeObjects.push(new Square(this));
  }

  update(ctx: CanvasRenderingContext2D, gridImage: CanvasImageSource) {
    this.ctx = ctx;
    this.gridImage = gridImage;
    // TODO: only call update on objects that are being moved
    const tick = 0;
    this.nodeObjects.forEach((object) => object.update(tick));
  }

  draw(ctx: CanvasRenderingContext2D, gridImage: CanvasImageSource) {
    ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
    ctx.save();
    if (this.controls.viewPos.dragBg) {
      ctx.translate(this.controls.view.x, this.controls.view.y);
    }
    ctx.scale(this.controls.view.zoom, this.controls.view.zoom);
    const gridPatternBackground = ctx.createPattern(gridImage, 'repeat');
    ctx.rect(0, 0, this.canvasSize.x, this.canvasSize.y);
    if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
    ctx.fill();
    this.nodeObjects.forEach((object) => object.draw(ctx));
    ctx.restore();
  }

  setMouseDown(event: MouseEvent, mouseDown: boolean) {
    const { x, y } = event;
    if (mouseDown) {
      this.controls.viewPos.isDragging = true;
      this.controls.viewPos.prevX = x;
      this.controls.viewPos.prevY = y;
    }
    if (!mouseDown) {
      this.controls.viewPos.isDragging = false;
      this.controls.viewPos.prevX = null;
      this.controls.viewPos.prevY = null;
    }
    this.draw(this.ctx, this.gridImage);
  }
  setPan(event: MouseEvent, mouseDown: boolean) {
    const { x, y } = event;
    const controls = this.controls;
    if (mouseDown) {
      const pos = { x, y };
      let dx;
      let dy;
      if (controls.viewPos.prevX) dx = x - controls.viewPos.prevX;
      if (controls.viewPos.prevY) dy = y - controls.viewPos.prevY;
      if (controls.viewPos.prevX || controls.viewPos.prevY) {
        if (dx) controls.view.x += dx;
        if (dy) controls.view.y += dy;
        this.controls.viewPos.prevX = pos.x;
        this.controls.viewPos.prevY = pos.y;
      }
    }
    this.draw(this.ctx, this.gridImage);
  }

  setZoom(event: WheelEvent) {
    const { x, y, deltaY } = event;
    const controls = this.controls;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.02;
    const zoom = 1 * direction * factor;
    const wx = (x - controls.view.x) / (800 * controls.view.zoom);
    const wy = (y - controls.view.y) / (800 * controls.view.zoom);
    this.controls.view.x -= wx * 800 * zoom;
    this.controls.view.y -= wy * 800 * zoom;
    this.controls.view.zoom += zoom;
    this.draw(this.ctx, this.gridImage);
  }
}

export { Grid };
