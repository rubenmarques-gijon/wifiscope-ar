import { useEffect, useState } from "react";
import { WifiMeasurement } from "@/services/wifiService";
import { MetricCard } from "./MetricCard";
import { WifiAdapterInfo } from "./WifiAdapterInfo";
import wifiService from "@/services/wifiService";
import { Wifi, Gauge, Clock } from "lucide-react";

interface WifiMetricsProps {
  measurements: WifiMeasurement[];
}

export function WifiMetrics({ measurements }: WifiMetricsProps) {
  const [realtimeMeasurement, setRealtimeMeasurement] = useState<WifiMeasurement | null>(null);

  // Mock WiFi adapter data - In production, this should come from the device
  const adapterData = {
    ssid: "vodafone72F0",
    protocol: "Wi-Fi 5 (802.11ac)",
    band: "5 GHz (60)",
    speed: "866/866 (Mbps)",
  };

  useEffect(() => {
    const unsubscribe = wifiService.subscribe((measurement) => {
      setRealtimeMeasurement(measurement);
    });

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

  const currentMeasurement = realtimeMeasurement || (measurements.length > 0 ? measurements[measurements.length - 1] : null);

  if (!currentMeasurement) {
    return null;
  }

  return (
    <>
      <WifiAdapterInfo data={adapterData} />
      <div className="fixed bottom-28 left-0 right-0 p-4 overflow-x-auto md:bottom-24">
        <div className="flex gap-6 max-w-screen-lg mx-auto justify-center">
          <MetricCard
            label="Señal WiFi"
            value={Math.round(currentMeasurement.signalStrength)}
            unit="dBm"
            status={getSignalStatus(currentMeasurement.signalStrength)}
            className="min-w-[140px] md:flex-1"
            icon={<Wifi className="w-5 h-5" />}
          />
          <MetricCard
            label="Velocidad"
            value={Math.round(currentMeasurement.speed)}
            unit="Mbps"
            status={getSpeedStatus(currentMeasurement.speed)}
            className="min-w-[140px] md:flex-1"
            icon={<Gauge className="w-5 h-5" />}
          />
          <MetricCard
            label="Latencia"
            value={Math.round(currentMeasurement.latency)}
            unit="ms"
            status={getLatencyStatus(currentMeasurement.latency)}
            className="min-w-[140px] md:flex-1"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>
      </div>
    </>
  );
}