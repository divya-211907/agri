package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "product_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name_en", unique = true, nullable = false, length = 50)
    private String nameEn;

    @Column(name = "name_ta", unique = true, nullable = false, length = 100)
    private String nameTa;

    @Column(unique = true, nullable = false, length = 20)
    private String code;
}
