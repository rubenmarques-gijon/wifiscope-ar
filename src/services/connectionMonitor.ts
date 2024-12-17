import { toast } from "sonner";
import { NetworkConnection } from "@/types/wifi";

class ConnectionMonitor {
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private connection: NetworkConnection | null = null;
  private isInitialized = false;

  initialize(): void {
    try {
      // Check basic internet connectivity
      if (!navigator.onLine) {
        this.showError("No hay conexión a Internet");
        return;
      }

      // Try to get network connection information
      this.connection = (
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection ||
        null
      );

      if (!this.connection) {
        console.warn("La API NetworkInformation no está soportada en este navegador");
      }

      this.isInitialized = true;
      this.startConnectionMonitoring();
      this.setupEventListeners();
    } catch (error: any) {
      console.error('Error initializing connection monitor:', error);
      this.showError(error.message);
    }
  }

  private showError(message: string): void {
    const errorMsg = message || "El dispositivo no está conectado a una red WiFi";
    toast.error(errorMsg, {
      position: "top-left",
      duration: Infinity,
    });
    throw new Error(errorMsg);
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
    if (!navigator.onLine) {
      this.showError("Se perdió la conexión a Internet");
    }
  }

  private setupEventListeners(): void {
    if (this.connection) {
      this.connection.addEventListener('change', this.checkConnection.bind(this));
    }
    window.addEventListener('online', () => this.checkConnection());
    window.addEventListener('offline', () => this.checkConnection());
  }

  cleanup(): void {
    if (this.connection) {
      this.connection.removeEventListener('change', this.checkConnection);
    }
    window.removeEventListener('online', () => this.checkConnection());
    window.removeEventListener('offline', () => this.checkConnection());
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }
  }

  getConnection(): NetworkConnection | null {
    return this.connection;
  }

  isConnected(): boolean {
    return this.isInitialized && navigator.onLine;
  }
}

export default new ConnectionMonitor();