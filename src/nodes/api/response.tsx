import { API } from './api';

class Response extends API {
  constructor() {
    super();
    this.description = 'The Response from a request';
    this.name = 'Response';
    this.named = 'Response_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Response };
