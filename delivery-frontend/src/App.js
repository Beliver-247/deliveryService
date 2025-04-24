import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateDelivery from './pages/CreateDelivery';
import ViewDeliveries from './pages/ViewDeliveries';
import TrackDelivery from './pages/TrackDelivery';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex space-x-4">
          <a href="/" className="text-white hover:underline">Create Delivery</a>
          <a href="/deliveries" className="text-white hover:underline">View Deliveries</a>
          <a href="/driver" className="text-white hover:underline">Driver Dashboard</a>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<CreateDelivery />} />
        <Route path="/deliveries" element={<ViewDeliveries />} />
        <Route path="/deliveries/:deliveryId" element={<TrackDelivery />} />
        <Route path="/driver" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;