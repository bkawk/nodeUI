import { API } from './api';

class Socket extends API {
  constructor() {
    super();
    this.description = 'A Socket connection';
    this.name = 'Socket';
    this.named = 'Socket_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Socket };
