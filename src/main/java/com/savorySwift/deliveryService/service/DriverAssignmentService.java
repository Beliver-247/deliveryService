package com.savorySwift.deliveryService.service;

import com.savorySwift.deliveryService.model.Driver;
import com.savorySwift.deliveryService.model.Location;
import com.savorySwift.deliveryService.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverAssignmentService {
    @Autowired
    private DriverRepository driverRepository;

    public String assignDriver(Location orderLocation) {
        List<Driver> availableDrivers = driverRepository.findByAvailableTrue();
        if (availableDrivers.isEmpty()) {
            throw new RuntimeException("No available drivers");
        }

        // Simple logic: Assign the first available driver
        // In a real system, calculate distance between orderLocation and driver location
        Driver driver = availableDrivers.get(0);
        driver.setAvailable(false);
        driverRepository.save(driver);
        return driver.getId();
    }
}
