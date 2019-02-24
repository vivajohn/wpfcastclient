import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  isStandAlone = false;

  urlRest = 'http://localhost:31468/api';

  signalrHost = 'localhost:31468/playerHub';
  
}
