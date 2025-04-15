import { useState } from "react";
import { createDelivery } from "../api/deliveryApi";

export default function CreateDeliveryForm() {
  const [orderId, setOrderId] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const location = { latitude: parseFloat(lat), longitude: parseFloat(lng) };
    const data = await createDelivery(orderId, location);
    setResult(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Delivery</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Order ID" value={orderId}
          onChange={(e) => setOrderId(e.target.value)} className="w-full border px-3 py-2" required />
        <input type="number" placeholder="Latitude" value={lat}
          onChange={(e) => setLat(e.target.value)} className="w-full border px-3 py-2" required />
        <input type="number" placeholder="Longitude" value={lng}
          onChange={(e) => setLng(e.target.value)} className="w-full border px-3 py-2" required />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
