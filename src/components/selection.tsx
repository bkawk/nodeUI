import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';

class Selection {
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

  constructor(position: XYInterface) {
    this.category = 'Tools';
    this.categoryImage = shapesImage;
    this.color = '#2E2E2E';
    this.description = 'Draws a selection';
    this.hidden = true;
    this.hovered = false;
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.locked = false;
    this.mainToolbarIcon = squareImg;
    this.name = 'Selection';
    this.named = 'Square_001';
    this.offSet = { x: 0, y: 0 };
    this.placeholder = false;
    this.position = position;
    this.selected = false;
    this.selectedColor = '#EDD02E';
    this.size = { x: 0, y: 0 };
  }

  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D, imageCache: HTMLImageElement[]) {
    if (this.size.x !== 0 && this.size.y !== 0) {
      // Draw the outline
      ctx.strokeStyle = '#00E3FF';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.size.x),
        Math.floor(this.size.y)
      );
      // Draw the fill
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.size.x),
        Math.floor(this.size.y)
      );
    }
  }
}

export { Selection };
