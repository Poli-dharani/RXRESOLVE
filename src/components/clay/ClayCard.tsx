import React from 'react';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  elevated?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  className = '',
  onClick,
  elevated = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-3xl
        shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)]
        hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(180,190,205,0.4),0_15px_40px_rgba(80,100,130,0.12)]
        transition-all duration-300 ease-out
        ${elevated ? 'hover:translate-y-[-4px]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface ClayCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayCardHeader: React.FC<ClayCardHeaderProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 border-b border-[#E2E8F0] ${className}`}>
    {children}
  </div>
);

interface ClayCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayCardBody: React.FC<ClayCardBodyProps> = ({
  children,
  className = ''
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
