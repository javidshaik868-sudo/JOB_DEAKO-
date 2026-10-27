import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '../icons/Icon';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onOpenDrawer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/app/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="app-navbar">
      {/* Brand and mobile menu */}
      <div className="app-navbar-brand">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="hide-on-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--color-text-secondary)',
          }}
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>
        <Logo to="/app" size="sm" width={150} height={50} scaleY={1} className="app-navbar-logo" />
      </div>

      {/* Global Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '460px',
          margin: '0 1.5rem',
        }}
        className="hide-on-mobile"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.375rem 0.75rem',
            gap: '0.5rem',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <Icon name="search" size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search jobs, skills, or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: '0.8125rem',
              color: 'var(--color-text-primary)',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>
      </form>

      {/* Actions & Profile */}
      <div className="app-navbar-actions hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Messages Shortcut */}
        <Link
          to="/app/messages"
          aria-label="Messages"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Icon name="message" size={18} />
        </Link>

        {/* Notifications Shortcut */}
        <Link
          to="/app/notifications"
          aria-label="Notifications"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Icon name="bell" size={18} />
          {/* Notification dot */}
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 8px var(--color-primary)',
            }}
          />
        </Link>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              cursor: 'pointer',
            }}
            aria-expanded={showProfileMenu}
            aria-haspopup="true"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'User avatar'}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--border-primary)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(163, 230, 53, 0.15)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {user?.name ? user.name[0] : 'U'}
              </div>
            )}
            <span
              className="hide-on-mobile"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                maxWidth: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name?.split(' ')[0] || 'Account'}
            </span>
            <Icon name="chevron-down" size={14} color="var(--color-text-muted)" />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 0.5rem)',
                right: 0,
                width: '200px',
                backgroundColor: 'var(--bg-card-elevated)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <Link
                to="/app/profile"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Icon name="user" size={16} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/app/profile/edit"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Icon name="edit" size={16} />
                <span>Edit Profile</span>
              </Link>
              <Link
                to="/app/settings"
                onClick={() => setShowProfileMenu(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <Icon name="settings" size={16} />
                <span>Settings</span>
              </Link>
              <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/signin');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-error)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Icon name="logout" size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
