package com.savorySwift.deliveryService.controller;



import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {
    @Autowired
    private DeliveryService deliveryService;

    @PostMapping
    public Delivery createDelivery(@RequestBody DeliveryRequest request) {
        return deliveryService.createDelivery(request.getOrderId(), request.getOrderLocation());
    }

    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Delivery> updateDeliveryStatus(@PathVariable String deliveryId,
                                                         @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(deliveryId, request.getStatus()));
    }

    @GetMapping("/{deliveryId}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable String deliveryId) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(deliveryId));
    }

    // Inner classes for request bodies
    public static class DeliveryRequest {
        private String orderId;
        private Location orderLocation;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public Location getOrderLocation() { return orderLocation; }
        public void setOrderLocation(Location orderLocation) { this.orderLocation = orderLocation; }
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
