import { WifiMeasurement } from "@/types/wifi";
import connectionMonitor from "./connectionMonitor";
import { supabase } from "@/integrations/supabase/client";

class MeasurementService {
  private measurements: WifiMeasurement[] = [];
  private subscribers: ((measurement: WifiMeasurement) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  initialize(): void {
    this.startRealTimeUpdates();
  }

  private async getRealWifiMeasurement(): Promise<WifiMeasurement> {
    try {
      const startTime = performance.now();
      // Use Supabase health check instead of Google favicon
      await supabase.from('measurements').select('count').limit(1);
      const latency = performance.now() - startTime;

      const connection = connectionMonitor.getConnection();
      
      const measurement: WifiMeasurement = {
        signalStrength: connection?.downlink ? -(100 - connection.downlink * 5) : -65,
        speed: connection?.downlink || 0,
        latency: Math.round(latency),
        timestamp: Date.now(),
        location: { x: 0, y: 0, z: 0 }
      };

      return measurement;
    } catch (error) {
      console.error('Error getting WiFi measurement:', error);
      throw error;
    }
  }

  private startRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        const measurement = await this.getRealWifiMeasurement();
        this.notifySubscribers(measurement);
      } catch (error) {
        console.error('Error updating WiFi measurements:', error);
      }
    }, 2000);
  }

  private notifySubscribers(measurement: WifiMeasurement): void {
    this.subscribers.forEach(subscriber => subscriber(measurement));
  }

  subscribe(callback: (measurement: WifiMeasurement) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  async measureWifiQuality(): Promise<WifiMeasurement> {
    const measurement = await this.getRealWifiMeasurement();
    this.measurements.push(measurement);
    return measurement;
  }

  getMeasurements(): WifiMeasurement[] {
    return this.measurements;
  }

  filterMeasurements(minSignalStrength: number): WifiMeasurement[] {
    return this.measurements.filter(m => m.signalStrength >= minSignalStrength);
  }

  cleanup(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.subscribers = [];
  }
}

export default new MeasurementService();