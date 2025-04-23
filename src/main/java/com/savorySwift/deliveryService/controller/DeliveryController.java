package com.savorySwift.deliveryService.controller;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping
    public Delivery createDelivery(@RequestBody DeliveryRequest request) {
        return deliveryService.createDelivery(
                request.getOrderId(),
                request.getCustomerId(), // ✅
                request.getDeliveryLocation(),
                request.getRestaurantLocation()
        );
    }


    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(@PathVariable String deliveryId,
                                                         @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, request.getStatus()));
    }

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/{deliveryId}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable String deliveryId) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(deliveryId));
    }

    // Inner classes for request bodies
    public static class DeliveryRequest {
        private String orderId;
        private String customerId; // ✅ New field
        private Location deliveryLocation;
        private Location restaurantLocation;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }

        public String getCustomerId() { return customerId; } // ✅
        public void setCustomerId(String customerId) { this.customerId = customerId; } // ✅

        public Location getDeliveryLocation() { return deliveryLocation; }
        public void setDeliveryLocation(Location deliveryLocation) { this.deliveryLocation = deliveryLocation; }

        public Location getRestaurantLocation() { return restaurantLocation; }
        public void setRestaurantLocation(Location restaurantLocation) { this.restaurantLocation = restaurantLocation; }
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
