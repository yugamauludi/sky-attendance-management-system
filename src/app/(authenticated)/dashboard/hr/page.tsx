/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import Background from "@/components/Background";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { exportAttendance, getAllAttendance } from "@/services/attendance";
import { formatDateTime } from "@/utiils/dateFormatter";

export interface EmployeeAttendance {
  id: string;
  userId: string;
  name: string;
  location: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: string;
  pathIn: string;
  pathOut: string;
  notes?: string;
  // dateIn: string;
  // dateOut: string;
}

interface EmployeeDetail {
  isOpen: boolean;
  employee: EmployeeAttendance | null;
}

const mapApiEmployeeToEmployee = (apiAttendance: any): EmployeeAttendance => {
  return {
    id: apiAttendance.Id,
    userId: apiAttendance.UserId,
    name: apiAttendance.Fullname,
    location: apiAttendance.LocationName,
    date: apiAttendance.Date,
    checkIn: formatDateTime(apiAttendance.InTime),
    checkOut: formatDateTime(apiAttendance.OutTime),
    duration: apiAttendance.Duration,
    status: apiAttendance.Status,
    pathIn: apiAttendance.pathIn,
    pathOut: apiAttendance.pathOut,
    notes: apiAttendance.Description,
    // dateIn: formatTanggalPendekWIB(apiAttendance.InTime),
    // dateOut: formatTanggalPendekWIB(apiAttendance.OutTime),
  };
};

export default function HRDashboardPage() {
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalKaryawan: 0,
    inhouse: 0,
    vendor: 0,
    hadir: 0,
    sakit: 0,
    cuti: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setIsLoading(true);
        const response = await getAllAttendance(currentPage, itemsPerPage);

        setPagination(response.meta);

        const mappedEmployees = response.data[1].data.map(
          mapApiEmployeeToEmployee
        );
        setAttendances(mappedEmployees);

        const summary = response.data[0].Summary;
        setStats({
          totalKaryawan: summary.Karyawan,
          inhouse: 0,
          vendor: 0,
          hadir: summary.Hadir,
          sakit: summary.Sakit,
          cuti: summary.Cuti,
        });
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendances();
  }, [currentPage, itemsPerPage]);

  const [filteredAttendances, setFilteredAttendances] = useState<
    EmployeeAttendance[]
  >([]);
  const [filters, setFilters] = useState({
    name: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    location: "",
    status: "",
  });

  useEffect(() => {
    const filtered = attendances?.filter((attendance) => {
      const matchName = attendance?.name
        ?.toLowerCase()
        ?.includes(filters?.name?.toLowerCase());
      const matchLocation = attendance?.location
        ?.toLowerCase()
        ?.includes(filters?.location?.toLowerCase());
      const matchStatus =
        filters?.status === "" || attendance?.status === filters.status;

      let matchDate = true;
      if (filters.startDate && filters.endDate) {
        const attendanceDate = new Date(attendance.date);
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);

        matchDate = attendanceDate >= startDate && attendanceDate <= endDate;
      }

      return matchName && matchLocation && matchStatus && matchDate;
    });

    setFilteredAttendances(filtered);
  }, [attendances, filters]);

  // const handleSort = (key: string, direction: "asc" | "desc") => {
  //   // Sort your data here
  //   const sortedData = [...filteredAttendances].sort((a, b) => {
  //     if (direction === "asc") {
  //       return (a[key as keyof EmployeeAttendance] as string) >
  //         (b[key as keyof EmployeeAttendance] as string)
  //         ? 1
  //         : -1;
  //     } else {
  //       return (a[key as keyof EmployeeAttendance] as string) <
  //         (b[key as keyof EmployeeAttendance] as string)
  //         ? 1
  //         : -1;
  //     }
  //   });
  //   setFilteredAttendances(sortedData);
  // };

  const columns = [
    { key: "date", 
      label: "Tanggal", 
      hiddenOnMobile: true, 
      // sortable: true 
    },
    // {key: "dateIn", label: "Tanggal Check In", hiddenOnMobile: true},
    // {key: "dateOut", label: "Tanggal Check Out", hiddenOnMobile: true},
    { key: "name", 
      label: "Nama Karyawan", 
      // sortable: true 
    },
    {
      key: "location",
      label: "Lokasi",
      hiddenOnMobile: true,
      minWidth: "200px",
      // sortable: true,
    },
    { key: "checkIn",
      label: "Check In", 
      // sortable: true 
    },
    { key: "checkOut", 
      label: "Check Out", 
      // sortable: true 
    },
    { key: "duration", 
      label: "Durasi", 
      hiddenOnMobile: true, 
      // sortable: true 
    },
    { key: "status", label: "Status" },
    // { key: "notes", label: "Keterangan", hiddenOnMobile: true },
  ];
  const renderAttendanceCell = (
    attendance: EmployeeAttendance,
    key: string
  ) => {
    switch (key) {
      case "name":
        return (
          <>
            <div className="font-medium">{attendance.name}</div>
            <div className="mt-1 text-xs text-zinc-400 sm:hidden">
              {attendance.date} - {attendance.location}
            </div>
          </>
        );
      case "date":
        return new Date(attendance.date).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      case "checkIn":
        return attendance.checkIn;
      case "checkOut":
        return attendance.checkOut;
      case "status":
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              attendance.status === "Hadir"
                ? "bg-emerald-400/10 text-emerald-400"
                : attendance.status === "Sakit"
                ? "bg-red-400/10 text-red-400"
                : "bg-blue-400/10 text-blue-400"
            }`}
          >
            {attendance.status}
          </span>
        );
      default:
        return attendance[key as keyof EmployeeAttendance] || "-";
    }
  };
  const [detailModal, setDetailModal] = useState<EmployeeDetail>({
    isOpen: false,
    employee: null,
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const handleExport = async () => {
    try {
      if (!exportDates.startDate || !exportDates.endDate) {
        alert("Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu");
        return;
      }

      const startDate = exportDates.startDate.toISOString().split("T")[0];
      const endDate = exportDates.endDate.toISOString().split("T")[0];

      await exportAttendance(startDate, endDate);
      setShowExportModal(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Gagal mengekspor data");
    }
  };

  const thisDay = new Date();

  return (
    <div className="min-h-screen bg-[#1a1a1a] overflow-auto">
      {" "}
      {/* Tambahkan overflow-auto di sini */}
      <Background />
      {/* Content Container - hapus overflow-auto */}
      <div className="relative min-h-screen">
        <div className="mx-4 lg:mx-8 pb-8">
          {/* Tambahkan padding bottom */}
          {/* Header Card */}

          <div id="dashboard-head" className="py-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between m-4">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                  Dashboard HR
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Monitoring Kehadiran Karyawan
                </p>
              </div>
              {/* Quick Actions */}
              <div className="mt-3 sm:mt-0 w-full sm:w-auto">
                <div className="grid grid-cols-3 gap-2 w-full sm:w-[500px] min-h-[70px]">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex flex-col items-center justify-center rounded-md bg-black/30 p-2 transition-all hover:bg-black/50 hover:ring-1 hover:ring-yellow-500/40 group w-full h-full"
                  >
                    <div className="rounded-full bg-yellow-500/10 p-1 mb-1 group-hover:bg-yellow-500/20">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-zinc-300">
                      Export Data
                    </span>
                  </button>
                  <Link
                    href="/dashboard/hr/add"
                    className="flex flex-col items-center justify-center rounded-md bg-black/30 p-2 transition-all hover:bg-black/50 hover:ring-1 hover:ring-yellow-500/40 group w-full h-full"
                  >
                    <div className="rounded-full bg-yellow-500/10 p-1 mb-1 group-hover:bg-yellow-500/20">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-zinc-300">
                      Tambah Karyawan
                    </span>
                  </Link>
                  <Link
                    href="/employee-list"
                    className="flex flex-col items-center justify-center rounded-md bg-black/30 p-2 transition-all hover:bg-black/50 hover:ring-1 hover:ring-yellow-500/40 group w-full h-full"
                  >
                    <div className="rounded-full bg-yellow-500/10 p-1 mb-1 group-hover:bg-yellow-500/20">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-zinc-300">
                      Daftar Karyawan
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Statistik Karyawan */}
            <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
              <h3 className="text-sm font-medium text-yellow-400">
                Kehadiran Karyawan {thisDay.toLocaleDateString("id-ID", {})}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-yellow-400">
                      Jumlah Karyawan
                    </h3>
                    <div className="rounded-full bg-yellow-500/10 p-1">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-2xl font-semibold text-white">
                      {stats.totalKaryawan}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-emerald-400">
                      Hadir
                    </h3>
                    <div className="rounded-full bg-emerald-500/10 p-1">
                      <svg
                        className="h-4 w-4 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-white">
                      {stats.hadir}
                    </p>
                    <p className="ml-2 text-sm text-zinc-400">
                      dari {stats.totalKaryawan} karyawan
                    </p>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-black/50">
                    <div
                      className="h-2 rounded-full bg-emerald-400/70"
                      style={{
                        width: `${(stats.hadir / stats.totalKaryawan) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-red-400">
                          Sakit
                        </h3>
                        <div className="rounded-full bg-red-500/10 p-1">
                          <svg
                            className="h-4 w-4 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {stats.sakit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <h3 className="text-sm font-medium text-blue-400">
                          Cuti
                        </h3>
                        <div className="rounded-full bg-blue-500/10 p-1">
                          <svg
                            className="h-4 w-4 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xl font-semibold text-white">
                        {stats.cuti}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-black/50">
                    <div
                      className="h-2 rounded-full bg-red-400/70"
                      style={{
                        width: `${(stats.sakit / stats.totalKaryawan) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-black/50">
                    <div
                      className="h-2 rounded-full bg-blue-400/70"
                      style={{
                        width: `${(stats.cuti / stats.totalKaryawan) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table Card */}
          <div className="rounded-2xl bg-black/40 p-4 sm:p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <h2 className="text-xl font-medium text-yellow-400">
              Table Kehadiran Karyawan
            </h2>
            <p className="text-sm text-zinc-400 mt-2 mb-6">
              Daftar kehadiran seluruh karyawan dari berbagai periode waktu.
              Gunakan filter untuk mencari data berdasarkan nama, tanggal,
              lokasi, atau status kehadiran.
            </p>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Nama Karyawan
                </label>
                <input
                  type="text"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  placeholder="Cari nama..."
                />
              </div>

              <div className="z-50">
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Tanggal Mulai
                </label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) =>
                    setFilters({ ...filters, startDate: date })
                  }
                  selectsStart
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal mulai"
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="z-50">
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Tanggal Akhir
                </label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  selectsEnd
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  minDate={filters.startDate || undefined}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal akhir"
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  wrapperClassName="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  placeholder="Cari lokasi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                >
                  <option value="">Semua Status</option>
                  <option value="Hadir">Hadir</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Cuti">Cuti</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-zinc-400">Tampilkan:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-zinc-400">data per halaman</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-yellow-400 text-sm">Memuat data...</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredAttendances}
                onRowClick={(attendance) =>
                  setDetailModal({ isOpen: true, employee: attendance })
                }
                // onSort={handleSort}
                renderCell={renderAttendanceCell}
                currentPage={currentPage}
                totalPages={(pagination as any).totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={(pagination as any).totalItems}
              />
            )}
          </div>
        </div>
      </div>
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 max-w-md w-full mx-4 space-y-4 ring-1 ring-yellow-500/20">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-400">
                  Export Data Kehadiran
                </h3>
                <p className="text-sm text-zinc-400">
                  Pilih rentang tanggal untuk mengekspor data
                </p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Tanggal Mulai
                </label>
                <DatePicker
                  selected={exportDates.startDate}
                  onChange={(date) =>
                    setExportDates((prev) => ({ ...prev, startDate: date }))
                  }
                  selectsStart
                  startDate={exportDates.startDate}
                  endDate={exportDates.endDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal mulai"
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  wrapperClassName="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Tanggal Akhir
                </label>
                <DatePicker
                  selected={exportDates.endDate}
                  onChange={(date) =>
                    setExportDates((prev) => ({ ...prev, endDate: date }))
                  }
                  selectsEnd
                  startDate={exportDates.startDate}
                  endDate={exportDates.endDate}
                  minDate={exportDates.startDate || undefined}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Pilih tanggal akhir"
                  className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-500 ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg hover:bg-gradient-to-bl focus:ring-4 focus:ring-yellow-300"
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Detail Modal */}
      {detailModal.isOpen && detailModal.employee && (
        <DetailModal
          isOpen={detailModal.isOpen}
          employee={detailModal.employee}
          onClose={() => setDetailModal({ isOpen: false, employee: null })}
        />
      )}
    </div>
  );
}
