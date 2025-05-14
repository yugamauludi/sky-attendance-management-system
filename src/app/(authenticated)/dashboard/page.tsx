"use client";

import Background from "@/components/Background";
import { useEffect, useState } from "react";

interface AttendanceStatus {
  status: "present" | "absent" | "not_yet";
  checkIn?: string;
  checkOut?: string;
  duration?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function DashboardPage() {
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    status: "not_yet",
  });

  useEffect(() => {
    // TODO: Fetch data dari API
    // Ini hanya data dummy untuk tampilan
    setAttendance({
      status: "present",
      checkIn: "08:00",
      checkOut: "17:00",
      duration: "9 jam",
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        address: "Jl. Sudirman No. 123, Jakarta",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] fixed inset-0">
      {/* Geometric Accents - Fixed Position */}
      <Background/>
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-4 pb-24 sm:p-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                  Dashboard Karyawan
                </h1>
                <p className="mt-1 text-sm text-zinc-400">Selamat datang kembali!</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Hari ini</p>
                <p className="mt-1 text-sm font-medium text-yellow-400">
                  {new Date().toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Kehadiran Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-yellow-400">
                Status Kehadiran
              </h2>
              {attendance.status === "not_yet" ? (
                <button
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
                  onClick={() => {/* TODO: Implement check in */}}
                >
                  Check In
                </button>
              ) : attendance.status === "present" && !attendance.checkOut ? (
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                  onClick={() => {/* TODO: Implement check out */}}
                >
                  Check Out
                </button>
              ) : null}
            </div>
            
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-b from-black/60 to-black/40 p-5 ring-1 ring-yellow-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Status</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      attendance.status === "present"
                        ? "bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-400/20"
                        : attendance.status === "absent"
                        ? "bg-red-400/10 text-red-400 ring-1 ring-red-400/20"
                        : "bg-blue-400/10 text-blue-400 ring-1 ring-blue-400/20"
                    }`}
                  >
                    {attendance.status === "present"
                      ? "Sudah Absen"
                      : attendance.status === "absent"
                      ? "Tidak Hadir"
                      : "Belum Absen"}
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Waktu Masuk</span>
                    <span className="text-sm font-medium text-yellow-400">
                      {attendance.checkIn || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Waktu Keluar</span>
                    <span className="text-sm font-medium text-yellow-400">
                      {attendance.checkOut || "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Durasi Kerja</span>
                    <span className="text-sm font-medium text-yellow-400">
                      {attendance.duration || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-b from-black/60 to-black/40 p-5 ring-1 ring-yellow-500/20">
                <h3 className="text-sm font-medium text-yellow-400">Lokasi Absen</h3>
                {attendance.location ? (
                  <>
                    <div className="mt-4 h-40 w-full rounded-lg bg-black/40 ring-1 ring-yellow-500/20">
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Peta Lokasi
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-zinc-400">
                      {attendance.location.address}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">Belum ada data lokasi</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
