import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bell, LogOut, Sun, Moon, Globe } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local preferences for theme
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:8080/api/notifications')
        .then(res => {
          const unread = res.data.filter(n => !n.read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [user]);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="header-navbar d-flex align-items-center justify-content-between px-4 shadow-sm">
      <div className="d-flex align-items-center gap-2">
        <h5 className="m-0 fw-bold text-success">
          {t('appName')} <span className="text-secondary fs-6 fw-normal">| By-Product System</span>
        </h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          className="btn btn-sm btn-outline-success d-flex align-items-center gap-2"
          id="btn-lang-toggle"
        >
          <Globe size={16} />
          <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-link text-secondary p-1"
          id="btn-theme-toggle"
        >
          {darkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => navigate('/notifications')}
          className="btn btn-sm btn-link text-secondary position-relative p-1"
          id="btn-notification-bell"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
              {unreadCount}
            </span>
          )}
        </button>

        <span className="text-muted d-none d-md-inline" style={{ fontSize: '14px' }}>
          {user.email}
        </span>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 ms-2"
          id="btn-logout"
        >
          <LogOut size={16} />
          <span className="d-none d-md-inline">{t('logout')}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
