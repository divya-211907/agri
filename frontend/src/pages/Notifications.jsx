import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Bell, Mail, MailOpen, Calendar } from 'lucide-react';

const Notifications = () => {
  const { lang, t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${id}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4 d-flex align-items-center gap-2">
        <Bell />
        {t('notifications')}
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card glass-card text-center py-5 border-0 shadow-sm">
          <p className="text-muted m-0">No notifications received.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && handleMarkAsRead(n.id)}
              className={`card glass-card p-3 border-0 shadow-sm transition-all ${
                !n.read ? 'bg-success bg-opacity-5 cursor-pointer border-start border-success border-3' : ''
              }`}
              style={{ cursor: !n.read ? 'pointer' : 'default' }}
            >
              <div className="d-flex align-items-start gap-3">
                <div className={`p-2 rounded-circle ${!n.read ? 'bg-success text-white' : 'bg-light text-muted'}`}>
                  {!n.read ? <Mail size={18} /> : <MailOpen size={18} />}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className={`fw-semibold ${!n.read ? 'text-success' : 'text-muted'}`} style={{ fontSize: '15px' }}>
                      {lang === 'en' ? n.messageEn : n.messageTa}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-1 text-muted small mt-2">
                    <Calendar size={12} />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
