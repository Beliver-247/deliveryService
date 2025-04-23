package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.repository.DeliveryRepository;
import com.savorySwift.deliveryService.util.GoogleMapsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryServiceImpl implements DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private GoogleMapsUtil googleMapsUtil;

    @Autowired
    private DriverAssignmentService driverAssignmentService;

    @Override
    public Delivery createDelivery(String orderId, Location deliveryLocation, Location restaurantLocation) {
        String deliveryAddress = googleMapsUtil.getAddressFromCoordinates(
                deliveryLocation.getLatitude(), deliveryLocation.getLongitude());
        deliveryLocation.setAddress(deliveryAddress);

        String restaurantAddress = googleMapsUtil.getAddressFromCoordinates(
                restaurantLocation.getLatitude(), restaurantLocation.getLongitude());
        restaurantLocation.setAddress(restaurantAddress);

        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setDeliveryLocation(deliveryLocation);
        delivery.setRestaurantLocation(restaurantLocation);
        delivery.setStatus("PENDING");

        String driverId = driverAssignmentService.assignDriver(deliveryLocation);
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

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

}