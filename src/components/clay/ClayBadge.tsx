import React from 'react';

interface ClayBadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'red';
  className?: string;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  variant = 'blue',
  className = ''
}) => {
  const variantClasses = {
    blue: 'bg-[#DCEBFF] text-[#6B9EFF]',
    teal: 'bg-[#E0F5F2] text-[#77CFC1]',
    purple: 'bg-[#DCD7FF] text-[#AFA7FF]',
    green: 'bg-[#CDEEDB] text-[#4CAF50]',
    amber: 'bg-[#FFE5B5] text-[#F59E0B]',
    red: 'bg-[#FFD4D4] text-[#EF4444]'
  };

  return (
    <span
      className={`
        inline-flex items-center px-4 py-2 rounded-full
        text-sm font-semibold
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
