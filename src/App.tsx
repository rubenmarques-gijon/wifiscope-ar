import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Reports from "@/pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;