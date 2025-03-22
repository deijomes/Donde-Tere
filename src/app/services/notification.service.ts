import { Injectable } from '@angular/core';

import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = `${environment.API_URL}`

  private socket!: Socket;

  connect(): void {
    this.socket = io(this.url); 
    console.log('Socket conectado:', this.socket);
  }

  constructor() { }
  listen(eventName: string): Observable<any> {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data) => {
        console.log(`Evento recibido: ${eventName}`, data);  
        subscriber.next(data);
      });

      return () => this.socket.off(eventName);
    });
  }

  

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
