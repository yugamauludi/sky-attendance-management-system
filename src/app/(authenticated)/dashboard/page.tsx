"use client";

import { useEffect, useState } from "react";
// import Image from 'next/image';

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Karyawan
            </h1>
            <p className="text-gray-600">Selamat datang kembali!</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Hari ini</p>
            <p className="text-lg font-semibold text-gray-800">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Status Kehadiran */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Status Kehadiran
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    attendance.status === "present"
                      ? "bg-green-100 text-green-800"
                      : attendance.status === "absent"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {attendance.status === "present"
                    ? "Sudah Absen"
                    : attendance.status === "absent"
                    ? "Tidak Hadir"
                    : "Belum Absen"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Waktu Masuk</span>
                <span className="font-medium text-gray-800">
                  {attendance.checkIn || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Waktu Keluar</span>
                <span className="font-medium text-gray-800">
                  {attendance.checkOut || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Durasi Kerja</span>
                <span className="font-medium text-gray-800">
                  {attendance.duration || "-"}
                </span>
              </div>
            </div>

            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">Lokasi Absen</h3>
              {attendance.location ? (
                <>
                  <div className="h-40 w-full rounded-lg bg-gray-200">
                    {/* Di sini bisa ditambahkan peta lokasi */}
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Peta Lokasi
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {attendance.location.address}
                  </p>
                </>
              ) : (
                <p className="text-gray-600">Belum ada data lokasi</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
