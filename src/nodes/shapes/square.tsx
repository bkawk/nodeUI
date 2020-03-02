import { Shape } from './shape';

class Square extends Shape {
  constructor() {
    super();
    this.description = 'A square node of 50x50';
    this.name = 'Square';
    this.named = 'Square_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Square };
