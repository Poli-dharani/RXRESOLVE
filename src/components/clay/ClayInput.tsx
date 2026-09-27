import React from 'react';

interface ClayInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  disabled?: boolean;
}

export const ClayInput: React.FC<ClayInputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  disabled = false
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-5 py-3 rounded-2xl
        bg-white
        shadow-[inset_2px_2px_5px_rgba(190,200,215,0.3),inset_-1px_-1px_2px_rgba(255,255,255,0.8),0_4px_8px_rgba(80,100,130,0.05)]
        focus:outline-none focus:shadow-[inset_2px_2px_5px_rgba(107,158,255,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.9),0_0_0_3px_rgba(107,158,255,0.2)]
        focus:ring-2 focus:ring-[#6B9EFF] focus:ring-opacity-30
        text-[#1F2937] placeholder-[#64748B]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        ${className}
      `}
    />
  );
};
