import React from 'react';

interface ClaySidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const ClaySidebar: React.FC<ClaySidebarProps> = ({
  children,
  className = ''
}) => {
  return (
    <aside
      className={`
        h-screen fixed left-0 top-0 w-64 bg-[#F6F8FC]
        shadow-[inset_-2px_0px_5px_rgba(190,200,215,0.2),0_4px_12px_rgba(80,100,130,0.08)]
        overflow-y-auto
        ${className}
      `}
    >
      <nav className="p-6 space-y-2">
        {children}
      </nav>
    </aside>
  );
};

interface ClaySidebarItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const ClaySidebarItem: React.FC<ClaySidebarItemProps> = ({
  children,
  onClick,
  active = false,
  icon,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 rounded-2xl
        transition-all duration-300
        flex items-center gap-3
        ${active
          ? 'bg-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_8px_20px_rgba(107,158,255,0.15)] text-[#6B9EFF] font-semibold'
          : 'text-[#64748B] hover:bg-white hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.7),inset_-1px_-1px_3px_rgba(190,200,215,0.25),0_4px_12px_rgba(80,100,130,0.06)]'
        }
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
};

interface ClaySidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ClaySidebarSection: React.FC<ClaySidebarSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
          {title}
        </p>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};
