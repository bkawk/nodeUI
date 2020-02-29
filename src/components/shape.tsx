import {Node} from '../components/node';

class Shape extends Node {
  
    constructor() {
      super()
      this.name = "Shape"
      this.named = "Untitled Shape"
      this.size = { x: 100, y: 30 };
    }
  }

export {Shape};