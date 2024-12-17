import { useEffect, useState } from 'react';
import { WifiMeasurement } from '@/services/wifiService';
import { Chart } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ComparisonViewProps {
  measurements: WifiMeasurement[];
}

export function ComparisonView({ measurements }: ComparisonViewProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const formattedData = measurements.map((m, index) => ({
      name: `Point ${index + 1}`,
      'Signal Strength': Math.abs(m.signalStrength),
      'Speed (Mbps)': m.speed,
      'Latency (ms)': m.latency
    }));
    setChartData(formattedData);
  }, [measurements]);

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Measurement Comparison</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Signal Strength" fill="#8884d8" />
            <Bar dataKey="Speed (Mbps)" fill="#82ca9d" />
            <Bar dataKey="Latency (ms)" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}