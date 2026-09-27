import React from 'react';

interface ClaySectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ClaySection: React.FC<ClaySectionProps> = ({
  children,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <section className={`py-12 md:py-20 ${className}`}>
      {title && (
        <div className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-[#64748B] max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-6">
        {children}
      </div>
    </section>
  );
};

interface ClayContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const ClayContainer: React.FC<ClayContainerProps> = ({
  children,
  size = 'lg',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'w-full'
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
