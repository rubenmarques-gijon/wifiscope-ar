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
      
      // Use Supabase health check for latency measurement
      await supabase.from('measurements').select('count').limit(1);
      const latency = performance.now() - startTime;

      const connection = (navigator as any).connection;
      
      // Enhanced signal strength calculation
      let signalStrength = -65; // Default value
      if (connection) {
        signalStrength = this.calculateSignalStrength(connection);
      }

      // Get more accurate speed measurements
      const speed = await this.measureConnectionSpeed();

      const measurement: WifiMeasurement = {
        signalStrength,
        speed,
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

  private calculateSignalStrength(connection: any): number {
    // Calculate signal strength based on connection quality
    const effectiveType = connection.effectiveType || '4g';
    const downlink = connection.downlink || 0;
    
    // Base signal strength on connection type and speed
    let baseSignal = -65;
    
    switch (effectiveType) {
      case '4g':
        baseSignal = -50;
        break;
      case '3g':
        baseSignal = -70;
        break;
      case '2g':
        baseSignal = -85;
        break;
      case 'slow-2g':
        baseSignal = -95;
        break;
    }
    
    // Adjust based on downlink speed
    const speedAdjustment = Math.min(15, Math.floor(downlink / 10) * 2);
    return baseSignal + speedAdjustment;
  }

  private async measureConnectionSpeed(): Promise<number> {
    try {
      const connection = (navigator as any).connection;
      if (connection && connection.downlink) {
        return connection.downlink;
      }
      
      // Fallback: estimate speed using small download
      const startTime = performance.now();
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      const endTime = performance.now();
      
      const duration = (endTime - startTime) / 1000; // Convert to seconds
      const bytes = (await response.text()).length;
      const bitsPerSecond = (bytes * 8) / duration;
      const megabitsPerSecond = bitsPerSecond / 1000000;
      
      return Math.round(megabitsPerSecond * 100) / 100;
    } catch (error) {
      console.error('Error measuring connection speed:', error);
      return 0;
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