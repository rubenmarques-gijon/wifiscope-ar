export interface WifiMeasurement {
  signalStrength: number;
  speed: number;
  latency: number;
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
  private connectionCheckInterval: NodeJS.Timer | null = null;

  constructor() {
    this.initializeNetworkInfo();
  }

  private async initializeNetworkInfo() {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error("No hay conexión a Internet");
      }

      // @ts-ignore - La API NetworkInformation no está completamente tipada
      this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (!this.connection) {
        console.warn("La API NetworkInformation no está soportada en este navegador");
      }

      // Verificar si es una conexión WiFi
      if (this.connection && this.connection.type !== 'wifi') {
        throw new Error("El dispositivo no está conectado a una red WiFi");
      }

      this.isInitialized = true;
      this.startConnectionMonitoring();
      this.startRealTimeUpdates();
      
      // Monitorear cambios en la conexión
      if (this.connection) {
        this.connection.addEventListener('change', this.handleConnectionChange.bind(this));
      }
      window.addEventListener('online', this.handleOnlineStatus.bind(this));
      window.addEventListener('offline', this.handleOnlineStatus.bind(this));

    } catch (error: any) {
      console.error('Error initializing WiFi service:', error);
      throw error;
    }
  }

  private startConnectionMonitoring() {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(() => {
      if (!navigator.onLine) {
        this.handleConnectionChange();
      }
    }, 5000); // Verificar cada 5 segundos
  }

  private handleConnectionChange() {
    try {
      if (!navigator.onLine) {
        throw new Error("Se perdió la conexión a Internet");
      }

      if (this.connection && this.connection.type !== 'wifi') {
        throw new Error("El dispositivo no está conectado a una red WiFi");
      }
    } catch (error: any) {
      console.error('Connection change error:', error);
      throw error;
    }
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
      try {
        const measurement = await this.getRealWifiMeasurement();
        this.notifySubscribers(measurement);
      } catch (error) {
        console.error('Error updating WiFi measurements:', error);
      }
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
        signalStrength: this.connection?.signalStrength || -65,
        // @ts-ignore
        speed: this.connection?.downlink || 0,
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

  public async getAdapterInfo() {
    if (!this.isInitialized) {
      throw new Error("El servicio WiFi no está inicializado");
    }

    try {
      // @ts-ignore - Accediendo a propiedades no estándar del navegador
      const networkInfo = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
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

  public cleanup() {
    if (this.connection) {
      this.connection.removeEventListener('change', this.handleConnectionChange);
    }
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
    this.subscribers = [];
  }
}

export default new WifiService();