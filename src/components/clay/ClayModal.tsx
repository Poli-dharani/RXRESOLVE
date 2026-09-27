import React from 'react';
import { X } from 'lucide-react';

interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const ClayModal: React.FC<ClayModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`
            bg-white rounded-2xl
            shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_20px_40px_rgba(80,100,130,0.15)]
            w-full ${sizeClasses[size]}
            max-h-[90vh] overflow-y-auto
            animate-scale-in
          `}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
              <h2 className="text-xl font-bold text-[#1F2937]">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F6F8FC] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

interface ClayModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayModalBody: React.FC<ClayModalBodyProps> = ({
  children,
  className = ''
}) => (
  <div className={`text-[#1F2937] ${className}`}>
    {children}
  </div>
);

interface ClayModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayModalFooter: React.FC<ClayModalFooterProps> = ({
  children,
  className = ''
}) => (
  <div className={`flex items-center gap-3 mt-6 pt-6 border-t border-[#E2E8F0] ${className}`}>
    {children}
  </div>
);
