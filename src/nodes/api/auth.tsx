import { API } from './api';

class Auth extends API {
  constructor() {
    super();
    this.description = 'Authorization needed for a request';
    this.name = 'Auth';
    this.named = 'Auth_001';
    this.size = { x: 100, y: 30 };
  }
}

export { Auth };
