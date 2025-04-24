import { useState, useEffect } from 'react';
import DeliveryCard from '../components/DeliveryCard';
import { getDeliveries, deleteDelivery } from '../services/api';

function ViewDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getDeliveries();
        setDeliveries(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        setError('Failed to load deliveries. Please try again.');
      }
    };

    fetchDeliveries();
  }, []);

  const handleDelete = async (deliveryId) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
        try {
            await deleteDelivery(deliveryId);
            setDeliveries((prev) => prev.filter((delivery) => delivery.id !== deliveryId));
            setError(null);
        } catch (error) {
            console.error('Error deleting delivery:', error);
            setError('Failed to delete delivery. Please try again.');
        }
    }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deliveries</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Delivery List</h2>
          <div className="space-y-2">
            {deliveries.length === 0 ? (
              <p className="text-gray-500">No deliveries found.</p>
            ) : (
              deliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <DeliveryCard delivery={delivery} />
                  </div>
                  <button
                    onClick={() => handleDelete(delivery.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDeliveries;