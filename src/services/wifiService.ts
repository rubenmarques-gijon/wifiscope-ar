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
      
      return {
        ssid: await this.getSSID(),
        protocol: connection?.effectiveType === '4g' ? 'Wi-Fi 5 (802.11ac)' : 'Wi-Fi 4 (802.11n)',
        band: connection?.downlinkMax && connection.downlinkMax > 100 ? "5 GHz" : "2.4 GHz",
        speed: `${connection?.downlink || 0}/${connection?.downlinkMax || 'N/A'} (Mbps)`,
      };
    } catch (error) {
      console.error('Error getting adapter info:', error);
      throw error;
    }
  }

  private async getSSID(): Promise<string> {
    try {
      // @ts-ignore
      if (navigator.wifi && navigator.wifi.getCurrentNetwork) {
        // @ts-ignore
        const network = await navigator.wifi.getCurrentNetwork();
        return network.ssid;
      }
      return "Red WiFi actual";
    } catch (error) {
      console.error('Error getting SSID:', error);
      return "Desconocido";
    }
  }

  public cleanup(): void {
    connectionMonitor.cleanup();
    measurementService.cleanup();
  }
}

export default new WifiService();