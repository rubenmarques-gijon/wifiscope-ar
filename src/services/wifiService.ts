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
  private mockUpdateInterval: number | null = null;
  private subscribers: ((measurement: WifiMeasurement) => void)[] = [];

  constructor() {
    // Start mock real-time updates when service is instantiated
    this.startMockUpdates();
  }

  private startMockUpdates() {
    // Clear any existing interval
    if (this.mockUpdateInterval) {
      window.clearInterval(this.mockUpdateInterval);
    }

    // Update every 2 seconds with realistic fluctuating values
    this.mockUpdateInterval = window.setInterval(() => {
      const mockMeasurement = this.generateRealisticMeasurement();
      this.notifySubscribers(mockMeasurement);
    }, 2000);
  }

  private generateRealisticMeasurement(): WifiMeasurement {
    // Generate realistic fluctuating values
    const baseSignal = -65; // Base signal strength
    const baseSpeed = 80; // Base speed in Mbps
    const baseLatency = 25; // Base latency in ms

    // Add random fluctuations
    const measurement: WifiMeasurement = {
      signalStrength: baseSignal + (Math.random() * 20 - 10), // Fluctuate ±10 dBm
      speed: baseSpeed + (Math.random() * 40 - 20), // Fluctuate ±20 Mbps
      latency: baseLatency + (Math.random() * 10 - 5), // Fluctuate ±5 ms
      timestamp: Date.now(),
      location: {
        x: 0,
        y: 0,
        z: 0
      }
    };

    return measurement;
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
    const measurement = this.generateRealisticMeasurement();
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
    if (this.mockUpdateInterval) {
      window.clearInterval(this.mockUpdateInterval);
    }
    this.subscribers = [];
  }
}

export default new WifiService();