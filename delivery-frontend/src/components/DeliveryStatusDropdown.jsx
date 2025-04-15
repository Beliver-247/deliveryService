import React from "react";

const statuses = ["PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"];

const DeliveryStatusDropdown = ({ currentStatus, onChange }) => {
  return (
    <select
      className="p-2 border rounded-md"
      value={currentStatus}
      onChange={(e) => onChange(e.target.value)}
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default DeliveryStatusDropdown;
