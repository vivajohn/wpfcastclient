import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  isConnected = new ReplaySubject<boolean>(1);

  private connection: signalR.HubConnection;
  // private signalrUrl = 'localhost:5000/playerHub';
  private callbacks = {};

  constructor(private config: ConfigService) { 
    this.isConnected.next(false);
    this.waitForServer();
  }

  // Send a message with no payload
  notify(name) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.send(name);
    }
  }

  // Send a message which sends data as well
  send(name, ...args: any[]) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.connection.send(name, ...args);
    }
  }

  // Code which receives messages from the server register their callbacks here
  register(name): Observable<any> {
    if (this.callbacks[name]) {
      return this.callbacks[name];
    }
    const s = new Subject<any>();
    this.callbacks[name] = s;
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      this.on(name, s);
    }
    return s;
  }

  // Intercepts the connection.on callback in order to deserialize the payload
  private on(name: string, s: Subject<any>) {
    this.connection.on(name, (json: string) => {
      s.next(JSON.parse(json));
    });
  }

  private waitForServer() {
    const ws = new WebSocket('ws://' + this.config.signalrHost);
    ws.onopen = () => {
      ws.close();
      this.initSignalr();
    };
    ws.onerror = err => {
      setTimeout(() => {
        this.waitForServer();
      }, 1000);
    };
  }

  private initSignalr() {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('http://' + this.config.signalrHost)
        .build();
    } catch (err) {
      console.log('HubConnectionBuilder', err);
    }

    Object.keys(this.callbacks).forEach(name => this.on(name, this.callbacks[name]));

    this.connection.start().then(() => {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        // console.log("SignalR disconnected");
        return;
      }
      // console.log("SignalR connected");

      this.connection.onclose(err => {
        if (err) console.log('Error on SignalR close', err);
        this.isConnected.next(false);
        setTimeout(() => this.waitForServer(), 1000);
      });

      this.isConnected.next(true);
    });
  }
}
