import { useEffect, useState } from "react";
import { WifiMeasurement } from "@/services/wifiService";
import { MetricCard } from "./MetricCard";
import wifiService from "@/services/wifiService";

interface WifiMetricsProps {
  measurements: WifiMeasurement[];
}

export function WifiMetrics({ measurements }: WifiMetricsProps) {
  const [realtimeMeasurement, setRealtimeMeasurement] = useState<WifiMeasurement | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = wifiService.subscribe((measurement) => {
      setRealtimeMeasurement(measurement);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
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

  // Use realtime measurement if available, otherwise use average from measurements
  const currentMeasurement = realtimeMeasurement || (measurements.length > 0 ? measurements[measurements.length - 1] : null);

  if (!currentMeasurement) {
    return null;
  }

  return (
    <div className="fixed bottom-24 left-0 right-0 p-4 overflow-x-auto">
      <div className="flex gap-4 max-w-screen-lg mx-auto">
        <MetricCard
          label="Señal WiFi"
          value={Math.round(currentMeasurement.signalStrength)}
          unit="dBm"
          status={getSignalStatus(currentMeasurement.signalStrength)}
          className="flex-1"
        />
        <MetricCard
          label="Velocidad"
          value={Math.round(currentMeasurement.speed)}
          unit="Mbps"
          status={getSpeedStatus(currentMeasurement.speed)}
          className="flex-1"
        />
        <MetricCard
          label="Latencia"
          value={Math.round(currentMeasurement.latency)}
          unit="ms"
          status={getLatencyStatus(currentMeasurement.latency)}
          className="flex-1"
        />
      </div>
    </div>
  );
}