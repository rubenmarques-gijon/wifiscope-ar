import { Button } from "@/components/ui/button";
import { WifiMeasurement } from "@/services/wifiService";
import { FileText, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorProps {
  measurements: WifiMeasurement[];
  onGenerateReport: () => void;
  onShareReport: () => void;
}

export function ReportGenerator({
  measurements,
  onGenerateReport,
  onShareReport,
}: ReportGeneratorProps) {
  const handleGenerateReport = () => {
    onGenerateReport();
    toast.success("¡Reporte generado exitosamente!");
  };

  const handleShareReport = () => {
    onShareReport();
    toast.success("¡Reporte compartido exitosamente!");
  };

  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-2 md:flex-row md:bottom-28 md:right-6">
      <Button
        variant="default"
        size="lg"
        onClick={handleGenerateReport}
        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        <FileText className="w-4 h-4" />
        Generar Reporte
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleShareReport}
        className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Share2 className="w-4 h-4" />
        Compartir Reporte
      </Button>
    </div>
  );
}