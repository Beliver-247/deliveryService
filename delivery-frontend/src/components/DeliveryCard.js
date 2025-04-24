import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getDriverById } from '../services/api';

function DeliveryCard({ delivery }) {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (delivery.driverId) {
      // Fetch driver details
      getDriverById(delivery.driverId)
        .then((response) => {
          setDriver(response.data);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching driver:', err);
          setError('Failed to load driver details');
          setDriver(null);
        });
    }
  }, [delivery.driverId]);

  return (
    <div
      className="border p-4 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={() => navigate(`/deliveries/${delivery.id}`)}
    >
      <p>
        <strong>Order ID:</strong> {delivery.orderId}
      </p>
      <p>
        <strong>Status:</strong> {delivery.status}
      </p>
      <p>
        <strong>Customer ID:</strong> {delivery.customerId}
      </p>
      {delivery.driverId ? (
        driver ? (
          <>
            <p>
              <strong>Driver Name:</strong> {driver.name}
            </p>
            <p>
              <strong>Driver Contact:</strong> {driver.contactNumber}
            </p>
          </>
        ) : error ? (
          <p className="text-red-500">
            <strong>Error:</strong> {error}
          </p>
        ) : (
          <p>Loading driver details...</p>
        )
      ) : (
        <p>
          <strong>Driver:</strong> Not assigned
        </p>
      )}
    </div>
  );
}

export default DeliveryCard;