import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { MENU_HUB_URL, TENANT_SLUG } from '../constants/categoryConstants';


@Injectable({
  providedIn: 'root',
})
export class SignalService {
  private readonly platformId = inject(PLATFORM_ID);
  private hubConnection?: signalR.HubConnection;
  private tenantSlug?: string;

  constructor() { }

  // Hub bağlantısını başlat
  public startConnection(tenantSlug?: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.tenantSlug = tenantSlug ?? TENANT_SLUG;
    const hubUrl = this.tenantSlug
      ? `${MENU_HUB_URL}?tenant=${encodeURIComponent(this.tenantSlug)}`
      : MENU_HUB_URL;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        if (this.tenantSlug) {
          this.joinTenantGroup(this.tenantSlug);
        }
      })
      .catch(err => console.error('SignalR connection error:', err));
  }

  public async joinTenantGroup(tenantSlug: string): Promise<void> {
    if (!this.hubConnection) {
      return;
    }

    try {
      await this.hubConnection.invoke('JoinTenantGroup', tenantSlug);
      console.log(`SignalR joined tenant group: ${tenantSlug}`);
    } catch (error) {
      console.error('SignalR join tenant group error:', error);
    }
  }

  // ✅ TEK EVENT
  public onMenuUpdated(callback: () => void): void {
    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on('MenuUpdated', callback);
  }

}
