import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Phone, Hash, Briefcase } from "lucide-react";

interface ClientInfo {
  documentType: string;
  documentNumber: string;
  phone: string;
  subscriberNumber: string;
  orderNumber: string;
  serviceType: string;
}

interface ClientInfoFormProps {
  onSubmit: (info: ClientInfo) => void;
}

export function ClientInfoForm({ onSubmit }: ClientInfoFormProps) {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    documentType: "dni",
    documentNumber: "",
    phone: "",
    subscriberNumber: "",
    orderNumber: "",
    serviceType: "installation",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(clientInfo);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Información del Cliente</CardTitle>
        <CardDescription>
          Por favor, ingrese los datos del cliente antes de comenzar las mediciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Tipo de Documento
              </label>
              <Select
                value={clientInfo.documentType}
                onValueChange={(value) =>
                  setClientInfo({ ...clientInfo, documentType: value })
                }
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border shadow-lg">
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="nie">NIE</SelectItem>
                  <SelectItem value="passport">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Número de Documento
              </label>
              <Input
                value={clientInfo.documentNumber}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, documentNumber: e.target.value })
                }
                placeholder="Ej: 12345678A"
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono de Contacto
            </label>
            <Input
              value={clientInfo.phone}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, phone: e.target.value })
              }
              placeholder="Ej: 666777888"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Número de Abonado
            </label>
            <Input
              value={clientInfo.subscriberNumber}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, subscriberNumber: e.target.value })
              }
              placeholder="Número de abonado"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Orden Kairos/FSM
            </label>
            <Input
              value={clientInfo.orderNumber}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, orderNumber: e.target.value })
              }
              placeholder="Número de orden"
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Tipo de Servicio
            </label>
            <Select
              value={clientInfo.serviceType}
              onValueChange={(value) =>
                setClientInfo({ ...clientInfo, serviceType: value })
              }
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border shadow-lg">
                <SelectItem value="installation">Instalación</SelectItem>
                <SelectItem value="repair">Avería</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Comenzar Mediciones
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}