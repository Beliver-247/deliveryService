package com.savorySwift.deliveryService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "order-service", url = "${order.service.url}")
public interface OrderServiceClient {

    @PutMapping("/api/orders/{orderId}/status")
    void updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status);
}