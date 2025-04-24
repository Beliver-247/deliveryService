import { useNavigate } from 'react-router-dom';

function DeliveryCard({ delivery }) {
  const navigate = useNavigate();

  return (
    <div
      className="border p-4 rounded-md hover:bg-gray-100 cursor-pointer"
      onClick={() => navigate(`/deliveries/${delivery.id}`)}
    >
      <p><strong>Order ID:</strong> {delivery.orderId}</p>
      <p><strong>Status:</strong> {delivery.status}</p>
      <p><strong>Customer ID:</strong> {delivery.customerId}</p>
    </div>
  );
}

export default DeliveryCard;