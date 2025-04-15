const BASE_URL = "http://localhost:8080/api/delivery";

export const createDelivery = async (orderId, orderLocation) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, orderLocation }),
  });
  return response.json();
};

export const fetchDeliveries = async () => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const updateDeliveryStatus = async (deliveryId, status) => {
  const res = await fetch(`${BASE_URL}/${deliveryId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const getDeliveryById = async (deliveryId) => {
  const response = await fetch(`${BASE_URL}/${deliveryId}`);
  return response.json();
};
