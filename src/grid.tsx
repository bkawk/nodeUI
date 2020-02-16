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

  update(ctx: CanvasRenderingContext2D, gridImage: CanvasImageSource) {
    this.ctx = ctx;
    this.gridImage = gridImage;
    // TODO: only call update() on objects that are being moved
    const tick = 0;
    this.nodeObjects.forEach((object) => object.update(tick));
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
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
  }
  setPan(event: MouseEvent, mouseDown: boolean) {
    // TODO: set the correct cursor
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
        controls.viewPos.prevX = pos.x;
        controls.viewPos.prevY = pos.y;
      }
    }
    this.draw();
  }

  setZoom(event: WheelEvent) {
    // TODO: set the correct cursor
    const { x, y, deltaY } = event;
    const controls = this.controls;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.02;
    const wx = (x - controls.view.x) / (800 * controls.view.zoom);
    const wy = (y - controls.view.y) / (800 * controls.view.zoom);
    const zoom = 1 * direction * factor;
    controls.view.x -= wx * 800 * zoom;
    controls.view.y -= wy * 800 * zoom;
    controls.view.zoom += zoom;
    this.draw();
  }
}

export { Grid };
