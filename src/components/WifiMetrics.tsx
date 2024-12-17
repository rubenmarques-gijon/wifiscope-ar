import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";

interface WifiMetrics {
  signalStrength: number; // dBm
  speed: number; // Mbps
  latency: number; // ms
}

export function WifiMetrics() {
  const [metrics, setMetrics] = useState<WifiMetrics>({
    signalStrength: -65,
    speed: 100,
    latency: 15
  });

  // Simulated metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        signalStrength: prev.signalStrength + (Math.random() - 0.5) * 5,
        speed: prev.speed + (Math.random() - 0.5) * 10,
        latency: prev.latency + (Math.random() - 0.5) * 5
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSignalStatus = (dBm: number) => {
    if (dBm >= -67) return "good";
    if (dBm >= -70) return "warning";
    return "error";
  };

  const getSpeedStatus = (mbps: number) => {
    if (mbps >= 100) return "good";
    if (mbps >= 50) return "warning";
    return "error";
  };

  const getLatencyStatus = (ms: number) => {
    if (ms <= 20) return "good";
    if (ms <= 50) return "warning";
    return "error";
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-4 overflow-x-auto">
      <MetricCard
        label="Señal WiFi"
        value={Math.round(metrics.signalStrength)}
        unit="dBm"
        status={getSignalStatus(metrics.signalStrength)}
      />
      <MetricCard
        label="Velocidad"
        value={Math.round(metrics.speed)}
        unit="Mbps"
        status={getSpeedStatus(metrics.speed)}
      />
      <MetricCard
        label="Latencia"
        value={Math.round(metrics.latency)}
        unit="ms"
        status={getLatencyStatus(metrics.latency)}
      />
    </div>
  );
}