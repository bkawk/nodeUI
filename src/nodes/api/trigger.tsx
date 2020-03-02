import { API } from './api';

class Trigger extends API {
  constructor() {
    super();
    this.description = 'A trigger that can start a request';
    this.name = 'Trigger';
    this.named = 'Trigger_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Trigger };
