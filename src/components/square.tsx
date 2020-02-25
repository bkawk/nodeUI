import { XYInterface } from '../components/interfaces';
import shapesImage from '../images/shapes.svg';
import squareImg from '../images/square.svg';

class Square {
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

  constructor() {
    this.category = 'Shape';
    this.color = '#2E2E2E';
    this.description = 'A black test square of 30x30 px';
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.named = 'Square_001';
    this.position = { x: 0, y: 0 };
    this.position.x = Math.floor(Math.random() * 800);
    this.position.y = Math.floor(Math.random() * 800);
    this.selected = false;
    this.hovered = false;
    this.selectedColor = 'rgb(250, 253, 0)';
    this.size = { x: 100, y: 30 };
    this.locked = false;
    this.categoryImage = shapesImage;
  }
  updatePosition(position: XYInterface) {
    this.position = position;
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
    ctx.fillText(this.category, this.position.x + this.size.x + 12, this.position.y + 10);
    ctx.fillStyle = '#000000';
    ctx.font = '18px Roboto';
    ctx.fillText(this.named, this.position.x + this.size.x + 12, this.position.y + 30);
    // Add the category image from the cache
    ctx.drawImage(imageCache[0] as CanvasImageSource, this.position.x + this.size.x / 2 - 7 , this.position.y + 7);
  }
}

export { Square };
