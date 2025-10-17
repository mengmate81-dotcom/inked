import React, { useState } from 'react';

interface BrandLogoProps {
  brandName: string;
  className?: string;
  customLogo?: string | null;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, className = "w-10 h-10", customLogo }) => {
  const [error, setError] = useState(false);

  // If a custom logo is provided, use it directly.
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt={`${brandName} logo`}
        className={`${className} rounded-full object-contain bg-[var(--color-surface-primary)] border border-[var(--color-border-secondary)]`}
      />
    );
  }

  // Simple normalization for the domain name
  const domain = brandName.toLowerCase().replace(/\s+/g, '').replace(/[.'’]/g, '');
  const logoUrl = `https://logo.clearbit.com/${domain}.com`;

  const handleImageError = () => {
    setError(true);
  };

  if (error || !brandName) {
    return (
      <div className={`${className} flex items-center justify-center bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] font-bold rounded-full backdrop-blur-sm`}>
        {brandName?.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${brandName} logo`}
      onError={handleImageError}
      className={`${className} rounded-full object-contain bg-[var(--color-surface-primary)] border border-[var(--color-border-secondary)]`}
    />
  );
};