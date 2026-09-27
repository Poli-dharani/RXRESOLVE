import React from 'react';

interface ClayTableProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayTable: React.FC<ClayTableProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)] ${className}`}>
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
};

interface ClayTableHeaderProps {
  children: React.ReactNode;
}

export const ClayTableHeader: React.FC<ClayTableHeaderProps> = ({ children }) => (
  <thead className="bg-gradient-to-r from-[#F6F8FC] to-[#EEF3F9] border-b-2 border-[#E2E8F0]">
    {children}
  </thead>
);

interface ClayTableBodyProps {
  children: React.ReactNode;
}

export const ClayTableBody: React.FC<ClayTableBodyProps> = ({ children }) => (
  <tbody className="bg-white">{children}</tbody>
);

interface ClayTableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ClayTableRow: React.FC<ClayTableRowProps> = ({
  children,
  onClick,
  className = ''
}) => (
  <tr
    onClick={onClick}
    className={`
      border-b border-[#E2E8F0]
      hover:bg-[#F6F8FC]
      transition-colors duration-200
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    {children}
  </tr>
);

interface ClayTableCellProps {
  children: React.ReactNode;
  header?: boolean;
  className?: string;
}

export const ClayTableCell: React.FC<ClayTableCellProps> = ({
  children,
  header = false,
  className = ''
}) => {
  const baseClasses = 'px-6 py-4 text-sm';
  const headerClasses = header
    ? 'font-semibold text-[#1F2937] uppercase tracking-wide text-xs'
    : 'text-[#1F2937]';

  return (
    <td className={`${baseClasses} ${headerClasses} ${className}`}>
      {children}
    </td>
  );
};
