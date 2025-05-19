import React from 'react';


interface ColumnConfig {
  key: string;
  label: string;
  className?: string;
  hiddenOnMobile?: boolean;
  render?: (row: Employee) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnConfig[];
  data: T[];
  onRowClick?: (item: T) => void;
  renderCell: (item: T, columnKey: string) => React.ReactNode;
}

interface Employee {
  id: string;
  name: string;
  gender: string;
  idNumber: string;
  birthPlace: string;
  birthDate: string;
  email: string;
  address: string;
  position: string;
  department: string;
  joinDate: string;
  phoneNumber: string;
  location: string;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onRowClick, 
  renderCell 
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`sticky top-0 bg-black/60 px-4 py-3 text-left text-sm font-medium text-yellow-400 first:rounded-tl-lg last:rounded-tr-lg ${
                  column.hiddenOnMobile ? 'hidden sm:table-cell' : ''
                } ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-yellow-500/10">
          {data.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-white/5 cursor-pointer relative group"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className={`px-4 py-4 text-sm text-zinc-200 ${
                    column.hiddenOnMobile ? 'hidden sm:table-cell' : ''
                  }`}
                >
                  {renderCell(item, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}