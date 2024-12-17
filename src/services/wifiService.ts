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
      const connection = (navigator as any).connection;
      const networkInfo = {
        ssid: await this.getNetworkSSID(),
        protocol: this.getWiFiProtocol(),
        band: this.getWiFiBand(),
        speed: this.getConnectionSpeed(),
      };
      
      return networkInfo;
    } catch (error) {
      console.error('Error getting adapter info:', error);
      throw error;
    }
  }

  private async getNetworkSSID(): Promise<string> {
    try {
      // Using modern browser APIs to get network info
      if ('getNetworkInformation' in navigator) {
        const networkInfo = await (navigator as any).getNetworkInformation();
        return networkInfo?.ssid || 'Unknown SSID';
      }
      
      // Fallback using connection type
      const connection = (navigator as any).connection;
      if (connection?.type === 'wifi') {
        return 'WiFi Connected';
      }
      
      return 'Unknown Network';
    } catch (error) {
      console.error('Error getting SSID:', error);
      return 'Unknown Network';
    }
  }

  private getWiFiProtocol(): string {
    const connection = (navigator as any).connection;
    
    if (!connection) return 'Unknown';
    
    // Estimate protocol based on connection capabilities
    if (connection.downlinkMax >= 1000) {
      return 'Wi-Fi 6 (802.11ax)';
    } else if (connection.downlinkMax >= 500) {
      return 'Wi-Fi 5 (802.11ac)';
    } else if (connection.downlinkMax >= 150) {
      return 'Wi-Fi 4 (802.11n)';
    }
    
    return 'Wi-Fi Legacy';
  }

  private getWiFiBand(): string {
    const connection = (navigator as any).connection;
    
    if (!connection) return 'Unknown';
    
    // Estimate band based on connection speed
    return connection.downlinkMax >= 300 ? "5 GHz" : "2.4 GHz";
  }

  private getConnectionSpeed(): string {
    const connection = (navigator as any).connection;
    
    if (!connection) return 'Unknown';
    
    const downlink = connection.downlink || 0;
    const downlinkMax = connection.downlinkMax || 0;
    
    return `${downlink}/${downlinkMax} Mbps`;
  }

  public cleanup(): void {
    connectionMonitor.cleanup();
    measurementService.cleanup();
  }
}

export default new WifiService();