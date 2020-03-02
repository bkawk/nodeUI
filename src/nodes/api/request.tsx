import { API } from './api';

class Request extends API {
  constructor() {
    super();
    this.description = 'An http request';
    this.name = 'Request';
    this.named = 'Request_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Request };
