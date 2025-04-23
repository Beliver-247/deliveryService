package com.savorySwift.deliveryService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "deliveries")
public class Delivery {
    @Id
    private String id;
    private String orderId;
    private String driverId;
    private Location deliveryLocation;
    private String status; // e.g., "PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"
    private Location driverLocation;
    private Location restaurantLocation;


    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public Location getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(Location orderLocation) { this.deliveryLocation = orderLocation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Location getDriverLocation() { return driverLocation; }
    public void setDriverLocation(Location driverLocation) { this.driverLocation = driverLocation; }

    public Location getRestaurantLocation() {
        return restaurantLocation;
    }

    public void setRestaurantLocation(Location restaurantLocation) {
        this.restaurantLocation = restaurantLocation;
    }
}
