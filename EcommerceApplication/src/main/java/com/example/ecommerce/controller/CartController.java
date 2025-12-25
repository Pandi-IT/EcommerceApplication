package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CartDTO;
import com.example.ecommerce.dto.CartItemDTO;
import com.example.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartDTO getCart(Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Fetching cart for user={}", userEmail);
        return cartService.getCartByUserEmail(userEmail);
    }

    @PostMapping("/add")
    public CartItemDTO addToCart(
            @RequestParam Long productId,
            @RequestParam int quantity,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("Add to cart request: user={}, productId={}, quantity={}",
                userEmail, productId, quantity);

        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be more than zero");
        }

        return cartService.addToCart(userEmail, productId, quantity);
    }

    @PutMapping("/update/{cartItemId}")
    public CartItemDTO updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam int quantity,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("Update cart item: user={}, cartItemId={}, quantity={}",
                userEmail, cartItemId, quantity);

        return cartService.updateCartItem(userEmail, cartItemId, quantity);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public String removeFromCart(
            @PathVariable Long cartItemId,
            Authentication authentication) {

        String userEmail = authentication.getName();
        log.info("Remove cart item: user={}, cartItemId={}", userEmail, cartItemId);

        cartService.removeFromCart(userEmail, cartItemId);
        return "Item removed from cart";
    }

    @DeleteMapping("/clear")
    public String clearCart(Authentication authentication) {
        String userEmail = authentication.getName();
        log.info("Clear cart: user={}", userEmail);

        cartService.clearCart(userEmail);
        return "Cart cleared";
    }
}

