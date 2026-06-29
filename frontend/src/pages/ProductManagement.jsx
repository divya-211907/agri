import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Package, Edit2, Trash2, Cpu, Plus, Sparkles } from 'lucide-react';

const ProductManagement = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form fields
  const [nameEn, setNameEn] = useState('');
  const [nameTa, setNameTa] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [stockKg, setStockKg] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionTa, setDescriptionTa] = useState('');

  const [aiGenerating, setAiGenerating] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchFarmerProducts();
    fetchCategories();
  }, []);

  const fetchFarmerProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/products/farmer/${user.id}`);
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
      if (res.data.length > 0) {
        setCategoryId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateAiDescription = async () => {
    if (!nameEn) {
      alert("Please enter a product name in English first.");
      return;
    }
    setAiGenerating(true);
    try {
      const catObj = categories.find(c => c.id === parseInt(categoryId));
      const categoryName = catObj ? catObj.nameEn : "Oilseed Product";
      const res = await axios.post('http://localhost:8080/api/ai/generate-description', {
        productName: nameEn,
        categoryName: categoryName
      });
      setDescriptionEn(res.data.descriptionEn);
      setDescriptionTa(res.data.descriptionTa);
    } catch (err) {
      alert("AI Description Generation failed.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const payload = {
      nameEn,
      nameTa,
      pricePerKg: parseFloat(pricePerKg),
      stockKg: parseFloat(stockKg),
      descriptionEn,
      descriptionTa
    };

    try {
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, payload);
      } else {
        await axios.post(`http://localhost:8080/api/products?categoryId=${categoryId}`, payload);
      }
      resetForm();
      fetchFarmerProducts();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to save product.");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setNameEn(product.nameEn);
    setNameTa(product.nameTa);
    setCategoryId(product.category.id);
    setPricePerKg(product.pricePerKg);
    setStockKg(product.stockKg);
    setDescriptionEn(product.descriptionEn);
    setDescriptionTa(product.descriptionTa);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      fetchFarmerProducts();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNameEn('');
    setNameTa('');
    setPricePerKg('');
    setStockKg('');
    setDescriptionEn('');
    setDescriptionTa('');
    setShowAddForm(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-success m-0">{t('listedProducts')}</h2>
        {!showAddForm && (
          <button onClick={() => { resetForm(); setShowAddForm(true); }} className="btn btn-success d-flex align-items-center gap-2">
            <Plus size={18} />
            <span>{t('add')}</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="card glass-card p-4 border-0 mb-4 shadow">
          <h5 className="fw-bold text-success mb-3">
            {editingProduct ? (lang === 'en' ? 'Modify By-Product' : 'துணைப் பொருளை மாற்று') : t('add')}
          </h5>
          {submitError && <div className="alert alert-danger py-2">{submitError}</div>}

          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">{t('nameEn')}</label>
                <input type="text" className="form-control" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">{t('nameTa')}</label>
                <input type="text" className="form-control" value={nameTa} onChange={(e) => setNameTa(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">{t('category')}</label>
                <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={!!editingProduct}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameTa}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">{t('priceLabel')}</label>
                <input type="number" step="0.01" className="form-control" value={pricePerKg} onChange={(e) => setPricePerKg(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">{t('stockLabel')}</label>
                <input type="number" step="0.01" className="form-control" value={stockKg} onChange={(e) => setStockKg(e.target.value)} required />
              </div>
            </div>

            {/* AI Generator Integration */}
            <div className="mt-4 p-3 bg-success bg-opacity-5 rounded border border-success border-opacity-10 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div>
                <h6 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
                  <Sparkles size={16} />
                  {t('aiDescriptionGen')}
                </h6>
                <p className="text-muted small m-0">Generate optimized bilingual descriptions based on category and English name using Bedrock.</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAiDescription}
                className="btn btn-outline-success d-flex align-items-center gap-2"
                disabled={aiGenerating}
              >
                <Cpu size={16} />
                <span>{aiGenerating ? t('loading') : t('genBtn')}</span>
              </button>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">{t('description')} (English)</label>
                <textarea className="form-control" rows="3" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">{t('description')} (Tamil)</label>
                <textarea className="form-control" rows="3" value={descriptionTa} onChange={(e) => setDescriptionTa(e.target.value)} required />
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-success px-4">{t('submit')}</button>
              <button type="button" onClick={resetForm} className="btn btn-outline-secondary px-4">{t('cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Listed Products Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : products.length === 0 ? (
        <div className="card glass-card text-center py-5 border-0 shadow-sm">
          <p className="text-muted m-0">You have not listed any by-products yet.</p>
        </div>
      ) : (
        <div className="card glass-card p-4 border-0 shadow">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Product' : 'பொருள்'}</th>
                  <th>{t('category')}</th>
                  <th>{t('pricePerKg')}</th>
                  <th>{t('availableStock')}</th>
                  <th>{lang === 'en' ? 'Actions' : 'செயல்கள்'}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-3">🌱</span>
                        <div>
                          <h6 className="fw-bold mb-0">{lang === 'en' ? p.nameEn : p.nameTa}</h6>
                          <small className="text-muted">{lang === 'en' ? p.descriptionEn.substring(0, 50) + '...' : p.descriptionTa.substring(0, 50) + '...'}</small>
                        </div>
                      </div>
                    </td>
                    <td>{lang === 'en' ? p.category.nameEn : p.category.nameTa}</td>
                    <td>₹{p.pricePerKg}</td>
                    <td>{p.stockKg?.toLocaleString()} kg</td>
                    <td>
                      <button onClick={() => startEdit(p)} className="btn btn-sm btn-link text-primary me-2"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-link text-danger"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
