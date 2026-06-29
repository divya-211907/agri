package com.agrichain.controller;

import com.agrichain.entity.ProductCategory;
import com.agrichain.repository.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
