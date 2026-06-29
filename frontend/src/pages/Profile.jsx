import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Phone, MapPin, Briefcase, FileText, Settings } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  if (!user) return null;

  const profile = user.profile || {};

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
        <User />
        {t('profile')}
      </h2>

      <div className="row g-4">
        {/* Basic user info */}
        <div className="col-md-5">
          <div className="card glass-card p-4 border-0 shadow text-center">
            <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
              🌱
            </div>
            <h4 className="fw-bold text-success m-0">{user.email}</h4>
            <span className="badge bg-success mt-2 px-3 py-2 text-uppercase">{t(user.role.toLowerCase())}</span>
            <hr className="my-4 border-secondary border-opacity-10" />

            <div className="d-flex flex-column gap-3 text-start">
              <div className="d-flex align-items-center gap-3">
                <MapPin className="text-success" size={20} />
                <div>
                  <span className="text-muted small d-block">District / Location</span>
                  <strong className="text-dark">{lang === 'en' ? profile.location || 'Salem' : profile.tamilLocation || 'சேலம்'}</strong>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <GlobeIcon className="text-success" size={20} />
                <div>
                  <span className="text-muted small d-block">State</span>
                  <strong className="text-dark">{lang === 'en' ? profile.state || 'Tamil Nadu' : profile.tamilState || 'தமிழ்நாடு'}</strong>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Phone className="text-success" size={20} />
                <div>
                  <span className="text-muted small d-block">Phone Contact</span>
                  <strong className="text-dark">{profile.phone || profile.contactNumber || '+91 9876543210'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role profiles details */}
        <div className="col-md-7">
          <div className="card glass-card p-4 border-0 shadow h-100">
            <h5 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
              <Settings />
              {lang === 'en' ? 'Profile Details & Metadata' : 'சுயவிவர விவரங்கள்'}
            </h5>

            {user.role === 'FARMER' && (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('farmName')}</span>
                  <h6 className="fw-bold text-dark mb-0">{lang === 'en' ? profile.farmName : profile.tamilFarmName}</h6>
                </div>
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('sizeAcres')}</span>
                  <h6 className="fw-bold text-dark mb-0">{profile.sizeAcres} Acres</h6>
                </div>
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('bio')}</span>
                  <p className="text-dark mb-0 mt-1 small" style={{ lineHeight: '1.6' }}>
                    {lang === 'en' ? profile.bio || 'Organic Soybean agriculturalist.' : profile.tamilBio || 'இயற்கை சோயாபீன் விவசாயி.'}
                  </p>
                </div>
              </div>
            )}

            {user.role === 'BUYER' && (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('companyName')}</span>
                  <h6 className="fw-bold text-dark mb-0">{lang === 'en' ? profile.companyName : profile.tamilCompanyName}</h6>
                </div>
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('taxId')}</span>
                  <h6 className="fw-bold text-dark mb-0">{profile.taxId || 'N/A'}</h6>
                </div>
              </div>
            )}

            {user.role === 'PROCESSOR' && (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('facilityName')}</span>
                  <h6 className="fw-bold text-dark mb-0">{lang === 'en' ? profile.facilityName : profile.tamilFacilityName}</h6>
                </div>
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('capacity')}</span>
                  <h6 className="fw-bold text-dark mb-0">{profile.capacityTonsDay} Tons / Day</h6>
                </div>
              </div>
            )}

            {user.role === 'EXPORTER' && (
              <div className="d-flex flex-column gap-3">
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('licenseNumber')}</span>
                  <h6 className="fw-bold text-dark mb-0">{profile.licenseNumber}</h6>
                </div>
                <div className="p-3 bg-light rounded border">
                  <span className="text-muted small d-block">{t('exportDestinations')}</span>
                  <h6 className="fw-bold text-dark mb-0">{lang === 'en' ? profile.exportDestinations : profile.tamilExportDestinations}</h6>
                </div>
              </div>
            )}

            {user.role === 'ADMIN' && (
              <div className="text-center py-5">
                <Cpu size={48} className="text-muted mb-3" />
                <h6 className="text-muted">Administrator controls are loaded on the system console.</h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple inline Globe component to avoid name conflict
const GlobeIcon = ({ size, className }) => {
  return <Briefcase size={size} className={className} />;
};

export default Profile;
