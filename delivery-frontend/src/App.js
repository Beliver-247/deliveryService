import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DriverDashboard from "./pages/DriverDashboard";
import DeliveryTracking from "./pages/DeliveryTracking";
import './App.css';

import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/tracking" element={<DeliveryTracking />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

