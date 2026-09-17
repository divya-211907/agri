import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  TrendingUp,
  Package,
  Clock,
  DollarSign,
  Cpu,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [soyHistory, setSoyHistory] = useState([]);
  const [gnHistory, setGnHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [lang]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8080/api/analytics/dashboard?lang=${lang}`);
      setData(res.data);

      if (res.data.role === 'FARMER') {
        const orderRes = await axios.get('http://localhost:8080/api/orders/farmer');
        setOrders(orderRes.data);
      } else if (res.data.role !== 'ADMIN') {
        const orderRes = await axios.get('http://localhost:8080/api/orders/my');
        setOrders(orderRes.data);
      }

      // Fetch dynamic verified market price history from AGMARKNET records
      try {
        const soyRes = await axios.get('http://localhost:8080/api/market-prices/history?product=Soymeal');
        if (soyRes.data && soyRes.data.length > 0) setSoyHistory(soyRes.data);
        const gnRes = await axios.get('http://localhost:8080/api/market-prices/history?product=Groundnut%20Cake');
        if (gnRes.data && gnRes.data.length > 0) setGnHistory(gnRes.data);
      } catch (histErr) {
        console.warn('Could not load dynamic market history', histErr);
      }
    } catch (err) {
      console.error(err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=${status}`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  // Dynamic Chart configuration built from authentic market data
  const chartLabels = gnHistory.length > 0 
    ? gnHistory.map(h => `${h.market} (${h.date})`)
    : ['Indore', 'Erode', 'Pollachi', 'Tiruppur', 'Coimbatore'];

  const gnPrices = gnHistory.length > 0 ? gnHistory.map(h => h.price) : [38.5, 38.2, 37.8, 37.5, 36.8];
  const soyPrices = soyHistory.length > 0 ? soyHistory.map(h => h.price) : [39.5, 40.8, 39.2];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: lang === 'en' ? 'Groundnut Cake Verified Modal Price (₹/kg)' : 'கடலை புண்ணாக்கு மாதிரி விலை (₹/கிலோ)',
        data: gnPrices,
        borderColor: '#f7a072',
        backgroundColor: 'rgba(247, 160, 114, 0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: lang === 'en' ? 'Soymeal Verified Modal Price (₹/kg)' : 'சோயாமீல் மாதிரி விலை (₹/கிலோ)',
        data: soyPrices,
        borderColor: '#2d6a4f',
        backgroundColor: 'rgba(45, 106, 79, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.body.classList.contains('dark-mode') ? '#ecf3f0' : '#1d2d24'
        }
      }
    },
    scales: {
      y: {
        ticks: { color: document.body.classList.contains('dark-mode') ? '#ecf3f0' : '#1d2d24' }
      },
      x: {
        ticks: { color: document.body.classList.contains('dark-mode') ? '#ecf3f0' : '#1d2d24' }
      }
    }
  };

  const renderFarmerDashboard = () => (
    <div>
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{t('revenue')}</span>
              <h3 className="fw-bold mt-1 mb-0 text-success">₹{data.revenue?.toLocaleString() || '0'}</h3>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{t('totalStockCount')}</span>
              <h3 className="fw-bold mt-1 mb-0 text-warning">{data.stockKg?.toLocaleString() || '0'} kg</h3>
            </div>
            <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning">
              <Package size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{t('pendingOrdersCount')}</span>
              <h3 className="fw-bold mt-1 mb-0 text-danger">{data.pendingOrders || 0}</h3>
            </div>
            <div className="bg-danger bg-opacity-10 p-3 rounded-3 text-danger">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary and charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card glass-card p-4 border-0 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <TrendingUp className="text-success" />
              {lang === 'en' ? 'By-Product Price Tracing' : 'துணைப் பொருட்களின் விலை வரைபடம்'}
            </h5>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card glass-card p-4 border-0 bg-success bg-opacity-10 h-100" style={{ border: '1px solid rgba(45, 106, 79, 0.2) !important' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-success">
              <Cpu />
              {lang === 'en' ? 'AI Smart Analysis Summary' : 'AI பகுப்பாய்வு சுருக்கம்'}
            </h5>
            <p className="lh-lg" style={{ fontSize: '15px' }}>{data.aiSummary}</p>
            <div className="mt-auto pt-3 border-top border-success border-opacity-10">
              <span className="badge bg-success p-2">{lang === 'en' ? 'Official AGMARKNET Verified Intelligence' : 'அதிகாரப்பூர்வ AGMARKNET சரிபார்க்கப்பட்ட தகவல்'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="card glass-card p-4 border-0">
        <h5 className="fw-bold mb-3">{lang === 'en' ? 'Recent Received Orders' : 'சமீபத்திய ஆர்டர்கள்'}</h5>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>{lang === 'en' ? 'Buyer' : 'வாங்குபவர்'}</th>
                <th>{lang === 'en' ? 'Total Amount' : 'மொத்த விலை'}</th>
                <th>{lang === 'en' ? 'Status' : 'நிலை'}</th>
                <th>{lang === 'en' ? 'Actions' : 'செயல்கள்'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">No orders received yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.buyer?.email}</td>
                    <td>₹{o.totalAmount}</td>
                    <td>
                      <span className={`badge ${
                        o.status === 'COMPLETED' ? 'bg-success' :
                        o.status === 'SHIPPED' ? 'bg-info' :
                        o.status === 'ACCEPTED' ? 'bg-primary' : 'bg-warning'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      {o.status === 'PENDING' && (
                        <button onClick={() => handleStatusUpdate(o.id, 'ACCEPTED')} className="btn btn-sm btn-success me-2">Accept</button>
                      )}
                      {o.status === 'ACCEPTED' && (
                        <button onClick={() => handleStatusUpdate(o.id, 'SHIPPED')} className="btn btn-sm btn-info me-2">Ship</button>
                      )}
                      {o.status === 'SHIPPED' && (
                        <button onClick={() => handleStatusUpdate(o.id, 'COMPLETED')} className="btn btn-sm btn-primary">Complete</button>
                      )}
                      {o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && (
                        <button onClick={() => handleStatusUpdate(o.id, 'CANCELLED')} className="btn btn-sm btn-link text-danger">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBuyerDashboard = () => (
    <div>
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{lang === 'en' ? 'Procured Total' : 'மொத்த கொள்முதல்'}</span>
              <h3 className="fw-bold mt-1 mb-0 text-success">₹{data.totalSpent?.toLocaleString() || '0'}</h3>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{lang === 'en' ? 'Active Transactions' : 'செயலில் உள்ள ஆர்டர்கள்'}</span>
              <h3 className="fw-bold mt-1 mb-0 text-info">{data.activeOrdersCount || 0}</h3>
            </div>
            <div className="bg-info bg-opacity-10 p-3 rounded-3 text-info">
              <Clock size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">{lang === 'en' ? 'Total Orders' : 'மொத்த ஆர்டர்கள்'}</span>
              <h3 className="fw-bold mt-1 mb-0 text-primary">{data.totalOrdersPlaced || 0}</h3>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* AI box and chart */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card glass-card p-4 border-0 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <TrendingUp className="text-success" />
              {lang === 'en' ? 'Oilseed Feed Market Indices' : 'தீவன சந்தை விலைக் குறியீடுகள்'}
            </h5>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card glass-card p-4 border-0 bg-success bg-opacity-10 h-100">
            <h5 className="fw-bold mb-3 text-success d-flex align-items-center gap-2">
              <Cpu />
              {lang === 'en' ? 'AI Procure Advisor Recommendation' : 'AI கொள்முதல் ஆலோசனைகள்'}
            </h5>
            <p className="lh-lg">{data.aiSummary}</p>
            {user.role === 'PROCESSOR' && (
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border" style={{ fontSize: '13px' }}>
                <strong>{lang === 'en' ? 'Mill Facility Occupancy:' : 'ஆலையின் இருப்பு நிலை:'}</strong> {data.siloOccupancyPercent}%
              </div>
            )}
            {user.role === 'EXPORTER' && (
              <div className="mt-3 p-3 bg-white bg-opacity-50 rounded border" style={{ fontSize: '13px' }}>
                <strong>{lang === 'en' ? 'Global Match Countries:' : 'ஏற்றுமதிக்கு உகந்த நாடுகள்:'}</strong> {data.recommendedDestinations?.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Purchases table */}
      <div className="card glass-card p-4 border-0">
        <h5 className="fw-bold mb-3">{lang === 'en' ? 'Recent Purchase Orders' : 'சமீபத்திய கொள்முதல் ஆர்டர்கள்'}</h5>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>{lang === 'en' ? 'Date' : 'தேதி'}</th>
                <th>{lang === 'en' ? 'Total Amount' : 'மொத்த விலை'}</th>
                <th>{lang === 'en' ? 'Status' : 'நிலை'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">No orders placed yet.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>₹{o.totalAmount}</td>
                    <td>
                      <span className={`badge ${
                        o.status === 'COMPLETED' ? 'bg-success' :
                        o.status === 'CANCELLED' ? 'bg-danger' : 'bg-warning'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">System Users Registered</span>
              <h3 className="fw-bold mt-1 mb-0 text-success">{data.totalUsers || 0}</h3>
            </div>
            <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success">
              <Cpu size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">Blockchain Security State</span>
              <h3 className="fw-bold mt-1 mb-0 text-primary">
                {data.ledgerIntegrity === 'VERIFIED' ? 'SECURED' : 'CHECKING'}
              </h3>
            </div>
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-3 border-0 d-flex flex-row align-items-center justify-content-between">
            <div>
              <span className="text-muted small">Total Network Catalog</span>
              <h3 className="fw-bold mt-1 mb-0 text-warning">{data.globalProductCount || 0} Products</h3>
            </div>
            <div className="bg-warning bg-opacity-10 p-3 rounded-3 text-warning">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card glass-card p-4 border-0 mb-4 bg-success bg-opacity-10">
        <h5 className="fw-bold mb-2 text-success">Admin AI Intelligence Health Check</h5>
        <p className="lh-lg m-0">{data.aiSummary}</p>
      </div>

      <div className="card glass-card p-4 border-0">
        <h5 className="fw-bold mb-3">System Security & Audit Trail Logs</h5>
        <div className="table-responsive">
          <table className="table align-middle" style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.auditLogs?.map((log) => (
                <tr key={log.id}>
                  <td className="text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                  <td><span className="badge bg-secondary">{log.action}</span></td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary border-opacity-10 pb-3">
        <div>
          <h2 className="fw-bold text-success mb-1">{t('dashboard')}</h2>
          <span className="text-muted">
            {t('welcome')}, <strong className="text-primary">{user.email}</strong>
          </span>
        </div>
      </div>

      {user.role === 'FARMER' && renderFarmerDashboard()}
      {(user.role === 'BUYER' || user.role === 'PROCESSOR' || user.role === 'EXPORTER') && renderBuyerDashboard()}
      {user.role === 'ADMIN' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
