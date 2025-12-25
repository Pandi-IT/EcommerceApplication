package com.example.ecommerce.repository;

import com.example.ecommerce.dto.CartItemDTO;
import com.example.ecommerce.entity.CartItem;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    @Query("SELECT ci FROM CartItem ci JOIN FETCH ci.product p JOIN FETCH ci.user u WHERE ci.user = :user")
    List<CartItem> findByUserWithProducts(@Param("user") User user);

    @Query("SELECT ci FROM CartItem ci WHERE ci.user = :user")
    List<CartItem> findByUser(@Param("user") User user);

    @Query("""
        SELECT new com.example.ecommerce.dto.CartItemDTO(
            ci.id,
            ci.user.id,
            ci.product.id,
            p.name,
            p.price,
            ci.quantity,
            p.price * ci.quantity
        )
        FROM CartItem ci
        JOIN ci.product p
        WHERE ci.user = :user
        """)
    List<CartItemDTO> findCartItemsByUser(@Param("user") User user);

    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
}