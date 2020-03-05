import { API } from './api';

class Timer extends API {
  settings: object;

  constructor() {
    super();
    this.description = 'A timer that can start a request at a set interval';
    this.name = 'Timer';
    this.named = 'Timer_001';
    this.size = { x: 100, y: 30 };
    this.settings = {
      seconds: 20,
      started: false,
    };
  }
}

export { Timer };
