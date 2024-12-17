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
      <CardHeader>
        <CardTitle>Información del Cliente</CardTitle>
        <CardDescription>
          Por favor, ingrese los datos del cliente antes de comenzar las mediciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select
                value={clientInfo.documentType}
                onValueChange={(value) =>
                  setClientInfo({ ...clientInfo, documentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="nie">NIE</SelectItem>
                  <SelectItem value="passport">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Número de Documento</label>
              <Input
                value={clientInfo.documentNumber}
                onChange={(e) =>
                  setClientInfo({ ...clientInfo, documentNumber: e.target.value })
                }
                placeholder="Ej: 12345678A"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono de Contacto</label>
            <Input
              value={clientInfo.phone}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, phone: e.target.value })
              }
              placeholder="Ej: 666777888"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Número de Abonado</label>
            <Input
              value={clientInfo.subscriberNumber}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, subscriberNumber: e.target.value })
              }
              placeholder="Número de abonado"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Orden Kairos/FSM</label>
            <Input
              value={clientInfo.orderNumber}
              onChange={(e) =>
                setClientInfo({ ...clientInfo, orderNumber: e.target.value })
              }
              placeholder="Número de orden"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Servicio</label>
            <Select
              value={clientInfo.serviceType}
              onValueChange={(value) =>
                setClientInfo({ ...clientInfo, serviceType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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