import { API } from './api';

class Params extends API {
  constructor() {
    super();
    this.description = 'Params used by a request';
    this.name = 'Params';
    this.named = 'Params_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Params };
