import { ARView } from "@/components/ARView";
import { WifiMetrics } from "@/components/WifiMetrics";

const Index = () => {
  return (
    <div className="relative w-screen h-screen">
      <ARView />
      <WifiMetrics />
    </div>
  );
};

export default Index;