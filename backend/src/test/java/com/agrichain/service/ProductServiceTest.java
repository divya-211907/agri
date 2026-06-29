package com.agrichain.service;

import com.agrichain.entity.Product;
import com.agrichain.repository.ProductRepository;
import com.agrichain.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    public void testGetAllProducts() {
        Product p1 = Product.builder().nameEn("Soymeal").pricePerKg(42.50).build();
        Product p2 = Product.builder().nameEn("Groundnut Cake").pricePerKg(38.00).build();
        
        when(productRepository.findAll()).thenReturn(Arrays.asList(p1, p2));

        List<Product> result = productService.getAllProducts();
        assertEquals(2, result.size());
        assertEquals("Soymeal", result.get(0).getNameEn());
        assertEquals(38.00, result.get(1).getPricePerKg());
        verify(productRepository, times(1)).findAll();
    }
}
