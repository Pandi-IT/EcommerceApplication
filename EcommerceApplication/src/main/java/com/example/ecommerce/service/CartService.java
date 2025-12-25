package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartDTO;
import com.example.ecommerce.dto.CartItemDTO;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public CartDTO getCartByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        List<CartItemDTO> cartItemDTOs = cartRepository.findCartItemsByUser(user);

        CartDTO cartDTO = new CartDTO();
        cartDTO.setUserId(user.getId());
        cartDTO.setItems(cartItemDTOs);
        cartDTO.setTotalAmount(cartItemDTOs.stream()
                .map(CartItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return cartDTO;
    }

    @Transactional
    public CartItemDTO addToCart(String userEmail, Long productId, int quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartRepository.findByUserAndProduct(user, product);

        CartItemDTO result;
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            CartItem savedItem = cartRepository.save(cartItem);
            result = convertToDTO(savedItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            CartItem savedItem = cartRepository.save(cartItem);
            result = convertToDTO(savedItem);
        }

        return result;
    }

    @Transactional
    public CartItemDTO updateCartItem(String userEmail, Long cartItemId, int quantity) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found"));

        // Check if the cart item belongs to the user
        if (!cartItem.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only update your own cart items");
        }

        if (quantity <= 0) {
            cartRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem savedItem = cartRepository.save(cartItem);
        return convertToDTO(savedItem);
    }

    @Transactional
    public void removeFromCart(String userEmail, Long cartItemId) {
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new NoSuchElementException("Cart item not found"));

        // Check if the cart item belongs to the user
        if (!cartItem.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You can only remove your own cart items");
        }

        cartRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        cartRepository.deleteByUser(user);
    }

    public List<CartItem> getCartItemsForOrder(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return cartRepository.findByUser(user);
    }

    private CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());

        // Safely access user data
        if (cartItem.getUser() != null) {
            dto.setUserId(cartItem.getUser().getId());
        }

        // Safely access product data with null checks
        if (cartItem.getProduct() != null) {
            dto.setProductId(cartItem.getProduct().getId());
            dto.setProductName(cartItem.getProduct().getName());
            dto.setProductPrice(cartItem.getProduct().getPrice());
        } else {
            // Fallback values if product is not loaded
            dto.setProductId(null);
            dto.setProductName("Unknown Product");
            dto.setProductPrice(BigDecimal.ZERO);
        }

        dto.setQuantity(cartItem.getQuantity());
        dto.setTotalPrice(cartItem.getTotalPrice());

        return dto;
    }

    private BigDecimal calculateTotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
