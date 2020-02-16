import { InputHandler } from './components/inputHandler';
import {
  ControlInterface,
  InputHandlerInterface,
  NodeObjectInterface,
  XYInterface,
} from './components/interfaces';
import { Square } from './components/square';

class Grid implements InputHandlerInterface {
  canvasSize: XYInterface;
  controls: ControlInterface;
  nodeObjects: NodeObjectInterface[];
  ctx!: CanvasRenderingContext2D;
  gridImage!: CanvasImageSource;
  canvas!: HTMLCanvasElement;

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
    // TODO: Save nodes to local storage
    this.nodeObjects.push(new Square(this));
    this.draw();
  }

  update(
    ctx: CanvasRenderingContext2D,
    gridImage: CanvasImageSource,
    canvas: HTMLCanvasElement
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridImage = gridImage;
    // TODO: only call update() on objects that are being moved
    const tick = 0;
    this.nodeObjects.forEach((object) => object.update(tick));
    setTimeout(() => this.draw(), 500);
  }

  draw() {
    const ctx = this.ctx;
    const controls = this.controls;
    const canvasSize = this.canvasSize;
    const gridPatternBackground = ctx.createPattern(this.gridImage, 'repeat');
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
    ctx.save();
    if (controls.viewPos.dragBg) {
      ctx.translate(controls.view.x, controls.view.y);
    }
    ctx.scale(controls.view.zoom, controls.view.zoom);
    ctx.rect(0, 0, canvasSize.x, canvasSize.y);
    if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
    ctx.fill();
    // TODO: only call draw() on objects that are being moved
    this.nodeObjects.forEach((object) => object.draw(ctx));
    ctx.restore();
  }

  setMouseDown(event: MouseEvent, mouseDown: boolean) {
    const { x, y } = event;
    // TODO: figure out if we just cllicked a node or background by looping through this.nodeObjects
    // TODO: if you cloicked a node lock the pan zoom
    // TODO: set the correct cursor
    const controls = this.controls;
    if (mouseDown) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = x;
      controls.viewPos.prevY = y;
    }
    if (!mouseDown) {
      this.canvas.style.cursor = 'default';
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
  }
  setPan(event: MouseEvent, mouseDown: boolean) {
    const { x, y } = event;
    const controls = this.controls;
    if (this.canvas.style.cursor !== 'grab') this.canvas.style.cursor = 'grab';
    const pos = { x, y };
    let dx;
    let dy;
    if (controls.viewPos.prevX) dx = x - controls.viewPos.prevX;
    if (controls.viewPos.prevY) dy = y - controls.viewPos.prevY;
    if (controls.viewPos.prevX || controls.viewPos.prevY) {
      if (dx) controls.view.x += dx;
      if (dy) controls.view.y += dy;
      controls.viewPos.prevX = Math.floor(pos.x);
      controls.viewPos.prevY = Math.floor(pos.y);
    }
    this.draw();
  }

  setZoom(event: WheelEvent) {
    const { x, y, deltaY } = event;
    const controls = this.controls;
    const canvas = this.canvas;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.02;
    const wx = (x - controls.view.x) / (800 * controls.view.zoom);
    const wy = (y - controls.view.y) / (800 * controls.view.zoom);
    const zoom = 1 * direction * factor;
    controls.view.x -= Math.floor(wx * 800 * zoom);
    controls.view.y -= Math.floor(wy * 800 * zoom);
    const test = controls.view.zoom += zoom;
    if (test > 3 ) {
      controls.view.zoom = 3;
      canvas.style.cursor = 'default';
    } else if (test < 1) {
      controls.view.zoom = 1;
      canvas.style.cursor = 'default';
    } else {
      if (direction === -1) canvas.style.cursor = 'zoom-out';
      if (direction === 1) canvas.style.cursor = 'zoom-in';
      controls.view.zoom += zoom;
      this.draw();
    }
    let debounceZoom: any;
    clearTimeout(debounceZoom);
    debounceZoom = setTimeout(() => {
      if (controls.viewPos.isDragging === true) {
        canvas.style.cursor = 'grap';
      } else  {
        canvas.style.cursor = 'default';
      }
    }, 1500);
  }
}

export { Grid };
