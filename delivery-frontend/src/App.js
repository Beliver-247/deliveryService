import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateDelivery from './pages/CreateDelivery';
import ViewDeliveries from './pages/ViewDeliveries';
import TrackDelivery from './pages/TrackDelivery';
import DriverDashboard from './pages/DriverDashboard';
import DriverSimulator from './components/DriverSimulator';
import UpdateDriverAvailability from './pages/UpdateDriverAvailability';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex space-x-4">
          <a href="/" className="text-white hover:underline">Create Delivery</a>
          <a href="/deliveries" className="text-white hover:underline">View Deliveries</a>
          <a href="/driver" className="text-white hover:underline">Driver Dashboard</a>
          <a href="/drivers/availability" className="text-white hover:underline">Update Driver Availability</a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<CreateDelivery />} />
        <Route path="/deliveries" element={<ViewDeliveries />} />
        <Route path="/deliveries/:deliveryId" element={<TrackDelivery />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/drivers/availability" element={<UpdateDriverAvailability />} />
        <Route path="/simulate/:deliveryId" element={<DriverSimulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;