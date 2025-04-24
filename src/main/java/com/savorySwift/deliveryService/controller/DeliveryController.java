package com.savorySwift.deliveryService.controller;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Driver;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.service.DeliveryService;
import com.savorySwift.deliveryService.service.DriverAssignmentService;
import com.savorySwift.deliveryService.service.DriverService;
import com.savorySwift.deliveryService.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private DriverAssignmentService driverAssignmentService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private WebSocketService webSocketService;

    @PostMapping
    public Delivery createDelivery(@RequestBody DeliveryRequest request) {
        return deliveryService.createDelivery(
                request.getOrderId(),
                request.getCustomerId(),
                request.getDeliveryLocation(),
                request.getRestaurantLocation()
        );
    }

    @PostMapping("/{deliveryId}/assign-driver")
    public ResponseEntity<Delivery> assignDriver(@PathVariable String deliveryId) {
        Delivery delivery = deliveryService.getDeliveryById(deliveryId);
        String driverId = driverAssignmentService.proposeDriverAssignment(delivery.getDeliveryLocation());

        delivery.setDriverId(driverId);
        delivery.setAssignmentStatus("PENDING");
        delivery.setStatus("WAITING_FOR_DRIVER_RESPONSE");
        delivery.addStatusChange("WAITING_FOR_DRIVER_RESPONSE");

        return ResponseEntity.ok(deliveryService.updateDelivery(delivery));
    }

    @PutMapping("/{deliveryId}/driver-response")
    public ResponseEntity<Delivery> handleDriverResponse(
            @PathVariable String deliveryId,
            @RequestBody DriverResponseRequest request) {

        Delivery delivery = deliveryService.getDeliveryById(deliveryId);

        // Validate delivery state
        if (!delivery.getStatus().equals("WAITING_FOR_DRIVER_RESPONSE")) {
            throw new IllegalStateException("Delivery not in acceptable state");
        }

        if (delivery.getDriverId() == null) {
            throw new IllegalStateException("No driver assigned to this delivery");
        }

        // Handle response
        if (request.getResponse().equalsIgnoreCase("ACCEPT")) {
            delivery.setAssignmentStatus("ACCEPTED");
            delivery.setStatus("DRIVER_ASSIGNED");
            delivery.addStatusChange("DRIVER_ASSIGNED");

            // Mark driver as unavailable
            Driver driver = driverService.getDriverById(delivery.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found"));
            driver.setAvailable(false);
            driverService.updateDriver(delivery.getDriverId(), driver);

            // Notify driver response for ACCEPT
            webSocketService.notifyDriverResponse(deliveryId, "ACCEPT");

            // Log for debugging
            System.out.println("Driver accepted: " + delivery.getStatus() + ", Assignment: " + delivery.getAssignmentStatus());
        } else if (request.getResponse().equalsIgnoreCase("REJECT")) {
            // Mark current assignment as rejected
            delivery.setAssignmentStatus("REJECTED");
            delivery.addStatusChange("DRIVER_REJECTED");

            // Mark the rejecting driver as available
            Driver rejectingDriver = driverService.getDriverById(delivery.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Rejecting driver not found"));
            rejectingDriver.setAvailable(true);
            driverService.updateDriver(rejectingDriver.getId(), rejectingDriver);

            // Propose a new driver
            String newDriverId;
            try {
                newDriverId = driverAssignmentService.proposeDriverAssignment(delivery.getDeliveryLocation());
            } catch (RuntimeException e) {
                delivery.setStatus("NO_DRIVERS_AVAILABLE");
                delivery.addStatusChange("NO_DRIVERS_AVAILABLE");
                Delivery updatedDelivery = deliveryService.updateDelivery(delivery);
                webSocketService.notifyDriverResponse(deliveryId, "NO_DRIVERS_AVAILABLE");
                return ResponseEntity.ok(updatedDelivery);
            }

            // Fetch new driver's details
            Driver newDriver = driverService.getDriverById(newDriverId)
                    .orElseThrow(() -> new RuntimeException("New driver not found"));

            // Update delivery with new driver
            delivery.setDriverId(newDriverId);
            delivery.setDriverLocation(newDriver.getCurrentLocation());
            delivery.setAssignmentStatus("PENDING");
            delivery.setStatus("WAITING_FOR_DRIVER_RESPONSE");
            delivery.addStatusChange("REASSIGNED_TO_NEW_DRIVER");

            // Notify via WebSocket about rejection and reassignment
            webSocketService.notifyDriverResponse(deliveryId, "REJECTED_AND_REASSIGNED");

            // Log for debugging
            System.out.println("Driver rejected, reassigned to new driver: " + newDriverId +
                    ", Status: " + delivery.getStatus() +
                    ", Assignment: " + delivery.getAssignmentStatus());
        } else {
            throw new IllegalArgumentException("Invalid response: must be ACCEPT or REJECT");
        }

        // Save the updated delivery
        Delivery updatedDelivery = deliveryService.updateDelivery(delivery);

        // Verify the saved state
        System.out.println("Saved delivery: Status=" + updatedDelivery.getStatus() +
                ", Assignment=" + updatedDelivery.getAssignmentStatus() +
                ", DriverId=" + updatedDelivery.getDriverId() +
                ", History=" + updatedDelivery.getStatusHistory());

        // Send WebSocket update for real-time tracking
        webSocketService.sendRealTimeLocationUpdate(
                deliveryId,
                updatedDelivery.getStatus(),
                updatedDelivery.getDriverLocation()
        );

        return ResponseEntity.ok(updatedDelivery);
    }

    @PostMapping("/{deliveryId}/reassign")
    public ResponseEntity<Delivery> reassignDelivery(@PathVariable String deliveryId) {
        Delivery delivery = deliveryService.getDeliveryById(deliveryId);

        if (!delivery.getAssignmentStatus().equals("REJECTED")) {
            throw new RuntimeException("Delivery not in rejected state");
        }

        String newDriverId = driverAssignmentService.proposeDriverAssignment(delivery.getDeliveryLocation());
        Driver newDriver = driverService.getDriverById(newDriverId)
                .orElseThrow(() -> new RuntimeException("New driver not found"));

        delivery.setDriverId(newDriverId);
        delivery.setDriverLocation(newDriver.getCurrentLocation());
        delivery.setAssignmentStatus("PENDING");
        delivery.setStatus("WAITING_FOR_DRIVER_RESPONSE");
        delivery.addStatusChange("REASSIGNED_TO_NEW_DRIVER");

        return ResponseEntity.ok(deliveryService.updateDelivery(delivery));
    }

    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(
            @PathVariable String deliveryId,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, request.getStatus()));
    }

    @PutMapping("/{deliveryId}/location")
    public ResponseEntity<Delivery> updateDriverLocation(
            @PathVariable String deliveryId,
            @RequestBody Location location) {
        location.setLastUpdated(Instant.now());
        return ResponseEntity.ok(deliveryService.updateDriverLocation(deliveryId, location));
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/{deliveryId}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable String deliveryId) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(deliveryId));
    }

    @DeleteMapping("/{deliveryId}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable String deliveryId) {
        deliveryService.deleteDelivery(deliveryId);
        return ResponseEntity.noContent().build();
    }


    // Request DTOs
    public static class DeliveryRequest {
        private String orderId;
        private String customerId;
        private Location deliveryLocation;
        private Location restaurantLocation;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getCustomerId() { return customerId; }
        public void setCustomerId(String customerId) { this.customerId = customerId; }
        public Location getDeliveryLocation() { return deliveryLocation; }
        public void setDeliveryLocation(Location deliveryLocation) { this.deliveryLocation = deliveryLocation; }
        public Location getRestaurantLocation() { return restaurantLocation; }
        public void setRestaurantLocation(Location restaurantLocation) { this.restaurantLocation = restaurantLocation; }
    }

    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class DriverResponseRequest {
        private String response; // "ACCEPT" or "REJECT"
        public String getResponse() { return response; }
        public void setResponse(String response) { this.response = response; }
    }
}