package com.agrichain.service;

import com.agrichain.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Long id);
    List<Product> searchProducts(String query);
    List<Product> getProductsByFarmer(Long farmerId);
    List<Product> getProductsByCategory(Integer categoryId);
    Product createProduct(Long farmerId, Product product, Integer categoryId);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}
