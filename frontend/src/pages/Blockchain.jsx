import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Database, ShieldCheck, AlertTriangle, Cpu, Clock, RefreshCw } from 'lucide-react';

const Blockchain = () => {
  const { lang, t } = useLanguage();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationResult, setVerificationResult] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/ledger');
      setBlocks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLedger = async () => {
    setChecking(true);
    setVerificationResult(null);
    try {
      const res = await axios.get('http://localhost:8080/api/ledger/verify');
      setVerificationResult(res.data);
    } catch (err) {
      alert("Ledger validation query failed.");
    } finally {
      setChecking(false);
    }
  };

  const formatPayload = (payload) => {
    try {
      const obj = JSON.parse(payload);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return payload;
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h2 className="fw-bold text-success m-0">{t('ledgerTitle')}</h2>
        <button
          onClick={handleVerifyLedger}
          className="btn btn-success d-flex align-items-center gap-2"
          disabled={checking}
          id="btn-verify-ledger"
        >
          {checking ? <RefreshCw size={18} className="spinner-border spinner-border-sm border-0" /> : <ShieldCheck size={18} />}
          <span>{checking ? t('loading') : t('verifyChainBtn')}</span>
        </button>
      </div>
      <p className="text-muted mb-4">{t('ledgerSub')}</p>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div className={`alert ${verificationResult.valid ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-3 p-3 mb-4 shadow-sm border-0`}>
          {verificationResult.valid ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
          <div>
            <h6 className="fw-bold m-0">
              {verificationResult.valid ? t('integritySecure') : t('integrityCompromised')} - {verificationResult.status}
            </h6>
            <small>{verificationResult.message}</small>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {blocks.map((block) => {
            const isGenesis = block.blockIndex === 0;
            return (
              <div
                key={block.id}
                className={`card glass-card border-0 shadow-sm overflow-hidden ${
                  verificationResult && verificationResult.valid ? 'border-start border-success border-4' : ''
                }`}
              >
                <div className="card-header bg-success bg-opacity-10 py-3 border-0 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <Database className="text-success" size={20} />
                    <h6 className="fw-bold text-success m-0">
                      {t('blockIndex')}: #{block.blockIndex} {isGenesis && "(Genesis)"}
                    </h6>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Clock size={14} />
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <span className="text-muted small d-block mb-1 fw-semibold">{t('blockHash')} (SHA-256)</span>
                      <code className="text-primary break-all" style={{ fontSize: '13px' }}>{block.blockHash}</code>
                    </div>
                    <div className="col-12 border-top border-secondary border-opacity-10 pt-2">
                      <span className="text-muted small d-block mb-1 fw-semibold">{t('prevHash')}</span>
                      <code className="text-secondary break-all" style={{ fontSize: '13px' }}>{block.previousHash}</code>
                    </div>
                    <div className="col-12 border-top border-secondary border-opacity-10 pt-2">
                      <span className="text-muted small d-block mb-1 fw-semibold">{t('payload')}</span>
                      <pre className="p-3 bg-light bg-opacity-70 rounded m-0 overflow-auto border" style={{ fontSize: '12.5px', maxHeight: '180px' }}>
                        {formatPayload(block.dataPayload)}
                      </pre>
                    </div>
                    <div className="col-12 border-top border-secondary border-opacity-10 pt-2">
                      <span className="text-muted small d-block mb-1 fw-semibold">{t('validator')}</span>
                      <span className="badge bg-success bg-opacity-10 text-success p-2 font-monospace" style={{ fontSize: '11px' }}>
                        {block.validatorSignature}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Blockchain;
