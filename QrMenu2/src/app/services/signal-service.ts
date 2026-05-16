import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { MENU_HUB_URL } from '../constants/categoryConstants';


@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private readonly platformId = inject(PLATFORM_ID);
  private hubConnection?: signalR.HubConnection;

      constructor() { }

        // Hub bağlantısını başlat
  public startConnection(): void {
    if (!isPlatformBrowser(this.platformId) || this.hubConnection) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(MENU_HUB_URL)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error:', err));
  }

 // ✅ TEK EVENT
  public onMenuUpdated(callback: () => void): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('MenuUpdated', callback);
  }

}
