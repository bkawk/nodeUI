import { XYInterface } from '../components/interfaces';
import squareImg from '../images/square.svg';

class Square {
  position: XYInterface;
  size: XYInterface;
  name: string;
  mainToolbarIcon: string;
  color: string;
  selectedColor: string;
  selected: boolean;

  constructor() {
    this.mainToolbarIcon = squareImg;
    this.name = 'Square';
    this.position = { x: 0, y: 0 };
    this.size = { x: 30, y: 30 };
    this.position.x = Math.floor(Math.random() * 800);
    this.position.y = Math.floor(Math.random() * 800);
    this.color = 'black';
    this.selectedColor = 'rgba(255, 252, 117, 0.3)';
    this.selected = false;
  }
  updatePosition(position: XYInterface) {
    this.position = position;
  }
  toggleSelected(toggle: boolean) {
    this.selected = toggle;
  }
  update(tick: number) {
    //
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (this.selected) {
      ctx.fillStyle = this.selectedColor;
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fillRect(
      Math.floor(this.position.x),
      Math.floor(this.position.y),
      Math.floor(this.size.x),
      Math.floor(this.size.y)
    );
  }
}

export { Square };
