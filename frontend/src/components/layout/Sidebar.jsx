import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '../icons/Icon';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ onCloseDrawer, isCollapsed = false, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItemClick = () => {
    if (onCloseDrawer) {
      onCloseDrawer();
    }
  };

  const handleMobileLogout = async () => {
    await logout();
    navItemClick();
    navigate('/signin', { replace: true });
  };

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Home', path: '/app', icon: 'home', end: true },
        { label: 'Find Jobs', path: '/app/jobs', icon: 'briefcase' },
        { label: 'Saved Jobs', path: '/app/saved-jobs', icon: 'bookmark' },
        { label: 'Applied Jobs', path: '/app/applied-jobs', icon: 'check-circle' },
        { label: 'Applications', path: '/app/applications', icon: 'file' },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { label: 'Career Resources', path: '/app/career-resources', icon: 'globe' },
        { label: 'Resume Builder', path: '/app/resume-builder', icon: 'resume' },
        { label: 'Resume Analyzer', path: '/app/resume-analyzer', icon: 'sparkles' },
        { label: 'Companies', path: '/app/companies', icon: 'building' },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        ...(onCloseDrawer ? [
          { label: 'Messages', path: '/app/messages', icon: 'message', mobileOnly: true },
          { label: 'Notifications', path: '/app/notifications', icon: 'bell', mobileOnly: true },
        ] : []),
        { label: 'Job Alerts', path: '/app/job-alerts', icon: 'clock' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', path: '/app/profile', icon: 'user' },
        { label: 'Settings', path: '/app/settings', icon: 'settings' },
        ...(onCloseDrawer ? [
          { label: 'Sign Out', path: '/signin', icon: 'logout', mobileOnly: true, action: 'logout' },
        ] : []),
      ],
    },
  ];

  return (
    <aside className={`app-sidebar ${onCloseDrawer ? 'is-drawer' : ''} ${isCollapsed ? 'is-collapsed' : ''}`} aria-label="Main Navigation">
      {/* Brand Header */}
      <div className="app-sidebar-brand">
        <NavLink
          to="/app/profile"
          className="app-sidebar-profile-link"
          onClick={navItemClick}
          aria-label="Profile"
          title={user?.name || 'Profile'}
        >
          {user?.avatar ? (
            <img className="app-sidebar-profile-avatar" src={user.avatar} alt="" />
          ) : (
            <span className="app-sidebar-profile-avatar app-sidebar-profile-initials" aria-hidden="true">
              {user?.name?.[0] || 'U'}
            </span>
          )}
          <span className="app-sidebar-profile-copy">
            <strong>{user?.name?.replace(/\s+/g, ' ').trim() || 'Profile'}</strong>
            <span>{user?.email || 'View profile'}</span>
          </span>
        </NavLink>
        {!onCloseDrawer && onToggleCollapse && (
          <button
            type="button"
            className="app-sidebar-collapse-toggle"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-pressed={isCollapsed}
          >
            <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={18} />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="app-sidebar-nav">
        {navSections.map((section) => (
          <div className="app-sidebar-section" key={section.title}>
            <div className="app-sidebar-section-title">
              {section.title}
            </div>
            <div className="app-sidebar-links">
              {section.items.map((item) => item.action === 'logout' ? (
                <button
                  key={item.path}
                  type="button"
                  onClick={handleMobileLogout}
                  className="app-sidebar-link app-sidebar-mobile-only app-sidebar-link-logout"
                  aria-label="Sign Out"
                >
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </button>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={navItemClick}
                  className={`app-sidebar-link ${item.mobileOnly ? 'app-sidebar-mobile-only' : ''}`}
                  aria-label={isCollapsed ? item.label : undefined}
                  title={isCollapsed ? item.label : undefined}
                  style={({ isActive }) => ({
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-text-dark)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        name={item.icon}
                        size={18}
                        color={isActive ? 'var(--color-text-dark)' : 'currentColor'}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

    </aside>
  );
};
