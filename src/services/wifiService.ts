import { WifiMeasurement, WifiAdapterInfo } from "@/types/wifi";
import connectionMonitor from "./connectionMonitor";
import measurementService from "./measurementService";

class WifiService {
  private isInitialized: boolean = false;

  constructor() {
    this.initializeNetworkInfo();
  }

  private async initializeNetworkInfo(): Promise<void> {
    try {
      connectionMonitor.initialize();
      measurementService.initialize();
      this.isInitialized = true;
    } catch (error: any) {
      console.error('Error initializing WiFi service:', error);
      throw error;
    }
  }

  public subscribe(callback: (measurement: WifiMeasurement) => void): () => void {
    return measurementService.subscribe(callback);
  }

  public async measureWifiQuality(): Promise<WifiMeasurement> {
    if (!connectionMonitor.isConnected()) {
      throw new Error("No hay conexión WiFi disponible");
    }
    return measurementService.measureWifiQuality();
  }

  public getMeasurements(): WifiMeasurement[] {
    return measurementService.getMeasurements();
  }

  public filterMeasurements(minSignalStrength: number): WifiMeasurement[] {
    return measurementService.filterMeasurements(minSignalStrength);
  }

  public async getAdapterInfo(): Promise<WifiAdapterInfo> {
    if (!this.isInitialized) {
      throw new Error("El servicio WiFi no está inicializado");
    }

    try {
      const connection = connectionMonitor.getConnection();
      const networkInfo = await this.getNetworkInfo();
      
      return {
        ssid: networkInfo.ssid,
        protocol: this.getWiFiProtocol(connection),
        band: this.getWiFiBand(connection),
        speed: this.getConnectionSpeed(connection),
      };
    } catch (error) {
      console.error('Error getting adapter info:', error);
      throw error;
    }
  }

  private async getNetworkInfo(): Promise<{ ssid: string }> {
    try {
      // @ts-ignore
      if (navigator.wifi && navigator.wifi.getCurrentNetwork) {
        // @ts-ignore
        const network = await navigator.wifi.getCurrentNetwork();
        return { ssid: network.ssid };
      }

      // Fallback for browsers that don't support WiFi API
      const connection = connectionMonitor.getConnection();
      if (connection) {
        return {
          ssid: 'Red WiFi actual'
        };
      }

      throw new Error('No se puede obtener información de la red WiFi');
    } catch (error) {
      console.error('Error getting network info:', error);
      return { ssid: 'Desconocido' };
    }
  }

  private getWiFiProtocol(connection: any): string {
    if (!connection) return 'Desconocido';
    
    switch (connection.effectiveType) {
      case '4g':
        return 'Wi-Fi 6 (802.11ax)';
      case '3g':
        return 'Wi-Fi 5 (802.11ac)';
      default:
        return 'Wi-Fi 4 (802.11n)';
    }
  }

  private getWiFiBand(connection: any): string {
    if (!connection) return 'Desconocido';
    return connection.downlinkMax && connection.downlinkMax > 100 ? "5 GHz" : "2.4 GHz";
  }

  private getConnectionSpeed(connection: any): string {
    if (!connection) return 'Desconocido';
    const downlink = connection.downlink || 0;
    const downlinkMax = connection.downlinkMax || 'N/A';
    return `${downlink}/${downlinkMax} (Mbps)`;
  }

  public cleanup(): void {
    connectionMonitor.cleanup();
    measurementService.cleanup();
  }
}

export default new WifiService();