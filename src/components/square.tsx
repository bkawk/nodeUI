import { Shape } from '../components/shape';

class Square extends Shape {
  
  constructor() {
    super()
    this.description = 'A square node of 50x50';
    this.name = "Square"
    this.named = 'Square_001';
    this.size = { x: 50, y: 50 };

  }
  
}

export { Square };
