package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderDTO;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public OrderDTO placeOrder(Authentication authentication) {
        String userEmail = authentication.getName();
        return orderService.placeOrder(userEmail);
    }

    @GetMapping
    public List<OrderDTO> getMyOrders(Authentication authentication) {
        String userEmail = authentication.getName();
        return orderService.getOrdersByUser(userEmail);
    }

    @GetMapping("/{orderId}")
    public OrderDTO getOrderById(@PathVariable Long orderId, Authentication authentication) {
        String userEmail = authentication.getName();
        return orderService.getOrderById(userEmail, orderId);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }
}
