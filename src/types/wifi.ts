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

export interface WifiAdapterInfo {
  ssid: string;
  protocol: string;
  band: string;
  speed: string;
}

export interface NetworkConnection extends EventTarget {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  downlinkMax?: number;
  rtt?: number;
  saveData?: boolean;
  onchange?: () => void;
}