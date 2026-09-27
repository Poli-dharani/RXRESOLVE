import React from 'react';

interface ClayButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'relative font-semibold rounded-full transition-all duration-300 cursor-pointer active:scale-95';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-[#6B9EFF] text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-2px_-2px_5px_rgba(107,158,255,0.5),0_10px_25px_rgba(107,158,255,0.2)] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4),inset_-2px_-2px_5px_rgba(80,120,255,0.6),0_15px_35px_rgba(107,158,255,0.3)]',
    secondary: 'bg-[#DCEBFF] text-[#1F2937] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(180,190,205,0.4),0_15px_35px_rgba(80,100,130,0.12)]',
    success: 'bg-[#CDEEDB] text-[#1F2937] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(180,210,190,0.35),0_10px_25px_rgba(80,150,100,0.08)] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(160,200,170,0.4),0_15px_35px_rgba(80,150,100,0.12)]',
    danger: 'bg-[#FFD4D4] text-[#1F2937] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(220,160,160,0.35),0_10px_25px_rgba(220,100,100,0.08)] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(200,140,140,0.4),0_15px_35px_rgba(220,100,100,0.12)]',
    outline: 'bg-transparent text-[#6B9EFF] border-2 border-[#6B9EFF] hover:bg-[#DCEBFF]'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};
