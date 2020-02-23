import { XYInterface } from '../components/interfaces';
import squareImg from '../images/square.svg';

class Square {
  color: string;
  description: string;
  hovered: boolean;
  hoveredColor: string;
  mainToolbarIcon: string;
  name: string;
  position: XYInterface;
  selected: boolean;
  selectedColor: string;
  size: XYInterface;
  locked: boolean;

  constructor() {
    this.color = '#2E2E2E';
    this.description = 'A black test square of 30x30 px';
    this.hoveredColor = 'rgba(0, 0, 0, 0.2)';
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.position = { x: 0, y: 0 };
    this.position.x = Math.floor(Math.random() * 800);
    this.position.y = Math.floor(Math.random() * 800);
    this.selected = false;
    this.hovered = false;
    this.selectedColor = 'rgb(250, 253, 0)';
    this.size = { x: 90, y: 30 };
    this.locked = false;
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
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.floor(this.position.x),
      Math.floor(this.position.y),
      Math.floor(this.size.x),
      Math.floor(this.size.y)
    );
    if (this.hovered) {
      ctx.fillStyle = this.hoveredColor;
      ctx.fillRect(
        Math.floor(this.position.x),
        Math.floor(this.position.y),
        Math.floor(this.size.x),
        Math.floor(this.size.y)
      );
    }
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
  }
}

export { Square };
