import { Node } from '../node';

class API extends Node {
  constructor() {
    super();
    this.name = 'API';
    this.named = 'Untitled API';
    this.size = { x: 100, y: 30 };
  }
}

export { API };
