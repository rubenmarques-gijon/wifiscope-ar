import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Camera, Gauge, Settings, Wifi, BarChart2, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  onMeasure: () => void;
  onToggleAR: () => void;
  onFilterChange: (value: number) => void;
  onToggleComparison: () => void;
}

export function Toolbar({ 
  onMeasure, 
  onToggleAR, 
  onFilterChange,
  onToggleComparison 
}: ToolbarProps) {
  const [signalThreshold, setSignalThreshold] = useState([-70]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="grid grid-cols-3 gap-4 md:flex md:gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" onClick={onToggleAR} className="w-full md:w-auto">
                <Camera className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">AR</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Activar/Desactivar vista de Realidad Aumentada</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="lg" onClick={onMeasure} className="w-full md:w-auto">
                <Gauge className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Medir</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tomar medición en el punto actual</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" onClick={onToggleComparison} className="w-full md:w-auto">
                <BarChart2 className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Comparar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver gráfica comparativa de mediciones</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center gap-4 flex-1 max-w-xs mx-auto md:mx-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-4 w-full">
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
                  className="flex-1"
                />
                <span className="text-sm text-gray-500 min-w-[4rem]">
                  {signalThreshold[0]} dBm
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filtrar mediciones por intensidad de señal mínima</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}