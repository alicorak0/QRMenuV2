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
  private connectingPromise: Promise<void> | null = null;
  private joinedTenant?: string | null = null;
  private eventHandlers: Map<string, Set<(...args: any[]) => void>> = new Map();
  private registeredHubEvents: Set<string> = new Set();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // try to stop connection gracefully on page unload to avoid duplicate connections after F5
      window.addEventListener('beforeunload', () => {
        void this.stopConnection();
      });
    }
  }

  // Hub bağlantısını başlat
  public startConnection(tenantSlug?: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    this.tenantSlug = tenantSlug ?? TENANT_SLUG;

    // If we already have a connected connection, ensure tenant is joined and return
    if (this.hubConnection) {
      const state = this.hubConnection.state;
      if (state === signalR.HubConnectionState.Connected) {
        if (this.tenantSlug && this.joinedTenant !== this.tenantSlug) {
          return this.joinTenantGroup(this.tenantSlug);
        }
        return Promise.resolve();
      }

      // If a start is already in progress, return the same promise
      if (state === signalR.HubConnectionState.Connecting && this.connectingPromise) {
        return this.connectingPromise;
      }
    }

    const hubUrl = this.tenantSlug
      ? `${MENU_HUB_URL}?tenant=${encodeURIComponent(this.tenantSlug)}`
      : MENU_HUB_URL;

    // Build connection only once
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      // Register any stored event handlers on the underlying connection
      this.registerStoredHandlers();
    }

    this.connectingPromise = this.hubConnection.start()
      .then(async () => {
        console.log('SignalR connected');
        this.connectingPromise = null;
        if (this.tenantSlug && this.joinedTenant !== this.tenantSlug) {
          await this.joinTenantGroup(this.tenantSlug);
        }
        return Promise.resolve();
      })
      .catch(err => {
        this.connectingPromise = null;
        console.error('SignalR connection error:', err);
        throw err;
      });

    return this.connectingPromise;
  }

  // Stop the connection gracefully
  public async stopConnection(): Promise<void> {
    if (!this.hubConnection) return;
    try {
      await this.hubConnection.stop();
    } catch (err) {
      // ignore stop errors
    } finally {
      this.hubConnection = undefined;
      this.connectingPromise = null;
      this.joinedTenant = null;
      this.registeredHubEvents.clear();
    }
  }

  public async joinTenantGroup(tenantSlug: string): Promise<void> {
    if (this.joinedTenant === tenantSlug) return;

    await this.ensureConnected();
    if (!this.hubConnection) return;

    try {
      await this.hubConnection.invoke('JoinTenantGroup', tenantSlug);
      this.joinedTenant = tenantSlug;
      console.log(`SignalR joined tenant group: ${tenantSlug}`);
    } catch (error) {
      console.error('SignalR join tenant group error:', error);
    }
  }

  // Ensure the hub connection is in Connected state
  public async ensureConnected(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    // If a start is already ongoing, await it
    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    // Otherwise start the connection
    await this.startConnection(this.tenantSlug);
  }

  // Safe invoke: waits until connected before invoking
  public async invoke<T>(methodName: string, ...args: any[]): Promise<T | void> {
    await this.ensureConnected();
    if (!this.hubConnection) throw new Error('SignalR not initialized');
    return this.hubConnection.invoke<T>(methodName, ...args);
  }

  // Safe send (no response)
  public async send(methodName: string, ...args: any[]): Promise<void> {
    await this.ensureConnected();
    if (!this.hubConnection) throw new Error('SignalR not initialized');
    return this.hubConnection.send(methodName, ...args);
  }

  // Register a handler for an event; handlers are deduplicated and hub .on is registered once
  public on(eventName: string, callback: (...args: any[]) => void): void {
    // store handler
    let set = this.eventHandlers.get(eventName);
    if (!set) {
      set = new Set();
      this.eventHandlers.set(eventName, set);
    }
    set.add(callback);

    // register hub-side event dispatcher only once
    if (this.hubConnection && !this.registeredHubEvents.has(eventName)) {
      this.hubConnection.on(eventName, (...args: any[]) => {
        const handlers = this.eventHandlers.get(eventName);
        if (!handlers) return;
        handlers.forEach(h => {
          try { h(...args); } catch (e) { console.error('SignalR handler error', e); }
        });
      });
      this.registeredHubEvents.add(eventName);
    }
  }

  // Helper to register stored handlers when connection is (re)built
  private registerStoredHandlers(): void {
    if (!this.hubConnection) return;
    for (const [eventName] of this.eventHandlers) {
      if (this.registeredHubEvents.has(eventName)) continue;
      this.hubConnection.on(eventName, (...args: any[]) => {
        const handlers = this.eventHandlers.get(eventName);
        if (!handlers) return;
        handlers.forEach(h => {
          try { h(...args); } catch (e) { console.error('SignalR handler error', e); }
        });
      });
      this.registeredHubEvents.add(eventName);
    }
  }

}
