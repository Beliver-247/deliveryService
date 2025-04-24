import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Loader } from '@googlemaps/js-api-loader';
import Map from '../components/Map';
import { formatTimestamp } from '../utils/helpers';
import toast, { Toaster } from 'react-hot-toast';
import { getDeliveryById, getDriverById } from '../services/api';

function TrackDelivery() {
  const { deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [driver, setDriver] = useState(null); // State for driver details
  const [driverLocation, setDriverLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [routePath, setRoutePath] = useState([]);
  const clientRef = useRef(null);
  const googleMapsRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API key
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });

    loader.load().then((google) => {
      googleMapsRef.current = google;
    });

    const fetchDelivery = async () => {
      try {
        const response = await getDeliveryById(deliveryId);
        setDelivery(response.data);
        setDriverLocation(response.data.driverLocation);
        setStatus(response.data.status);
        if (response.data.driverLocation) {
          calculateRoute(response.data);
        }
        // Fetch driver details if driverId exists
        if (response.data.driverId) {
          try {
            const driverResponse = await getDriverById(response.data.driverId);
            setDriver(driverResponse.data);
          } catch (err) {
            console.error('Error fetching driver:', err);
            toast.error('Failed to load driver details');
          }
        }
      } catch (error) {
        console.error('Error fetching delivery:', error);
        toast.error('Failed to load delivery');
      }
    };

    fetchDelivery();

    const socket = new SockJS('http://localhost:8080/delivery-websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(`/topic/delivery/${deliveryId}`, (message) => {
          const update = JSON.parse(message.body);
          console.log('Received WebSocket update:', update);
          setStatus(update.status);
          setDriverLocation(update.driverLocation);
          // Update driver details if provided in WebSocket message
          if (update.driver) {
            setDriver(update.driver);
          }
          // Show toast notifications for status changes
          switch (update.status) {
            case 'DRIVER_ON_WAY_TO_RESTAURANT':
              toast.success('Driver is on the way to the restaurant');
              break;
            case 'DRIVER_AT_RESTAURANT':
              toast.success('Driver has arrived at the restaurant');
              break;
            case 'DRIVER_LEFT_RESTAURANT':
              toast.success('Driver has left the restaurant');
              break;
            case 'DRIVER_ON_WAY_TO_DELIVERY':
              toast.success('Driver is on the way to you');
              break;
            case 'DRIVER_ARRIVED':
              toast.success('Driver has arrived at your location');
              break;
            default:
              break;
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        toast.error('WebSocket connection error');
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

  const calculateRoute = async (deliveryData) => {
    if (!googleMapsRef.current || !deliveryData || !deliveryData.driverLocation) return;
  
    const directionsService = new googleMapsRef.current.maps.DirectionsService();
    try {
      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: {
              lat: deliveryData.driverLocation.latitude,
              lng: deliveryData.driverLocation.longitude,
            },
            destination: {
              lat: deliveryData.deliveryLocation.latitude,
              lng: deliveryData.deliveryLocation.longitude,
            },
            waypoints: [
              {
                location: {
                  lat: deliveryData.restaurantLocation.latitude,
                  lng: deliveryData.restaurantLocation.longitude,
                },
                stopover: true,
              },
            ],
            optimizeWaypoints: false,
            travelMode: googleMapsRef.current.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK') resolve(result);
            else reject(new Error(`Directions request failed: ${status}`));
          }
        );
      });
  
      const path = result.routes[0].overview_path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
      setRoutePath(path);
    } catch (err) {
      console.error('Error calculating route:', err);
      toast.error('Failed to load route');
    }
  };

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
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Track Delivery: {delivery.orderId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Delivery Details</h2>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Customer ID:</strong> {delivery.customerId}
          </p>
          <p>
            <strong>Delivery Address:</strong> {delivery.deliveryLocation.address}
          </p>
          <p>
            <strong>Restaurant Address:</strong> {delivery.restaurantLocation.address}
          </p>
          {delivery.driverId && driver ? (
            <>
              <p>
                <strong>Driver Name:</strong> {driver.name}
              </p>
              <p>
                <strong>Driver Contact:</strong> {driver.contactNumber}
              </p>
            </>
          ) : (
            <p>
              <strong>Driver:</strong> Not assigned
            </p>
          )}
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
          polylinePath={routePath}
        />
      </div>
    </div>
  );
}

export default TrackDelivery;