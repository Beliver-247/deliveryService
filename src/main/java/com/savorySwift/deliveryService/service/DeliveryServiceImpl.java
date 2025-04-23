package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Delivery;
import com.savorySwift.deliveryService.model.Driver;
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

    @Autowired
    private DriverService driverService;

    @Override
    public Delivery createDelivery(String orderId, String customerId, Location deliveryLocation, Location restaurantLocation) {
        // Reverse geocode delivery and restaurant locations
        String deliveryAddress = googleMapsUtil.getAddressFromCoordinates(
                deliveryLocation.getLatitude(), deliveryLocation.getLongitude());
        deliveryLocation.setAddress(deliveryAddress);

        String restaurantAddress = googleMapsUtil.getAddressFromCoordinates(
                restaurantLocation.getLatitude(), restaurantLocation.getLongitude());
        restaurantLocation.setAddress(restaurantAddress);

        // Assign driver
        String driverId = driverAssignmentService.assignDriver(deliveryLocation);

        // 🔥 Fetch the assigned driver to get current location
        Driver assignedDriver = driverService.getDriverById(driverId)
                .orElseThrow(() -> new RuntimeException("Assigned driver not found"));

        // 🔥 Set delivery fields
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setCustomerId(customerId);
        delivery.setDeliveryLocation(deliveryLocation);
        delivery.setRestaurantLocation(restaurantLocation);
        delivery.setDriverId(driverId);
        delivery.setDriverLocation(assignedDriver.getCurrentLocation()); // ✅ Now it's set
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