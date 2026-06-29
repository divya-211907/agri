import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, ShieldAlert, BadgeCheck, Cpu, ArrowRight } from 'lucide-react';

const ExportOpportunities = () => {
  const { lang, t } = useLanguage();
  const [opportunities, setOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchOpportunities();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchAiAdvice();
    }
  }, [selectedCategory, lang]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/export-opportunities');
      setOpportunities(res.data);
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
        setSelectedCategory(res.data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAiAdvice = async () => {
    setLoadingAi(true);
    setAiAdvice(null);
    try {
      const res = await axios.get(`http://localhost:8080/api/ai/export-advice/${selectedCategory}?lang=${lang}`);
      setAiAdvice(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
        <Globe />
        {t('exportTitle')}
      </h2>

      {/* AI Advisor Selector Box */}
      <div className="card glass-card p-4 border-0 mb-4 bg-success bg-opacity-10">
        <div className="row align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <h5 className="fw-bold text-success mb-1 d-flex align-items-center gap-2">
              <Cpu />
              {lang === 'en' ? 'Amazon Bedrock AI Export Advisor' : 'அமேசான் பெட்ராக் AI ஏற்றுமதி ஆலோசகர்'}
            </h5>
            <p className="text-muted small m-0">Select your by-product category to evaluate readiness requirements, quality barriers, and target prices for Singapore and Malaysia.</p>
          </div>
          <div className="col-md-4">
            <select
              className="form-select border-success"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="select-export-category"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameTa}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Recommendations Panel */}
        {loadingAi && (
          <div className="text-center py-4">
            <div className="spinner-border text-success spinner-border-sm" role="status" />
          </div>
        )}

        {aiAdvice && (
          <div className="mt-4 p-3 bg-white bg-opacity-70 rounded border border-success border-opacity-10">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom border-secondary border-opacity-10">
              <div>
                <span className="text-muted small">Category Evaluated:</span>
                <h6 className="fw-bold text-success mb-0">{aiAdvice.category}</h6>
              </div>
              <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                <span className="fw-bold text-muted small">{t('readinessScore')}:</span>
                <span className="badge bg-success py-2 px-3 fs-6 ledger-block-glow">{aiAdvice.exportReadinessScore}%</span>
              </div>
            </div>

            <h6 className="fw-bold text-success mb-2 d-flex align-items-center gap-2">
              <BadgeCheck size={18} />
              {t('recommendation')}
            </h6>
            <p className="lh-lg mb-3" style={{ fontSize: '14.5px' }}>{aiAdvice.readinessRecommendation}</p>

            <div className="row g-3">
              {aiAdvice.destinations?.map((dest, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="p-3 bg-light rounded border h-100">
                    <span className="badge bg-success mb-2">{dest.countryName}</span>
                    <p className="m-0 small"><strong>Target Price:</strong> ₹{dest.targetPrice}/kg</p>
                    <p className="m-0 small"><strong>Demand Level:</strong> <span className="text-success fw-bold">{dest.demandLevel}</span></p>
                    <p className="m-0 small mt-2 text-muted"><strong>Required Certs:</strong> {dest.certificatesRequired}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiries Leads Table */}
      <h5 className="fw-bold text-success mb-3">{lang === 'en' ? 'Active Global Export Inquiries' : 'செயலில் உள்ள உலகளாவிய ஏற்றுமதி தேவைகள்'}</h5>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="card glass-card text-center py-5 border-0 shadow-sm">
          <p className="text-muted m-0">No export opportunities posted at this moment.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {opportunities.map((opp) => (
            <div key={opp.id} className="card glass-card p-4 border-0 shadow-sm">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-2 gap-2">
                <div>
                  <h5 className="fw-bold text-success mb-1">
                    {lang === 'en' ? opp.titleEn : opp.titleTa}
                  </h5>
                  <span className="text-muted small d-flex align-items-center gap-1">
                    <Globe size={14} />
                    {lang === 'en' ? 'Destination:' : 'ஏற்றுமதி நாடு:'} <strong>{lang === 'en' ? opp.destinationCountry : opp.destinationCountryTa}</strong>
                  </span>
                </div>
                <div className="text-md-end">
                  <span className="badge bg-success bg-opacity-10 text-success p-2">Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="row g-3 mt-2 border-top border-secondary border-opacity-10 pt-3">
                <div className="col-md-4">
                  <span className="text-muted small d-block">{t('qtyRequired')}</span>
                  <h6 className="fw-bold mb-0">{opp.quantityRequiredKg?.toLocaleString()} kg</h6>
                </div>
                <div className="col-md-4">
                  <span className="text-muted small d-block">{t('targetPrice')}</span>
                  <h6 className="fw-bold mb-0 text-success">₹{opp.targetPricePerKg}/kg</h6>
                </div>
                <div className="col-md-4">
                  <span className="text-muted small d-block">Contract Value</span>
                  <h6 className="fw-bold mb-0 text-primary">₹{(opp.quantityRequiredKg * opp.targetPricePerKg).toLocaleString()}</h6>
                </div>
              </div>

              <div className="mt-3 p-3 bg-light rounded" style={{ fontSize: '13.5px' }}>
                <strong className="text-success d-block mb-1">{t('requirements')}:</strong>
                <span className="text-muted">{lang === 'en' ? opp.requirementsEn : opp.requirementsTa}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportOpportunities;
