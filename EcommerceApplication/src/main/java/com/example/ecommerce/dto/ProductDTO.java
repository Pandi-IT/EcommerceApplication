package com.example.ecommerce.dto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private Long sellerId;
    private Long orderCount;
}
