import { WifiMeasurement } from "@/services/wifiService";
import { MetricCard } from "./MetricCard";

interface WifiMetricsProps {
  measurements: WifiMeasurement[];
}

export function WifiMetrics({ measurements }: WifiMetricsProps) {
  const getAverageMetric = (metric: keyof WifiMeasurement): number => {
    if (measurements.length === 0) return 0;
    const sum = measurements.reduce((acc, m) => {
      const value = m[metric];
      return acc + (typeof value === 'number' ? value : 0);
    }, 0);
    return sum / measurements.length;
  };

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

  const avgSignal = getAverageMetric('signalStrength');
  const avgSpeed = getAverageMetric('speed');
  const avgLatency = getAverageMetric('latency');

  return (
    <div className="absolute bottom-24 left-0 right-0 p-4 flex gap-4 overflow-x-auto">
      <MetricCard
        label="Señal WiFi"
        value={Math.round(avgSignal)}
        unit="dBm"
        status={getSignalStatus(avgSignal)}
      />
      <MetricCard
        label="Velocidad"
        value={Math.round(avgSpeed)}
        unit="Mbps"
        status={getSpeedStatus(avgSpeed)}
      />
      <MetricCard
        label="Latencia"
        value={Math.round(avgLatency)}
        unit="ms"
        status={getLatencyStatus(avgLatency)}
      />
    </div>
  );
}