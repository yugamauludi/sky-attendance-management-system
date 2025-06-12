import React from "react";

interface ColumnConfig {
  key: string;
  label: string;
  className?: string;
  hiddenOnMobile?: boolean;
  render?: (row: Employee) => React.ReactNode;
  minWidth?: string;
  sortable?: boolean; // Add this line
}

interface DataTableProps<T> {
  columns: ColumnConfig[];
  data: T[];
  onRowClick?: (item: T) => void;
  renderCell: (item: T, columnKey: string) => React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  onSort?: (key: string, direction: 'asc' | 'desc') => void; // Add this line
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  renderCell,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onSort,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable || !onSort) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
    onSort(key, direction);
  };
  const getCurrentPageData = () => {    
    return data;
  };
  
  // Fungsi untuk menghitung range halaman yang akan ditampilkan
  const getPageRange = () => {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // Jika endPage sudah mencapai batas, sesuaikan startPage
    if (endPage === totalPages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    // Jika startPage adalah 1, tampilkan maxVisiblePages dari awal
    if (startPage === 1) {
      endPage = Math.min(maxVisiblePages, totalPages);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  return (
    <div>
      <div className="overflow-y-auto max-h-[500px] scrollbar-custom">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-yellow-500/20">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-yellow-400 sticky top-0 bg-zinc-900 z-10
                    ${column.key !== "location" ? "whitespace-nowrap min-w-[100px]" : ""}
                    ${column.hiddenOnMobile ? "hidden sm:table-cell" : ""}
                    ${column.sortable ? "cursor-pointer hover:bg-yellow-500/5" : ""}
                  `}
                  style={column.minWidth ? { minWidth: column.minWidth } : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <span className="text-yellow-500/50">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {getCurrentPageData().length > 0 ? (
            getCurrentPageData().map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className="cursor-pointer border-b border-yellow-500/10 transition-colors hover:bg-yellow-500/5"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-sm text-zinc-300 ${
                      column.key !== "location"
                        ? "whitespace-nowrap min-w-[100px]"
                        : ""
                    } ${column.hiddenOnMobile ? "hidden sm:table-cell" : ""}`}
                    style={
                      column.minWidth
                        ? { minWidth: column.minWidth }
                        : undefined
                    }
                  >
                    {renderCell(item, column.key)}
                  </td>
                ))}
              </tr>
            ))) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-4 py-8 text-center text-sm text-zinc-400"
                >
                  Belum ada data yang tersedia
                </td>
              </tr>
            )}

            
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-4">
        <div className="text-sm text-zinc-400">
          {totalItems === 0 || !totalItems
            ? "Menampilkan 0 - 0 dari 0 data"
            : `Menampilkan ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                currentPage * itemsPerPage,
                totalItems
              )} dari ${totalItems} data`}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 transition-colors hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <div className="flex items-center space-x-1">
            {/* Tombol halaman pertama jika tidak terlihat */}
            {getPageRange()[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="rounded-lg px-3 py-2 text-sm bg-black/30 text-white ring-1 ring-yellow-500/20 hover:bg-black/50"
                >
                  1
                </button>
                {getPageRange()[0] > 2 && (
                  <span className="px-2 text-zinc-400">...</span>
                )}
              </>
            )}

            {/* Tombol-tombol halaman */}
            {getPageRange().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`rounded-lg px-3 py-2 text-sm transition-all ${
                  currentPage === page
                    ? "bg-yellow-500 text-black font-medium ring-2 ring-yellow-500/50"
                    : "bg-black/30 text-white ring-1 ring-yellow-500/20 hover:bg-black/50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Tombol halaman terakhir jika tidak terlihat */}
            {getPageRange()[getPageRange().length - 1] < totalPages && (
              <>
                {getPageRange()[getPageRange().length - 1] < totalPages - 1 && (
                  <span className="px-2 text-zinc-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="rounded-lg px-3 py-2 text-sm bg-black/30 text-white ring-1 ring-yellow-500/20 hover:bg-black/50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 transition-colors hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
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
