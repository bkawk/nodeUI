import { InputHandler } from './components/inputHandler';
import {
  ControlInterface,
  InputHandlerInterface,
  MainToolbarInterface,
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
  mainToolbar: MainToolbarInterface;

  constructor(canvasSize: XYInterface) {
    this.canvasSize = canvasSize;
    this.nodeObjects = [];
    this.controls = {
      view: { x: 0, y: 0, zoom: 1 },
      viewPos: { prevX: null, prevY: null, isDragging: false, dragBg: true },
    };
    this.mainToolbar = {
      shapes: [new Square(this)],
      data: [new Square(this), new Square(this)],
    };
    new InputHandler(this);
  }

  newNode(nodeToPush: string) {
    // TODO: Save nodes to local storage and redraw when canvas is resized
    if (nodeToPush === 'Square') this.nodeObjects.push(new Square(this));
    this.draw();
  }

  update(
    ctx: CanvasRenderingContext2D,
    gridImage: CanvasImageSource,
    canvas: HTMLCanvasElement
  ) {
    canvas.style.cursor = 'grab';
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridImage = gridImage;
    // TODO: only call update() on objects that are being moved
    const tick = 0;
    this.nodeObjects.forEach((object) => object.update(tick));
    setTimeout(() => this.draw(), 500);
  }

  draw() {
    const paint = () => {
      if (this.gridImage) {
        const ctx = this.ctx;
        const controls = this.controls;
        const canvasSize = this.canvasSize;
        const gridPatternBackground = ctx.createPattern(
          this.gridImage,
          'repeat'
        );
        ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
        ctx.save();
        if (controls.viewPos.dragBg) {
          ctx.translate(controls.view.x, controls.view.y);
        }
        ctx.scale(controls.view.zoom, controls.view.zoom);
        if (gridPatternBackground) ctx.rect(0, 0, canvasSize.x, canvasSize.y);
        if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
        if (gridPatternBackground) ctx.fill();
        // TODO: only call draw() on objects that are being moved
        this.nodeObjects.forEach((object) => object.draw(ctx));
        ctx.restore();
      }
    };
    requestAnimationFrame(paint);
  }

  setMouseDown(event: MouseEvent, mouseDown: boolean) {
    const { x, y } = event;
    // TODO: figure out if we just cllicked a node or background by looping through this.nodeObjects
    // TODO: if you clicked a node lock the pan zoom
    const controls = this.controls;
    if (mouseDown) {
      this.canvas.style.cursor = 'grab';
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
    const canvas = this.canvas;
    const { x, y } = event;
    const controls = this.controls;
    const pos = { x, y };
    let dx;
    let dy;
    if (canvas && canvas.style.cursor !== 'grab') canvas.style.cursor = 'grab';
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
    const canvasSize = this.canvasSize;
    const weigthed = { x: 0, y: 0 };
    const direction = deltaY > 0 ? -1 : 1;
    if (direction === 1) this.canvas.style.cursor = 'zoom-in';
    if (direction === -1) this.canvas.style.cursor = 'zoom-out';
    const factor = 0.05;
    const zoom = direction * factor;
    if (controls.view.zoom + zoom < 3 && controls.view.zoom + zoom > 0.8) {
      weigthed.x = (x - controls.view.x) / (canvasSize.x * controls.view.zoom);
      weigthed.y = (y - controls.view.y) / (canvasSize.y * controls.view.zoom);
      controls.view.x -= weigthed.x * canvasSize.x * zoom;
      controls.view.y -= weigthed.y * canvasSize.y * zoom;
      controls.view.zoom += zoom;
      this.draw();
    }
  }
}

export { Grid };
