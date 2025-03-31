package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DriverAssignmentService driverAssignmentService;

    @Override
    public Delivery createDelivery(String orderId, Location orderLocation) {
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setOrderLocation(orderLocation);
        delivery.setStatus("PENDING");

        // Assign a driver
        String driverId = driverAssignmentService.assignDriver(orderLocation);
        delivery.setDriverId(driverId);
        delivery.setStatus("ASSIGNED");

        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery updateDeliveryStatus(String deliveryId, String status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        delivery.setStatus(status);
        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery getDeliveryById(String deliveryId) {
        return deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }
}