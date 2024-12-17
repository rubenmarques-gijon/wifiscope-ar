import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Radio, Signal, ArrowDownUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface WifiAdapterInfoProps {
  data: {
    ssid: string;
    protocol: string;
    band: string;
    speed: string;
  };
}

export function WifiAdapterInfo({ data }: WifiAdapterInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const infoItems = [
    { icon: <Wifi className="w-4 h-4" />, label: "SSID", value: data.ssid },
    { icon: <Radio className="w-4 h-4" />, label: "Protocolo", value: data.protocol },
    { icon: <Signal className="w-4 h-4" />, label: "Banda", value: data.band },
    { icon: <ArrowDownUp className="w-4 h-4" />, label: "Velocidad", value: data.speed },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 left-4 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
        >
          <Wifi className="w-4 h-4 mr-2" />
          Info Adaptador
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-white/95 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold mb-6">
            Información del Adaptador WiFi
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/80 border border-gray-100"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {item.icon}
              </div>
              <div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}