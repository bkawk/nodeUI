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
  mouseLocation: any;
  inputHandler: InputHandler;
  selectedNode!: NodeObjectInterface | null;

  constructor(canvasSize: XYInterface) {
    this.mouseLocation = 'x';
    this.canvasSize = canvasSize;
    this.nodeObjects = [];
    this.controls = {
      view: { x: 0, y: 0, zoom: 1 },
      viewPos: { prevX: null, prevY: null, isDragging: false },
    };
    this.mainToolbar = {
      shapes: [new Square(this)],
      data: [new Square(this), new Square(this)],
    };
    this.inputHandler = new InputHandler(this);
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
    canvas.style.cursor = 'crosshair';
    this.canvas = canvas;
    this.ctx = ctx;
    this.gridImage = gridImage;
    // TODO: only call update() on objects that are being moved
    const tick = 0;
    this.nodeObjects.forEach((object) => object.update(tick));
    this.draw();
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
        ctx.clearRect(0, 0, Math.floor(canvasSize.x), Math.floor(canvasSize.y));
        ctx.save();
        ctx.translate(Math.floor(controls.view.x), Math.floor(controls.view.y));
        ctx.scale(controls.view.zoom, controls.view.zoom);
        if (gridPatternBackground) ctx.rect(0, 0, Math.floor(canvasSize.x), Math.floor(canvasSize.y));
        if (gridPatternBackground) ctx.fillStyle = gridPatternBackground;
        if (gridPatternBackground) ctx.fill();
        // TODO: only call draw() on objects that are being moved
        this.nodeObjects.forEach((object) => object.draw(ctx));
        ctx.restore();
      }
    };
    requestAnimationFrame(paint);
  }

  setMouseLocation(event: MouseEvent) {
    this.mouseLocation = event;
  }

  objectHitWas(event: MouseEvent) {
    this.inputHandler.update(true);
    const x = event.offsetX;
    const y = event.offsetY;
    const zoom = this.controls.view.zoom;
    const controlsView = this.controls.view;
    let index = 0;
    let objectHit = false;
    let nodeObjects = 0;
    for (const value of this.nodeObjects) {
      index++;
      if (
        x - controlsView.x > value.position.x * zoom &&
        x - controlsView.x < value.position.x * zoom + value.size.x * zoom &&
        y - controlsView.y > value.position.y * zoom &&
        y - controlsView.y < value.position.y * zoom + value.size.y * zoom
      ) {
        nodeObjects = index;
        objectHit = true;
      }
    }
    if (objectHit) {
      this.inputHandler.update(false);
      this.selectedNode = this.nodeObjects[nodeObjects - 1];
    } else {
      this.selectedNode = null;
    }
  }

  setMouseDown(event: MouseEvent, mouseDown: boolean) {
    this.objectHitWas(event);
    const x = event.offsetX;
    const y = event.offsetY;
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

  setMove(event: MouseEvent, mouseDown: boolean) {
    const x = event.offsetX;
    const y = event.offsetY;
    const controlsView = this.controls.view;
    const zoom = this.controls.view.zoom;
    if (this.selectedNode) {
      this.selectedNode.updatePosition({
        x: (x - controlsView.x - (this.selectedNode.size.x / 2) * zoom) / zoom,
        y: (y - controlsView.y - (this.selectedNode.size.y / 2) * zoom) / zoom,
      });
    }
    this.draw();
  }

  setPan(event: MouseEvent, mouseDown: boolean) {
    const canvas = this.canvas;
    const x = event.offsetX;
    const y = event.offsetY;
    const controls = this.controls;
    let dx;
    let dy;
    canvas.style.cursor = 'grab';
    if (controls.viewPos.prevX) dx = x - controls.viewPos.prevX;
    if (controls.viewPos.prevY) dy = y - controls.viewPos.prevY;
    if (controls.viewPos.prevX || controls.viewPos.prevY) {
      if (dx) controls.view.x += dx;
      if (dy) controls.view.y += dy;
      controls.viewPos.prevX = x;
      controls.viewPos.prevY = y;
    }
    this.draw();
  }

  setZoom(event: WheelEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const { deltaY } = event;
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
