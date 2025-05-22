import React from "react";

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
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
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
  renderCell,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: DataTableProps<T>) {
  const getCurrentPageData = () => {
    return data; // Langsung return data tanpa slice
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-yellow-500/20">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-medium text-yellow-400 ${
                    column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCurrentPageData().map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className="cursor-pointer border-b border-yellow-500/10 transition-colors hover:bg-yellow-500/5"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-sm text-zinc-300 ${
                      column.hiddenOnMobile ? "hidden sm:table-cell" : ""
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

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-4">
        <div className="text-sm text-zinc-400">
          Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems}{" "}
          data
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
