import { Node } from '../node';

class API extends Node {
  category: string;
  constructor() {
    super();
    this.category = 'API';
    this.name = 'API';
    this.named = 'Untitled API';
    this.size = { x: 100, y: 30 };
  }
}

export { API };
