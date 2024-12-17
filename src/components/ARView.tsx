import { useEffect, useRef, useState } from "react";
import { WifiMetrics } from "./WifiMetrics";
import { Toolbar } from "./Toolbar";
import arService from "@/services/arService";
import wifiService from "@/services/wifiService";
import { toast } from "sonner";
import * as THREE from "three";

export function ARView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAREnabled, setIsAREnabled] = useState(true);
  const [signalThreshold, setSignalThreshold] = useState(-70);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast.error("Could not access camera");
      }
    }

    if (containerRef.current) {
      containerRef.current.appendChild(arService.getRenderer().domElement);
    }

    setupCamera();

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      arService.render();
    }
    animate();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleMeasure = async () => {
    const measurement = await wifiService.measureWifiQuality();
    
    // In a real app, we would get the actual position from WebXR
    const position = new THREE.Vector3(
      Math.random() * 4 - 2,
      Math.random() * 4 - 2,
      -3
    );
    
    arService.addMeasurementMarker(position, measurement);
    toast.success("Measurement taken!");
  };

  const handleToggleAR = () => {
    setIsAREnabled(prev => !prev);
  };

  const handleFilterChange = (value: number) => {
    setSignalThreshold(value);
  };

  return (
    <div className="relative w-screen h-screen" ref={containerRef}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${isAREnabled ? 'visible' : 'hidden'}`}
      />
      
      <WifiMetrics 
        measurements={wifiService.filterMeasurements(signalThreshold)}
      />
      
      <Toolbar
        onMeasure={handleMeasure}
        onToggleAR={handleToggleAR}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}