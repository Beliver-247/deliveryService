import { useState } from "react";
import { updateDeliveryStatus } from "../api/deliveryApi";

export default function UpdateStatusForm() {
  const [deliveryId, setDeliveryId] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await updateDeliveryStatus(deliveryId, status);
    setResult(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Delivery Status</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Delivery ID" value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)} className="w-full border px-3 py-2" required />
        <input type="text" placeholder="New Status" value={status}
          onChange={(e) => setStatus(e.target.value)} className="w-full border px-3 py-2" required />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Update</button>
      </form>
      {result && (
        <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
