import { Shape } from './shape';

class Rectangle extends Shape {
  constructor() {
    super();
    this.description = 'A rectangular node of size 100x50';
    this.name = 'Rectangle';
    this.named = 'Rectangle_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Rectangle };
