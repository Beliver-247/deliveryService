package com.savorySwift.deliveryService.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "deliveries")
public class Delivery {
    @Id
    private String id;
    private String orderId;
    private String driverId;
    private Location orderLocation;
    private String status; // e.g., "PENDING", "ASSIGNED", "IN_TRANSIT", "DELIVERED"
    private Location driverLocation;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public Location getOrderLocation() { return orderLocation; }
    public void setOrderLocation(Location orderLocation) { this.orderLocation = orderLocation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Location getDriverLocation() { return driverLocation; }
    public void setDriverLocation(Location driverLocation) { this.driverLocation = driverLocation; }
}
