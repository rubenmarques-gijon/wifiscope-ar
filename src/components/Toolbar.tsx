import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Camera, Gauge, Settings, Wifi } from "lucide-react";

interface ToolbarProps {
  onMeasure: () => void;
  onToggleAR: () => void;
  onFilterChange: (value: number) => void;
}

export function Toolbar({ onMeasure, onToggleAR, onFilterChange }: ToolbarProps) {
  const [signalThreshold, setSignalThreshold] = useState([-70]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex gap-4 items-center justify-between">
      <div className="flex gap-2">
        <Button variant="outline" size="lg" onClick={onToggleAR}>
          <Camera className="mr-2 h-4 w-4" />
          Toggle AR
        </Button>
        <Button variant="default" size="lg" onClick={onMeasure}>
          <Gauge className="mr-2 h-4 w-4" />
          Measure Here
        </Button>
      </div>
      
      <div className="flex items-center gap-4 flex-1 max-w-xs">
        <Wifi className="h-4 w-4" />
        <Slider
          value={signalThreshold}
          onValueChange={(value) => {
            setSignalThreshold(value);
            onFilterChange(value[0]);
          }}
          min={-100}
          max={-30}
          step={5}
        />
      </div>

      <Button variant="outline" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}