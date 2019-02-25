import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  isStandAlone = false;

  urlRest = 'http://localhost:31469/api';

  signalrHost = 'localhost:31469/playerHub';
  
}
