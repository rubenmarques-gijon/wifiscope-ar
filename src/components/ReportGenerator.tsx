import { Button } from "@/components/ui/button";
import { WifiMeasurement } from "@/services/wifiService";
import { FileText, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorProps {
  measurements: WifiMeasurement[];
  onGenerateReport: () => void;
  onShareReport: () => void;
}

export function ReportGenerator({ measurements, onGenerateReport, onShareReport }: ReportGeneratorProps) {
  const handleGenerateReport = () => {
    onGenerateReport();
    toast.success("Report generated successfully!");
  };

  const handleShareReport = () => {
    onShareReport();
    toast.success("Report shared successfully!");
  };

  return (
    <div className="fixed bottom-24 right-4 flex flex-col gap-2">
      <Button
        variant="default"
        size="lg"
        onClick={handleGenerateReport}
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Generate Report
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={handleShareReport}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Report
      </Button>
    </div>
  );
}