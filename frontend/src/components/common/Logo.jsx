import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoPng from '../../assets/Logo.png';
import iconPng from '../../assets/Icon.png';

export const Logo = ({
  size = 'md',
  height: customHeight,
  width: customWidth,
  scaleY = 1.24,
  scaleX = 1,
  iconOnly = false,
  to = '/',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const heightMap = {
    sm: 58,
    md: 88,
    lg: 112,
    xl: 135,
  };

  const widthMap = {
    sm: 174,
    md: 274, // 264px aspect width + noticeable width increase
    lg: 336,
    xl: 405,
  };

  const height = customHeight || heightMap[size] || 88;
  const width = customWidth || (size && widthMap[size] ? widthMap[size] : null);

  const content = (
    <div className={`flex items-center ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      {!imgError ? (
        <img
          src={iconOnly ? iconPng : logoPng}
          alt="JobDheko"
          onError={() => setImgError(true)}
          style={{
            height: `${height}px`,
            width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
            maxHeight: `${height}px`,
            objectFit: width ? 'fill' : 'contain',
            display: 'block',
            transform: `scale(${scaleX}, ${scaleY})`,
            transformOrigin: 'left center',
          }}
        />
      ) : iconOnly ? (
        <svg
          height={height}
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="JobDheko Logo"
        >
          <rect x="6" y="6" width="40" height="40" rx="10" fill="#131F1B" stroke="#22C55E" strokeWidth="2.5" />
          <path d="M26 14V22M26 22L34 30M26 22L18 30" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="34" r="3.5" fill="#A3E635" />
          <path d="M14 18C14 14 18 10 26 10C34 10 38 14 38 18" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      ) : (
        <svg
          height={height}
          viewBox="0 0 240 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="JobDheko"
        >
          <g id="logo-icon">
            <rect x="6" y="10" width="40" height="40" rx="10" fill="#131F1B" stroke="#22C55E" strokeWidth="2.5" />
            <path d="M26 18V26M26 26L34 34M26 26L18 34" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="38" r="3.5" fill="#A3E635" />
            <path d="M14 22C14 18 18 14 26 14C34 14 38 18 38 22" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
          <text
            x="56"
            y="38"
            fontFamily="'Plus Jakarta Sans', 'Inter', sans-serif"
            fontSize="26"
            fontWeight="800"
            fill="#FFFFFF"
            letterSpacing="-0.5"
          >
            Job<tspan fill="#84CC16">Dheko</tspan>
          </text>
        </svg>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} aria-label="JobDheko Home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
        {content}
      </Link>
    );
  }

  return content;
};
