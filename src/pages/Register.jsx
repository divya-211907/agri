import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Register = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Basic Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');

  // Profile Toggled Form Fields
  const [formData, setFormData] = useState({
    farmName: '',
    tamilFarmName: '',
    sizeAcres: '',
    bio: '',
    tamilBio: '',
    companyName: '',
    tamilCompanyName: '',
    taxId: '',
    facilityName: '',
    tamilFacilityName: '',
    capacityTonsDay: '',
    licenseNumber: '',
    exportDestinations: '',
    tamilExportDestinations: '',
    location: '',
    tamilLocation: '',
    state: 'Tamil Nadu',
    tamilState: 'தமிழ்நாடு',
    phone: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload = {
        email,
        password,
        role,
        ...formData
      };

      // Clean payload numbers
      if (payload.sizeAcres) payload.sizeAcres = parseFloat(payload.sizeAcres);
      if (payload.capacityTonsDay) payload.capacityTonsDay = parseFloat(payload.capacityTonsDay);

      await register(payload);
      setSuccess("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card glass-card p-4 shadow border-0" style={{ maxWidth: '650px', width: '100%' }}>
        <div className="text-center mb-4">
          <span className="fs-1">🌱</span>
          <h3 className="fw-bold mt-2 text-success">{t('appName')}</h3>
          <p className="text-muted">{t('registerTitle')}</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* General credentials section */}
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('emailLabel')}</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('passwordLabel')}</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('roleSelectLabel')}</label>
              <select
                className="form-select text-uppercase"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="FARMER">{t('farmer')}</option>
                <option value="BUYER">{t('buyer')}</option>
                <option value="PROCESSOR">{t('processor')}</option>
                <option value="EXPORTER">{t('exporter')}</option>
              </select>
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('phone')}</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Regional Localization Fields */}
          <div className="row mb-3 border-top pt-3 border-secondary border-opacity-10">
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('location')} (English)</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Coimbatore"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('location')} (Tamil)</label>
              <input
                type="text"
                name="tamilLocation"
                className="form-control"
                placeholder="எ.கா. கோயம்புத்தூர்"
                value={formData.tamilLocation}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'FARMER' && (
            <div className="row mb-3 border-top pt-3 border-secondary border-opacity-10">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('farmName')} (English)</label>
                <input
                  type="text"
                  name="farmName"
                  className="form-control"
                  value={formData.farmName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('farmName')} (Tamil)</label>
                <input
                  type="text"
                  name="tamilFarmName"
                  className="form-control"
                  value={formData.tamilFarmName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('sizeAcres')}</label>
                <input
                  type="number"
                  name="sizeAcres"
                  className="form-control"
                  value={formData.sizeAcres}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-12 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('bio')} (English)</label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows="2"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-12 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('bio')} (Tamil)</label>
                <textarea
                  name="tamilBio"
                  className="form-control"
                  rows="2"
                  value={formData.tamilBio}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {role === 'BUYER' && (
            <div className="row mb-3 border-top pt-3 border-secondary border-opacity-10">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('companyName')} (English)</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-control"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('companyName')} (Tamil)</label>
                <input
                  type="text"
                  name="tamilCompanyName"
                  className="form-control"
                  value={formData.tamilCompanyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('taxId')}</label>
                <input
                  type="text"
                  name="taxId"
                  className="form-control"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {role === 'PROCESSOR' && (
            <div className="row mb-3 border-top pt-3 border-secondary border-opacity-10">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('facilityName')} (English)</label>
                <input
                  type="text"
                  name="facilityName"
                  className="form-control"
                  value={formData.facilityName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('facilityName')} (Tamil)</label>
                <input
                  type="text"
                  name="tamilFacilityName"
                  className="form-control"
                  value={formData.tamilFacilityName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('capacity')}</label>
                <input
                  type="number"
                  name="capacityTonsDay"
                  className="form-control"
                  value={formData.capacityTonsDay}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {role === 'EXPORTER' && (
            <div className="row mb-3 border-top pt-3 border-secondary border-opacity-10">
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('licenseNumber')}</label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="form-control"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('exportDestinations')} (English)</label>
                <input
                  type="text"
                  name="exportDestinations"
                  className="form-control"
                  placeholder="Singapore, Malaysia, UAE"
                  value={formData.exportDestinations}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-12 mb-2">
                <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>{t('exportDestinations')} (Tamil)</label>
                <input
                  type="text"
                  name="tamilExportDestinations"
                  className="form-control"
                  placeholder="சிங்கப்பூர், மலேசியா"
                  value={formData.tamilExportDestinations}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 mt-4 mb-3"
            disabled={submitting}
          >
            {submitting ? t('loading') : t('registerBtn')}
          </button>
        </form>

        <div className="text-center mt-2" style={{ fontSize: '14px' }}>
          <span className="text-muted">{t('alreadyHaveAccount')} </span>
          <Link to="/login" className="text-success fw-bold text-decoration-none">
            {t('loginBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
