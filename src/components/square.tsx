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
    this.color = 'black';
    this.description = 'A black test square of 30x30 px';
    this.hoveredColor = 'rgba(0, 0, 0, 0.6)';
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.position = { x: 0, y: 0 };
    this.position.x = Math.floor(Math.random() * 800);
    this.position.y = Math.floor(Math.random() * 800);
    this.selected = false;
    this.hovered = false;
    this.selectedColor = 'white';
    this.size = { x: 30, y: 30 };
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
  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.hovered) ctx.fillStyle = this.hoveredColor;
    else ctx.fillStyle = this.color;
    ctx.fillRect(
      Math.floor(this.position.x),
      Math.floor(this.position.y),
      Math.floor(this.size.x),
      Math.floor(this.size.y)
    );
    if (this.selected) {
    ctx.setLineDash([2]);
    ctx.strokeStyle = this.selectedColor;
    ctx.strokeRect(
      Math.floor(this.position.x - 1),
      Math.floor(this.position.y - 1),
      Math.floor(this.size.x + 2),
      Math.floor(this.size.y + 2)
    );
    }
  }
}

export { Square };
