package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Location;

import java.util.List;

public interface DeliveryService {
    Delivery createDelivery(String orderId, Location orderLocation);
    Delivery updateDeliveryStatus(String deliveryId, String status);
    Delivery getDeliveryById(String deliveryId);

    List<Delivery> getAllDeliveries();
}