import { InputHandlerInterface } from './interfaces';

class InputHandler {
  mouseDown: boolean;
  dragBg: boolean;
  constructor(grid: InputHandlerInterface) {
    this.mouseDown = false;
    this.dragBg = true;
    const canvas = document.getElementById('canvas');
    if (canvas) {
    canvas.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        grid.setZoom(event);
      },
      false
    );
    canvas.addEventListener(
      'mousedown',
      (event) => {
        this.mouseDown = true;
        grid.setMouseDown(event, true);
      },
      false
    );
    canvas.addEventListener(
      'mouseup',
      (event) => {
        this.mouseDown = false;
        grid.setMouseUp(event);
      },
      false
    );
    canvas.addEventListener(
      'mousemove',
      (event) => {
        if (this.mouseDown && this.dragBg) grid.setPan(event, this.mouseDown);
        if (this.mouseDown && !this.dragBg) grid.setMove(event, this.mouseDown);
      },
      false
    );
    }
  }
  update(dragBg: boolean) {
    this.dragBg = dragBg;
  }
}

export { InputHandler };
