package com.agrichain.service.impl;

import com.agrichain.entity.Farmer;
import com.agrichain.entity.Product;
import com.agrichain.entity.ProductCategory;
import com.agrichain.exception.ResourceNotFoundException;
import com.agrichain.repository.FarmerRepository;
import com.agrichain.repository.ProductCategoryRepository;
import com.agrichain.repository.ProductRepository;
import com.agrichain.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public List<Product> searchProducts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }
        return productRepository.searchProducts(query);
    }

    @Override
    public List<Product> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerUserId(farmerId);
    }

    @Override
    public List<Product> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product createProduct(Long farmerId, Product product, Integer categoryId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + farmerId));
        ProductCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        product.setFarmer(farmer);
        product.setCategory(category);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setNameEn(productDetails.getNameEn());
        product.setNameTa(productDetails.getNameTa());
        product.setDescriptionEn(productDetails.getDescriptionEn());
        product.setDescriptionTa(productDetails.getDescriptionTa());
        product.setPricePerKg(productDetails.getPricePerKg());
        product.setStockKg(productDetails.getStockKg());
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
