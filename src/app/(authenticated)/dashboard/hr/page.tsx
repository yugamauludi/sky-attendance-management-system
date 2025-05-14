"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import Background from "@/components/Background";

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
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] fixed inset-0 z-10">
      <Background />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-7xl space-y-6 p-4 pb-24 sm:p-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
              Dashboard HR
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Monitoring Kehadiran Karyawan
            </p>
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
