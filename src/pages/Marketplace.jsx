import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Search, ShoppingCart, Info, Check } from 'lucide-react';

const Marketplace = () => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Checkout modal states
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(100); // default 100kg
  const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [orderError, setOrderError] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/products';
      if (searchQuery.trim()) {
        url += `?search=${searchQuery}`;
      } else if (selectedCategory !== 'ALL') {
        url += `/category/${selectedCategory}`;
      }
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openCheckout = (product) => {
    setCheckoutProduct(product);
    setCheckoutQuantity(100);
    setOrderSuccess('');
    setOrderError('');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setOrdering(true);
    setOrderError('');
    setOrderSuccess('');

    try {
      const payload = {
        items: [
          {
            productId: checkoutProduct.id,
            quantity: parseFloat(checkoutQuantity)
          }
        ],
        paymentMethod: paymentMethod
      };

      const res = await axios.post('http://localhost:8080/api/orders', payload);
      setOrderSuccess(`Order #${res.data.id} placed successfully!`);
      setTimeout(() => {
        // Refresh products
        fetchProducts();
        setCheckoutProduct(null);
      }, 2000);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-3">{t('marketplace')}</h2>

      {/* Search & Category Filter Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="input-marketplace-search"
            />
            <button type="submit" className="btn btn-success d-flex align-items-center gap-2">
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-md-end gap-2">
          <span className="text-muted small fw-bold">Filter Category:</span>
          <select
            className="form-select w-auto"
            value={selectedCategory}
            onChange={(e) => {
              setSearchQuery('');
              setSelectedCategory(e.target.value);
            }}
            id="select-category-filter"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === 'en' ? c.nameEn : c.nameTa}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : products.length === 0 ? (
        <div className="card glass-card text-center py-5 border-0">
          <p className="text-muted m-0">No oilseed by-products match your criteria.</p>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card glass-card h-100 border-0 overflow-hidden d-flex flex-column">
                <div style={{ height: '180px', backgroundColor: '#e8f0ec', position: 'relative' }}>
                  {p.stockKg > 0 ? (
                    <span className="badge bg-success position-absolute top-2 start-2 m-2">In Stock</span>
                  ) : (
                    <span className="badge bg-danger position-absolute top-2 start-2 m-2">Out of Stock</span>
                  )}
                  <div className="d-flex align-items-center justify-content-center h-100 fs-1 text-success opacity-75">
                    🌿
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <span className="badge bg-success bg-opacity-10 text-success w-auto align-self-start mb-2" style={{ fontSize: '11px' }}>
                    {lang === 'en' ? p.category.nameEn : p.category.nameTa}
                  </span>
                  <h5 className="card-title fw-bold mb-2">
                    {lang === 'en' ? p.nameEn : p.nameTa}
                  </h5>
                  <p className="card-text text-muted flex-grow-1" style={{ fontSize: '14px', height: '60px', overflow: 'hidden' }}>
                    {lang === 'en' ? p.descriptionEn : p.descriptionTa}
                  </p>

                  <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top border-secondary border-opacity-10">
                    <div>
                      <span className="text-muted small block">{t('pricePerKg')}</span>
                      <h5 className="fw-bold text-success mb-0">₹{p.pricePerKg}</h5>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small block">{t('availableStock')}</span>
                      <h6 className="fw-semibold mb-0">{p.stockKg?.toLocaleString()} kg</h6>
                    </div>
                  </div>

                  {user && user.role !== 'FARMER' && user.role !== 'ADMIN' && p.stockKg > 0 && (
                    <button
                      onClick={() => openCheckout(p)}
                      className="btn btn-primary-custom w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                      id={`btn-buy-product-${p.id}`}
                    >
                      <ShoppingCart size={18} />
                      <span>{lang === 'en' ? 'Buy Now' : 'வாங்கு'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card border-0 p-3 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-success">{t('purchaseTitle')}</h5>
                <button type="button" className="btn-close" onClick={() => setCheckoutProduct(null)} />
              </div>
              <div className="modal-body border-0">
                {orderSuccess && <div className="alert alert-success">{orderSuccess}</div>}
                {orderError && <div className="alert alert-danger">{orderError}</div>}

                <div className="mb-3 p-3 bg-light bg-opacity-50 rounded">
                  <h6 className="fw-bold">{lang === 'en' ? checkoutProduct.nameEn : checkoutProduct.nameTa}</h6>
                  <p className="text-muted small m-0">Listed by: {checkoutProduct.farmer?.farmName}</p>
                  <p className="text-muted small m-0">Unit Price: ₹{checkoutProduct.pricePerKg}/kg</p>
                </div>

                <form onSubmit={handleCheckout}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">{t('quantityRequired')}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={checkoutQuantity}
                      onChange={(e) => setCheckoutQuantity(e.target.value)}
                      max={checkoutProduct.stockKg}
                      min="1"
                      required
                    />
                    <small className="text-muted">Maximum available: {checkoutProduct.stockKg} kg</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">{t('paymentMethod')}</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="CASH_ON_DELIVERY">{t('cod')}</option>
                      <option value="BANK_TRANSFER">{t('online')}</option>
                    </select>
                  </div>

                  <div className="p-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-bold">{t('totalAmount')}:</span>
                    <h4 className="fw-bold text-success mb-0">₹{(checkoutQuantity * checkoutProduct.pricePerKg).toLocaleString()}</h4>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setCheckoutProduct(null)}>
                      {t('cancel')}
                    </button>
                    <button type="submit" className="btn btn-success w-50 py-2" disabled={ordering}>
                      {ordering ? t('loading') : t('checkoutBtn')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
