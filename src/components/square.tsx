import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';

class Square {
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
    this.category = 'Shape';
    this.categoryImage = shapesImage;
    this.color = '#2E2E2E';
    this.description = 'A black test square of 30x30 px';
    this.hidden = true;
    this.hovered = false;
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.locked = false;
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.named = 'Square_001';
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
    if (!this.hidden) {
      // Draw the background shape
      ctx.fillStyle = this.color;
      ctx.fillRect(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.size.x),
        Math.floor(this.size.y)
      );
      // Draw the hovered overlay
      if (this.hovered) {
        ctx.fillStyle = this.hoveredColor;
        ctx.fillRect(
          Math.floor(this.position.x),
          Math.floor(this.position.y),
          Math.floor(this.size.x),
          Math.floor(this.size.y)
        );
      }
      // Draw the border and change color if selected
      if (this.selected) {
        ctx.strokeStyle = this.selectedColor;
      } else {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      }
      ctx.strokeRect(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.size.x),
        Math.floor(this.size.y)
      );
      // Add the category name as text
      ctx.fillStyle = '#2E2E2E';
      ctx.font = '14px Roboto';
      ctx.fillText(
        this.category,
        Math.floor(this.position.x + this.size.x + 12),
        Math.floor(this.position.y + 10)
      );
      ctx.fillStyle = '#000000';
      ctx.font = '18px Roboto';
      ctx.fillText(
        this.named,
        Math.floor(this.position.x + this.size.x + 12),
        Math.floor(this.position.y + 30)
      );
      // Add the category image from the cache
      ctx.drawImage(
        imageCache[0] as CanvasImageSource,
        Math.floor(this.position.x + this.size.x / 2 - 7),
        Math.floor(this.position.y + 7)
      );
    }
  }
}

export { Square };
