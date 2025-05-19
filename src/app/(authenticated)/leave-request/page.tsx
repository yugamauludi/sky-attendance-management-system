"use client";

import Background from "@/components/Background";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LeaveRequest {
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function LeaveRequestPage() {
  const [leaveBalance] = useState({
    annual: 12,
    used: 5,
    remaining: 7,
  });

  const [leaveHistory] = useState<LeaveRequest[]>([
    {
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      type: "Cuti Tahunan",
      reason: "Liburan Keluarga",
      status: "approved",
      submittedAt: "2024-01-15",
    },
    {
      startDate: "2024-02-05",
      endDate: "2024-02-05",
      type: "Cuti Sakit",
      reason: "Demam",
      status: "pending",
      submittedAt: "2024-02-04",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implementasi logika pengiriman form ke API
    console.log("Form submitted");
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-4 pb-2 sm:p-6">
          {/* Header Card dengan Status Cuti */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                    Pengajuan Cuti
                  </h1>
                  <p className="mt-1 text-sm text-zinc-400">
                    Ajukan dan pantau status cuti Anda
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-yellow-400">Cuti Tahunan</span>
                  <span className="text-2xl font-bold text-white">{leaveBalance.annual} hari</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-red-400">Terpakai</span>
                  <span className="text-2xl font-bold text-white">{leaveBalance.used} hari</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-medium text-emerald-400">Sisa Cuti</span>
                  <span className="text-2xl font-bold text-white">{leaveBalance.remaining} hari</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Pengajuan Cuti */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              Form Pengajuan Cuti
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Tanggal Mulai
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pilih tanggal mulai"
                    className="w-full !bg-black/40 px-3 py-2 text-white rounded-lg border-0 shadow-sm ring-1 ring-inset ring-yellow-500/20 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm"
                    calendarClassName="bg-black/90 border-yellow-500/20 text-white"
                    required
                    wrapperClassName="w-full"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-zinc-400 mb-1">
                    Tanggal Selesai
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || undefined}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Pilih tanggal selesai"
                    className="w-full !bg-black/40 px-3 py-2 text-white rounded-lg border-0 shadow-sm ring-1 ring-inset ring-yellow-500/20 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm"
                    calendarClassName="bg-black/90 border-yellow-500/20 text-white"
                    required
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Jenis Cuti
                </label>
                <select
                  required
                  className="w-full rounded-lg border-0 bg-black/40 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-yellow-500/20 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm"
                >
                  <option value="">Pilih Jenis Cuti</option>
                  <option value="annual">Cuti Tahunan</option>
                  <option value="sick">Cuti Sakit</option>
                  <option value="important">Cuti Penting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Alasan Cuti
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-lg border-0 bg-black/40 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-yellow-500/20 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm"
                  placeholder="Jelaskan alasan pengajuan cuti Anda..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
                >
                  Ajukan Cuti
                </button>
              </div>
            </form>
          </div>

          {/* Riwayat Pengajuan Cuti */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">
              Riwayat Pengajuan Cuti
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-500/20">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Tanggal Pengajuan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Periode</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Jenis</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Alasan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/20">
                  {leaveHistory.map((leave, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(leave.submittedAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(leave.startDate).toLocaleDateString("id-ID")} - {new Date(leave.endDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{leave.type}</td>
                      <td className="px-3 py-4 text-sm text-gray-300">{leave.reason}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            leave.status === "approved"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : leave.status === "rejected"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}
                        >
                          {leave.status === "approved"
                            ? "Disetujui"
                            : leave.status === "rejected"
                            ? "Ditolak"
                            : "Menunggu"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}