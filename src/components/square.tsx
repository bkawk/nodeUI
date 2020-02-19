import { NodesInterface, XYInterface } from '../components/interfaces';
import squareImg from '../images/square.svg';

class Square {
  canvasSize: XYInterface;
  position: XYInterface;
  size: XYInterface;
  name: string;
  mainToolbarIcon: string;

  constructor(nodes: NodesInterface) {
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.canvasSize = nodes.canvasSize;
    this.position = { x: 0, y: 0 };
    this.size = { x: 30, y: 30};
    this.position.x = Math.floor(Math.random() * this.canvasSize.x);
    this.position.y = Math.floor(Math.random() * this.canvasSize.y);
  }
  updatePosition(position: XYInterface) {
    this.position = position;
  }
  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}

export { Square };
