import { Button } from "@/components/ui/button";
import { FileText, Share2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const handleGenerateReport = () => {
    toast.success("¡Reporte generado exitosamente!");
  };

  const handleShareReport = () => {
    toast.success("¡Reporte compartido exitosamente!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-lg mx-auto space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(from)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mediciones
        </Button>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold">Gestión de Informes</h1>
          
          <div className="space-y-4">
            <Button
              onClick={handleGenerateReport}
              className="w-full flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generar Informe
            </Button>

            <Button
              variant="outline"
              onClick={handleShareReport}
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir Informe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}