import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Database,
  Globe,
  Bell,
  MessageSquare,
  User,
  Package
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const role = user.role;

  // Custom sidebar links based on authenticated roles
  const getLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
          { to: '/marketplace', label: t('marketplace'), icon: <ShoppingCart size={20} /> },
          { to: '/analytics', label: t('analytics'), icon: <BarChart3 size={20} /> },
          { to: '/blockchain', label: t('blockchain'), icon: <Database size={20} /> },
          { to: '/notifications', label: t('notifications'), icon: <Bell size={20} /> },
          { to: '/profile', label: t('profile'), icon: <User size={20} /> }
        ];
      case 'FARMER':
        return [
          { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
          { to: '/products', label: t('products'), icon: <Package size={20} /> },
          { to: '/marketplace', label: t('marketplace'), icon: <ShoppingCart size={20} /> },
          { to: '/ai-chatbot', label: t('aiAssistant'), icon: <MessageSquare size={20} /> },
          { to: '/blockchain', label: t('blockchain'), icon: <Database size={20} /> },
          { to: '/export-opportunities', label: t('exportOpp'), icon: <Globe size={20} /> },
          { to: '/notifications', label: t('notifications'), icon: <Bell size={20} /> },
          { to: '/profile', label: t('profile'), icon: <User size={20} /> }
        ];
      case 'BUYER':
        return [
          { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
          { to: '/marketplace', label: t('marketplace'), icon: <ShoppingCart size={20} /> },
          { to: '/blockchain', label: t('blockchain'), icon: <Database size={20} /> },
          { to: '/ai-chatbot', label: t('aiAssistant'), icon: <MessageSquare size={20} /> },
          { to: '/notifications', label: t('notifications'), icon: <Bell size={20} /> },
          { to: '/profile', label: t('profile'), icon: <User size={20} /> }
        ];
      case 'PROCESSOR':
        return [
          { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
          { to: '/marketplace', label: t('marketplace'), icon: <ShoppingCart size={20} /> },
          { to: '/blockchain', label: t('blockchain'), icon: <Database size={20} /> },
          { to: '/ai-chatbot', label: t('aiAssistant'), icon: <MessageSquare size={20} /> },
          { to: '/notifications', label: t('notifications'), icon: <Bell size={20} /> },
          { to: '/profile', label: t('profile'), icon: <User size={20} /> }
        ];
      case 'EXPORTER':
        return [
          { to: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
          { to: '/export-opportunities', label: t('exportOpp'), icon: <Globe size={20} /> },
          { to: '/marketplace', label: t('marketplace'), icon: <ShoppingCart size={20} /> },
          { to: '/blockchain', label: t('blockchain'), icon: <Database size={20} /> },
          { to: '/ai-chatbot', label: t('aiAssistant'), icon: <MessageSquare size={20} /> },
          { to: '/notifications', label: t('notifications'), icon: <Bell size={20} /> },
          { to: '/profile', label: t('profile'), icon: <User size={20} /> }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 shadow">
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-3">
        <span className="fs-4 fw-bold d-flex align-items-center gap-2">
          🌱 AgriChain AI
        </span>
      </div>
      <hr className="bg-light opacity-25 mx-3" />
      <ul className="nav nav-pills flex-column mb-auto">
        {getLinks().map((link) => (
          <li key={link.to} className="nav-item">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-3 py-2 text-white-50 fs-7 border-top border-secondary text-center">
        Role: <span className="text-white fw-semibold">{t(role.toLowerCase())}</span>
      </div>
    </div>
  );
};

export default Sidebar;
