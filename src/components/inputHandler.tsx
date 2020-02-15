import { InputHandlerInterface } from '../grid';

class InputHandler {
  mouseDown: boolean;
  constructor(grid: InputHandlerInterface) {
    this.mouseDown = false;

    window.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        grid.setZoom(event);
      },
      false
    );
    window.addEventListener(
      'mousedown',
      (event) => {
        this.mouseDown = true;
        grid.setMouseDown(event, true);
      },
      false
    );
    window.addEventListener(
      'mouseup',
      (event) => {
        this.mouseDown = false;
        grid.setMouseDown(event, false);
      },
      false
    );
    window.addEventListener(
      'mousemove',
      (event) => {
        grid.setPan(event, this.mouseDown);
      },
      false
    );
  }
}

export { InputHandler };
