import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';

class Connector {
  category: string;
  categoryImage: string;
  color: string;
  description: string;
  hidden: boolean;
  hovered: boolean;
  hoveredColor: string;
  locked: boolean;
  mainToolbarIcon: string;
  name: string;
  named: string;
  offSet: XYInterface;
  placeholder: boolean;
  position: XYInterface;
  selected: boolean;
  selectedColor: string;
  size: XYInterface;

  constructor() {
    this.category = 'Connector';
    this.categoryImage = shapesImage;
    this.color = '#2E2E2E';
    this.description = 'A test bezier curve';
    this.hidden = false;
    this.hovered = false;
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.locked = false;
    this.mainToolbarIcon = squareImg;
    this.name = 'Connector';
    this.named = 'Connector_001';
    this.offSet = { x: 0, y: 0 };
    this.placeholder = true;
    this.position = { x: 0, y: 0 };
    this.selected = false;
    this.selectedColor = '#EDD02E';
    this.size = { x: 100, y: 30 };
  }
  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D, imageCache: HTMLImageElement[]) {

const start = { x: 50, y: 20 };
const cp1 = { x: 230, y: 30 };
const cp2 = { x: 150, y: 80 };
const end = { x: 250, y: 100 };

ctx.beginPath();
ctx.moveTo(start.x, start.y);
ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
ctx.stroke();

  }
}

export { Connector };
