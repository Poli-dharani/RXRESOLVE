import React from 'react';

interface ClayGradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export const ClayGradientText: React.FC<ClayGradientTextProps> = ({
  children,
  className = '',
  from = '#6B9EFF',
  to = '#77CFC1'
}) => {
  return (
    <span
      className={`bg-gradient-to-r bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${from}, ${to})`
      }}
    >
      {children}
    </span>
  );
};

interface ClayGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export const ClayGradientBackground: React.FC<ClayGradientBackgroundProps> = ({
  children,
  className = '',
  from = '#6B9EFF',
  to = '#77CFC1'
}) => {
  return (
    <div
      className={`${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`
      }}
    >
      {children}
    </div>
  );
};
