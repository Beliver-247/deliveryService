import React, { useEffect, useState } from "react";
import { fetchDeliveries } from "../api/deliveryApi";

const DeliveryTracking = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries().then(setDeliveries);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Delivery Tracking</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Driver ID</th>
            <th className="p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="border-t">
              <td className="p-2">{delivery.orderId}</td>
              <td className="p-2">{delivery.status}</td>
              <td className="p-2">{delivery.driverId || "Unassigned"}</td>
              <td className="p-2">
                {delivery.orderLocation?.latitude}, {delivery.orderLocation?.longitude}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTracking;
