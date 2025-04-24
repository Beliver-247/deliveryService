import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // ✅ Updated import
import Map from '../components/Map';
import { formatTimestamp } from '../utils/helpers';

function TrackDelivery() {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [status, setStatus] = useState('');
  const clientRef = useRef(null); // 👈 To store the client for cleanup

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/delivery/${deliveryId}`);
        setDelivery(response.data);
        setDriverLocation(response.data.driverLocation);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching delivery:', error);
      }
    };

    fetchDelivery();

    const socket = new SockJS('http://localhost:8080/delivery-websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(`/topic/delivery/${deliveryId}`, (message) => {
          const update = JSON.parse(message.body);
          setStatus(update.status);
          setDriverLocation(update.driverLocation);
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [deliveryId]);

  if (!delivery) {
    return <div>Loading...</div>;
  }

  const markers = [
    {
      position: { lat: delivery.deliveryLocation.latitude, lng: delivery.deliveryLocation.longitude },
      title: 'Delivery Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    },
    {
      position: { lat: delivery.restaurantLocation.latitude, lng: delivery.restaurantLocation.longitude },
      title: 'Restaurant Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    },
  ];

  if (driverLocation) {
    markers.push({
      position: { lat: driverLocation.latitude, lng: driverLocation.longitude },
      title: 'Driver Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    });
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Track Delivery: {delivery.orderId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Delivery Details</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Customer ID:</strong> {delivery.customerId}</p>
          <p><strong>Delivery Address:</strong> {delivery.deliveryLocation.address}</p>
          <p><strong>Restaurant Address:</strong> {delivery.restaurantLocation.address}</p>
          <p><strong>Driver ID:</strong> {delivery.driverId}</p>
          <h3 className="text-lg font-semibold mt-4">Status History</h3>
          <ul className="list-disc pl-5">
            {delivery.statusHistory.map((status, index) => (
              <li key={index}>
                {status.status} - {formatTimestamp(status.timestamp)}
              </li>
            ))}
          </ul>
        </div>
        <Map
          center={{ lat: delivery.deliveryLocation.latitude, lng: delivery.deliveryLocation.longitude }}
          zoom={12}
          markers={markers}
        />
      </div>
    </div>
  );
}

export default TrackDelivery;
