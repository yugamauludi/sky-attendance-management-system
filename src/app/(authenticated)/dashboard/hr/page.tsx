"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import Background from "@/components/Background";
import Link from "next/link";

export interface EmployeeAttendance {
  id: string;
  name: string;
  location: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: string;
  notes?: string;
}

interface EmployeeDetail {
  isOpen: boolean;
  employee: EmployeeAttendance | null;
}

export default function HRDashboardPage() {
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>([]);
  const [stats, setStats] = useState({
    totalKaryawan: 0,
    inhouse: 0,
    vendor: 0,
    hadir: 0,
    sakit: 0,
    cuti: 0,
  });
  
  const columns = [
    { key: "name", label: "Nama Karyawan" },
    { key: "date", label: "Tanggal", hiddenOnMobile: true },
    { key: "location", label: "Lokasi", hiddenOnMobile: true },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "duration", label: "Durasi", hiddenOnMobile: true },
    { key: "status", label: "Status" },
    { key: "notes", label: "Keterangan", hiddenOnMobile: true },
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

  useEffect(() => {
    // TODO: Fetch data dari API
    // Data dummy untuk tampilan
    setAttendances([
      {
        id: "1",
        name: "Budi Santoso",
        location:
          "Karawaci Office Park Blok H no 20, Jl. Imam Bonjol Lippo, RT.001/RW.009, Karawaci, Tangerang City, Banten 15115",
        date: "2024-01-15",
        checkIn: "08:00",
        checkOut: "17:00",
        duration: "9 jam",
        status: "Hadir",
      },
      {
        id: "2",
        name: "Ani Wijaya",
        location: "Bandung",
        date: "2024-01-15",
        checkIn: "-",
        checkOut: "-",
        duration: "-",
        status: "Cuti",
        notes: "Cuti Tahunan",
      },
      {
        id: "3",
        name: "Dedi Kurniawan",
        location: "Surabaya",
        date: "2024-01-15",
        checkIn: "-",
        checkOut: "-",
        duration: "-",
        status: "Sakit",
        notes: "Izin Sakit dengan Surat Dokter",
      },
    ]);
    
    // Set statistik dummy
    setStats({
      totalKaryawan: 50,
      inhouse: 35,
      vendor: 15,
      hadir: 42,
      sakit: 3,
      cuti: 5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-4 lg:mx-8">
          {/* Header Card */}
          <div id="dashboard-head" className="py-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                  Dashboard HR
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Monitoring Kehadiran Karyawan
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href="/dashboard/hr/leave-approval"
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600"
                >
                  Approval Cuti
                </Link>
                <Link
                  href="/dashboard/hr/add"
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600"
                >
                  Tambah Karyawan
                </Link>
                <Link
                  href="/employee-list"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Daftar Karyawan
                </Link>
              </div>
            </div>
            
            {/* Statistik Karyawan */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                <h3 className="text-sm font-medium text-yellow-400">Jumlah Karyawan</h3>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl font-semibold text-white">{stats.totalKaryawan}</p>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Inhouse</p>
                    <p className="text-sm font-medium text-yellow-400">{stats.inhouse}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400">Vendor (DW)</p>
                    <p className="text-sm font-medium text-yellow-400">{stats.vendor}</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                <h3 className="text-sm font-medium text-emerald-400">Hadir</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-white">{stats.hadir}</p>
                  <p className="ml-2 text-sm text-zinc-400">
                    dari {stats.totalKaryawan} karyawan
                  </p>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-black/50">
                  <div 
                    className="h-2 rounded-full bg-emerald-400/70" 
                    style={{ width: `${(stats.hadir / stats.totalKaryawan) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="rounded-xl bg-black/30 p-4 ring-1 ring-yellow-500/10 min-w-[240px]">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Sakit</h3>
                    <p className="text-xl font-semibold text-white">{stats.sakit}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-blue-400">Cuti</h3>
                    <p className="text-xl font-semibold text-white">{stats.cuti}</p>
                  </div>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-black/50">
                  <div 
                    className="h-2 rounded-full bg-red-400/70" 
                    style={{ width: `${(stats.sakit / stats.totalKaryawan) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-black/50">
                  <div 
                    className="h-2 rounded-full bg-blue-400/70" 
                    style={{ width: `${(stats.cuti / stats.totalKaryawan) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="rounded-2xl bg-black/40 p-4 sm:p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <DataTable
              columns={columns}
              data={attendances}
              onRowClick={(attendance) =>
                setDetailModal({ isOpen: true, employee: attendance })
              }
              renderCell={renderAttendanceCell}
            />
          </div>
        </div>
      </div>
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
