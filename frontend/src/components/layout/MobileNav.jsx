import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../icons/Icon';

export const MobileNav = () => {
  const navItems = [
    { label: 'Home', path: '/app', icon: 'home', end: true },
    { label: 'Jobs', path: '/app/jobs', icon: 'briefcase' },
    { label: 'Saved', path: '/app/saved-jobs', icon: 'bookmark' },
    { label: 'Apps', path: '/app/applications', icon: 'file' },
    { label: 'Profile', path: '/app/profile', icon: 'user' },
  ];

  return (
    <nav
      className="hide-on-desktop"
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--mobile-nav-height)',
        backgroundColor: 'rgba(15, 21, 23, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            padding: '0.25rem 0.5rem',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontSize: '0.6875rem',
            fontWeight: isActive ? 600 : 500,
            textDecoration: 'none',
            flex: 1,
          })}
        >
          {({ isActive }) => (
            <>
              <Icon
                name={item.icon}
                size={20}
                color={isActive ? 'var(--color-primary)' : 'currentColor'}
              />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
