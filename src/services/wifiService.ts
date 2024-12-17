export interface WifiMeasurement {
  signalStrength: number; // dBm
  speed: number; // Mbps
  latency: number; // ms
  timestamp: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
}

class WifiService {
  private measurements: WifiMeasurement[] = [];
  private subscribers: ((measurement: WifiMeasurement) => void)[] = [];
  private connection: any;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeNetworkInfo();
  }

  private async initializeNetworkInfo() {
    try {
      // Verificar si hay conexión WiFi
      if (!navigator.onLine) {
        throw new Error("No hay conexión a Internet");
      }

      // @ts-ignore - La API NetworkInformation no está completamente tipada
      this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (!this.connection) {
        throw new Error("La API NetworkInformation no está soportada en este navegador");
      }

      // Verificar si es una conexión WiFi
      if (this.connection.type !== 'wifi') {
        throw new Error("El dispositivo no está conectado a una red WiFi");
      }

      this.isInitialized = true;
      this.startRealTimeUpdates();
      
      // Monitorear cambios en la conexión
      this.connection.addEventListener('change', this.handleConnectionChange.bind(this));
      window.addEventListener('online', this.handleOnlineStatus.bind(this));
      window.addEventListener('offline', this.handleOnlineStatus.bind(this));

    } catch (error: any) {
      console.error('Error initializing WiFi service:', error);
      throw error;
    }
  }

  private handleConnectionChange() {
    // @ts-ignore
    if (this.connection.type !== 'wifi') {
      throw new Error("El dispositivo no está conectado a una red WiFi");
    }
    this.startRealTimeUpdates();
  }

  private handleOnlineStatus() {
    if (!navigator.onLine) {
      throw new Error("Se perdió la conexión a Internet");
    }
  }

  private startRealTimeUpdates() {
    if (!this.isInitialized) return;

    // Actualizar cada 2 segundos
    setInterval(async () => {
      const measurement = await this.getRealWifiMeasurement();
      this.notifySubscribers(measurement);
    }, 2000);
  }

  private async getRealWifiMeasurement(): Promise<WifiMeasurement> {
    if (!this.isInitialized) {
      throw new Error("El servicio WiFi no está inicializado");
    }

    try {
      // Obtener latencia haciendo un ping a un servidor conocido
      const startTime = performance.now();
      await fetch('https://www.google.com/favicon.ico');
      const latency = performance.now() - startTime;

      const measurement: WifiMeasurement = {
        // @ts-ignore - Accediendo a propiedades no estándar
        signalStrength: this.connection.signalStrength || -65, // Valor aproximado si no está disponible
        // @ts-ignore
        speed: this.connection.downlink || 0,
        latency: Math.round(latency),
        timestamp: Date.now(),
        location: {
          x: 0,
          y: 0,
          z: 0
        }
      };

      return measurement;
    } catch (error) {
      console.error('Error getting WiFi measurement:', error);
      throw error;
    }
  }

  private notifySubscribers(measurement: WifiMeasurement) {
    this.subscribers.forEach(subscriber => subscriber(measurement));
  }

  public subscribe(callback: (measurement: WifiMeasurement) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public async measureWifiQuality(): Promise<WifiMeasurement> {
    const measurement = await this.getRealWifiMeasurement();
    this.measurements.push(measurement);
    return measurement;
  }

  public getMeasurements(): WifiMeasurement[] {
    return this.measurements;
  }

  public filterMeasurements(minSignalStrength: number): WifiMeasurement[] {
    return this.measurements.filter(m => m.signalStrength >= minSignalStrength);
  }

  public cleanup() {
    if (this.connection) {
      this.connection.removeEventListener('change', this.handleConnectionChange);
    }
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
    this.subscribers = [];
  }

  public async getAdapterInfo() {
    if (!this.isInitialized) {
      throw new Error("El servicio WiFi no está inicializado");
    }

    try {
      // @ts-ignore - Accediendo a propiedades no estándar del navegador
      const networkInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      // Intentar obtener información del adaptador WiFi usando la API NetworkInformation
      return {
        ssid: await this.getSSID(),
        // @ts-ignore
        protocol: networkInfo.effectiveType === '4g' ? 'Wi-Fi 5 (802.11ac)' : 'Wi-Fi 4 (802.11n)',
        // @ts-ignore
        band: networkInfo.downlinkMax > 100 ? "5 GHz" : "2.4 GHz",
        // @ts-ignore
        speed: `${networkInfo.downlink}/${networkInfo.downlinkMax || 'N/A'} (Mbps)`,
      };
    } catch (error) {
      console.error('Error getting adapter info:', error);
      throw error;
    }
  }

  private async getSSID(): Promise<string> {
    try {
      // Intentar obtener el SSID usando la API experimental Network Information
      // @ts-ignore - API experimental
      if (navigator.wifi && navigator.wifi.getCurrentNetwork) {
        // @ts-ignore
        const network = await navigator.wifi.getCurrentNetwork();
        return network.ssid;
      }
      
      // Si no está disponible, intentar obtener mediante una solicitud al backend
      // Esto requeriría implementación adicional en el backend
      return "Red WiFi actual";
    } catch (error) {
      console.error('Error getting SSID:', error);
      return "Desconocido";
    }
  }
}

export default new WifiService();