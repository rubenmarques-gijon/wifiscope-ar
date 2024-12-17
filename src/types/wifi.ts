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

export interface StoredMeasurement {
  id: string;
  signal_strength: number;
  speed: number;
  latency: number;
  location: {
    x: number;
    y: number;
    z: number;
  };
  timestamp: number;
  client_id: string;
  location_name: string;
  created_at: string;
}