import React, { useState } from 'react';
import { getCompanyLogo } from '../../data/unsplashAssets';
import { Icon } from '../icons/Icon';

export const CompanyLogo = ({
  company = '',
  src,
  size = 'md',
  className = '',
  style = {},
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeMap = {
    xs: 28,
    sm: 36,
    md: 44,
    lg: 52,
    xl: 64,
  };

  const px = sizeMap[size] || sizeMap.md;
  const logoUrl = !hasError ? (src || getCompanyLogo(company)) : null;

  const normalized = company?.trim().toLowerCase();

  // If specific SVG brand icons exist in Icon.jsx
  const brandIconMap = {
    google: 'google',
    unsplash: 'unsplash',
    microsoft: 'microsoft',
    amazon: 'amazon',
    apple: 'apple',
    spotify: 'spotify',
    meta: 'meta',
  };

  const matchedBrand = brandIconMap[normalized];

  if (logoUrl) {
    return (
      <div
        className={className}
        style={{
          width: px,
          height: px,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...style,
        }}
      >
        <img
          src={logoUrl}
          alt={`${company} logo`}
          onError={() => setHasError(true)}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: px,
        height: px,
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)',
        fontWeight: 700,
        fontSize: px * 0.42,
        flexShrink: 0,
        ...style,
      }}
    >
      {matchedBrand ? (
        <Icon name={matchedBrand} size={px * 0.58} />
      ) : (
        <span>{company ? company[0].toUpperCase() : 'J'}</span>
      )}
    </div>
  );
};
