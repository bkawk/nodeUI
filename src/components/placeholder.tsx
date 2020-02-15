import { XYInterface } from '../grid';

interface NodesInterface {
  canvasSize: XYInterface;
}

class Placeholder {
  canvasSize: XYInterface;
  position: XYInterface;
  size: XYInterface;
  name: string;

  constructor(nodes: NodesInterface) {
    this.name = 'placeholder';
    this.canvasSize = nodes.canvasSize;
    this.position = { x: 0, y: 0 };
    this.size = { x: 30, y: 30 };
  }
  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D) {
      if (this.position.x > 0 && this.position.y > 0 ) {
        ctx.fillStyle = 'pink';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
      }
  }
}

export { Placeholder };
