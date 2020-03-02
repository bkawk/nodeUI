import { API } from './api';

class Headers extends API {
  constructor() {
    super();
    this.description = 'Headers sent with a request';
    this.name = 'Headers';
    this.named = 'Headers_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Headers };
