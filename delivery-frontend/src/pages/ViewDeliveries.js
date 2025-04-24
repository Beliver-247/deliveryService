import { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryCard from '../components/DeliveryCard';
import DriverCard from '../components/DriverCard';

function ViewDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/delivery');
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
    fetchDeliveries();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deliveries</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Delivery List</h2>
          <div className="space-y-2">
            {deliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Drivers</h2>
          <div className="space-y-2">
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDeliveries;