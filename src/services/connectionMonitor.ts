import { toast } from "sonner";

class ConnectionMonitor {
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private connection: any;

  initialize(): void {
    try {
      if (!navigator.onLine) {
        throw new Error("No hay conexión a Internet");
      }

      // @ts-ignore
      this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (!this.connection) {
        console.warn("La API NetworkInformation no está soportada en este navegador");
      }

      if (this.connection && this.connection.type !== 'wifi') {
        throw new Error("El dispositivo no está conectado a una red WiFi");
      }

      this.startConnectionMonitoring();
      this.setupEventListeners();
    } catch (error: any) {
      console.error('Error initializing connection monitor:', error);
      throw error;
    }
  }

  private startConnectionMonitoring(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 5000);
  }

  private checkConnection(): void {
    try {
      if (!navigator.onLine) {
        throw new Error("Se perdió la conexión a Internet");
      }

      if (this.connection && this.connection.type !== 'wifi') {
        throw new Error("El dispositivo no está conectado a una red WiFi");
      }
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-left",
        duration: Infinity,
      });
      console.error('Connection check error:', error);
    }
  }

  private setupEventListeners(): void {
    if (this.connection) {
      this.connection.addEventListener('change', this.checkConnection.bind(this));
    }
    window.addEventListener('online', this.checkConnection.bind(this));
    window.addEventListener('offline', this.checkConnection.bind(this));
  }

  cleanup(): void {
    if (this.connection) {
      this.connection.removeEventListener('change', this.checkConnection);
    }
    window.removeEventListener('online', this.checkConnection);
    window.removeEventListener('offline', this.checkConnection);
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
  }

  getConnection(): any {
    return this.connection;
  }
}

export default new ConnectionMonitor();