package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));
        return convertToDTO(product);
    }

    public ProductDTO addProduct(ProductDTO productDTO, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new NoSuchElementException("Seller not found"));

        if (!seller.getRole().equals(Role.SELLER)) {
            throw new IllegalArgumentException("Only sellers can add products");
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setSeller(seller);

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long productId, ProductDTO productDTO, String sellerEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        // Check if the seller owns this product
        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You can only update your own products");
        }

        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());

        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    public void deleteProduct(Long productId, String sellerEmail) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        // Check if the seller owns this product
        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new IllegalArgumentException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    public List<ProductDTO> getProductsBySeller(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new NoSuchElementException("Seller not found"));

        return productRepository.findBySeller(seller).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getProductsBySellerWithOrderStats(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new NoSuchElementException("Seller not found"));

        return productRepository.findBySeller(seller).stream()
                .map(product -> {
                    ProductDTO dto = convertToDTO(product);
                    // Temporarily set order count to 0 until we fix the query
                    dto.setOrderCount(0L);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTOWithOrderStats(Product product) {
        ProductDTO dto = convertToDTO(product);

        try {
            // Count orders for this product using efficient query
            long orderCount = orderRepository.countOrdersByProductId(product.getId());
            dto.setOrderCount(orderCount);
        } catch (Exception e) {
            // If counting fails, set to 0 and log error
            dto.setOrderCount(0L);
            System.err.println("Error counting orders for product " + product.getId() + ": " + e.getMessage());
        }

        return dto;
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        dto.setSellerId(product.getSeller() != null ? product.getSeller().getId() : null);
        return dto;
    }
}

