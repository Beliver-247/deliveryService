import React, { useEffect, useState } from "react";
import { fetchDeliveries, updateDeliveryStatus } from "../api/deliveryApi";
import DeliveryStatusDropdown from "./DeliveryStatusDropdown";

const DriverDeliveryList = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    fetchDeliveries().then(setDeliveries);
  }, []);

  const handleStatusChange = async (deliveryId, newStatus) => {
    const updated = await updateDeliveryStatus(deliveryId, newStatus);
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? updated : d))
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Assigned Deliveries</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="border-t">
              <td className="p-2">{delivery.orderId}</td>
              <td className="p-2">
                {delivery.orderLocation?.latitude}, {delivery.orderLocation?.longitude}
              </td>
              <td className="p-2">
                <DeliveryStatusDropdown
                  currentStatus={delivery.status}
                  onChange={(status) => handleStatusChange(delivery.id, status)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverDeliveryList;
