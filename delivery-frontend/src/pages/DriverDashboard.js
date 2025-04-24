import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Fetch deliveries
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/delivery');
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  useEffect(() => {
    // Initialize WebSocket
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/delivery-websocket'),
      debug: (str) => console.log(str),
      reconnectDelay: 5000, // auto reconnect
    });
    

    client.onConnect = () => {
      stompClientRef.current = client;
    
      deliveries.forEach((delivery) => {
        client.subscribe(`/topic/delivery/${delivery.id}/driver-response`, (message) => {
          const update = JSON.parse(message.body);
          setDeliveries((prev) =>
            prev.map((d) =>
              d.id === delivery.id ? { ...d, status: update.response } : d
            )
          );
        });
      });
    };
    
    client.onStompError = (frame) => {
      console.error('Broker error:', frame.headers['message']);
    };
    
    client.activate(); // starts the connection
    

    // Cleanup WebSocket connection and subscriptions
    return () => {
      if (stompClientRef.current && stompClientRef.current.active) {
        stompClientRef.current.deactivate();
        console.log('WebSocket disconnected');
      }
    };
  }, [deliveries]);
    

  const handleDriverResponse = async (deliveryId, response) => {
    try {
      await axios.put(`http://localhost:8080/api/delivery/${deliveryId}/driver-response`, {
        response,
      });
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === deliveryId
            ? { ...d, status: response === 'ACCEPT' ? 'DRIVER_ASSIGNED' : 'DRIVER_REJECTED' }
            : d
        )
      );
    } catch (error) {
      console.error('Error sending driver response:', error);
      alert('Failed to send response');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
      <ul className="space-y-4">
        {deliveries
          .filter((delivery) => delivery.status === 'WAITING_FOR_DRIVER_RESPONSE')
          .map((delivery) => (
            <li key={delivery.id} className="border p-4 rounded-md">
              <p><strong>Order ID:</strong> {delivery.orderId}</p>
              <p><strong>Customer ID:</strong> {delivery.customerId}</p>
              <p><strong>Delivery Address:</strong> {delivery.deliveryLocation.address}</p>
              <p><strong>Restaurant Address:</strong> {delivery.restaurantLocation.address}</p>
              <p><strong>Status:</strong> {delivery.status}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleDriverResponse(delivery.id, 'ACCEPT')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDriverResponse(delivery.id, 'REJECT')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DriverDashboard;