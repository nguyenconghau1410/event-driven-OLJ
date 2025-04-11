import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private rxStomp!: RxStomp;

  constructor() {
    if (sessionStorage.getItem('access_token')) {
      // const headers = {
      //   Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
      // };
      const BROKER_URL =
        (window as any)?.env?.BROKER_URL &&
        !window.env.BROKER_URL.includes('${')
          ? window.env.BROKER_URL
          : 'ws://localhost:8088/ws/websocket';
      this.rxStomp = new RxStomp();
      this.rxStomp.configure({
        // brokerURL: 'ws://localhost:8088/ws/websocket',
        brokerURL: BROKER_URL,
        // connectHeaders: headers,
        debug: (msg: string): void => {},
      });
      this.rxStomp.activate();
    }
  }

  subscribe(topic: string, callback: (message: any) => void) {
    return this.rxStomp.watch(topic).subscribe(callback);
  }

  sendMessage(topic: string, message: any) {
    this.rxStomp.publish({ destination: topic, body: JSON.stringify(message) });
  }
}
