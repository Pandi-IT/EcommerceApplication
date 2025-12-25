package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ProductDTO;
import com.example.ecommerce.security.JwtUtil;
import com.example.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('SELLER')")
    public ProductDTO addProduct(@RequestBody ProductDTO productDTO, Authentication authentication) {
        String sellerEmail = authentication.getName();
        return productService.addProduct(productDTO, sellerEmail);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO, Authentication authentication) {
        String sellerEmail = authentication.getName();
        return productService.updateProduct(id, productDTO, sellerEmail);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SELLER')")
    public String deleteProduct(@PathVariable Long id, Authentication authentication) {
        String sellerEmail = authentication.getName();
        productService.deleteProduct(id, sellerEmail);
        return "Product deleted successfully";
    }

    @GetMapping("/my-products")
    @PreAuthorize("hasAuthority('SELLER')")
    public List<ProductDTO> getMyProducts(Authentication authentication) {
        String sellerEmail = authentication.getName();
        return productService.getProductsBySellerWithOrderStats(sellerEmail);
    }
}

