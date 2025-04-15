import { useState } from "react";
import { getDeliveryById } from "../api/deliveryApi";

export default function DeliveryDetails() {
  const [deliveryId, setDeliveryId] = useState("");
  const [details, setDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await getDeliveryById(deliveryId);
    setDetails(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">View Delivery Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Delivery ID" value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)} className="w-full border px-3 py-2" required />
        <button className="bg-purple-500 text-white px-4 py-2 rounded">Fetch</button>
      </form>
      {details && (
        <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(details, null, 2)}</pre>
      )}
    </div>
  );
}
