import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';

class Selection {
  category: string;
  categoryImage: string;
  color: string;
  description: string;
  hovered: boolean;
  hoveredColor: string;
  locked: boolean;
  mainToolbarIcon: string;
  name: string;
  named: string;
  position: XYInterface;
  selected: boolean;
  selectedColor: string;
  size: XYInterface;
  offSet: XYInterface;

  constructor(position: XYInterface) {
    this.offSet = { x: 0, y: 0 };
    this.category = 'Tools';
    this.color = '#2E2E2E';
    this.description = 'Draws a selection';
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.mainToolbarIcon = squareImg;
    this.name = 'Selection';
    this.named = 'Square_001';
    this.position = position;
    this.selected = false;
    this.hovered = false;
    this.selectedColor = '#EDD02E';
    this.size = { x: 0, y: 0 };
    this.locked = false;
    this.categoryImage = shapesImage;
  }
  updatePosition(position: XYInterface) {
    this.position = position;
  }
  updateSize(size: XYInterface) {
    const x = size.x - this.position.x;
    const y = size.y - this.position.y;
    this.size = { x, y };
  }
  toggleSelected(toggle: boolean) {
    this.selected = toggle;
  }
  toggleHovered(toggle: boolean) {
    this.hovered = toggle;
  }
  updateColor(color: string) {
    this.color = color;
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
