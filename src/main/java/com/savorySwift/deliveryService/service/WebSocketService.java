package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Location;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendDeliveryUpdate(String deliveryId, String status, Location driverLocation) {
        messagingTemplate.convertAndSend("/topic/delivery/" + deliveryId,
                new DeliveryUpdate(status, driverLocation));
    }

    // Inner class for WebSocket message payload
    public static class DeliveryUpdate {
        private String status;
        private Location driverLocation;

        public DeliveryUpdate(String status, Location driverLocation) {
            this.status = status;
            this.driverLocation = driverLocation;
        }

        // Getters
        public String getStatus() { return status; }
        public Location getDriverLocation() { return driverLocation; }
    }
}
