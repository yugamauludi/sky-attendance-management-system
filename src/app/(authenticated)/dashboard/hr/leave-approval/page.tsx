"use client";

import Background from "@/components/Background";
import { useState } from "react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export default function LeaveApprovalPage() {
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeName: "Budi Santoso",
      employeeId: "EMP001",
      startDate: "2024-02-15",
      endDate: "2024-02-17",
      type: "Cuti Tahunan",
      reason: "Liburan Keluarga",
      status: "pending",
      submittedAt: "2024-02-10",
    },
    {
      id: "2",
      employeeName: "Ani Wijaya",
      employeeId: "EMP002",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      type: "Cuti Sakit",
      reason: "Demam",
      status: "pending",
      submittedAt: "2024-02-19",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleApprove = async (id: string) => {
    // TODO: Implementasi API untuk approval
    console.log("Approved leave request:", id);
  };

  const handleReject = async (id: string) => {
    // TODO: Implementasi API untuk rejection
    console.log("Rejected leave request:", id);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-6xl space-y-6 p-4 pb-2 sm:p-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                  Approval Pengajuan Cuti
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Kelola dan proses pengajuan cuti karyawan
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Pengajuan Cuti */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-500/20">
                <thead>
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Nama Karyawan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">ID Karyawan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Tanggal Pengajuan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Periode</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Jenis</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-yellow-400">Status</th>
                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-yellow-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-500/20">
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-white/5">
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {request.employeeName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {request.employeeId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(request.submittedAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {new Date(request.startDate).toLocaleDateString("id-ID")} - {new Date(request.endDate).toLocaleDateString("id-ID")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {request.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            request.status === "approved"
                              ? "bg-emerald-400/10 text-emerald-400"
                              : request.status === "rejected"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}
                        >
                          {request.status === "approved"
                            ? "Disetujui"
                            : request.status === "rejected"
                            ? "Ditolak"
                            : "Menunggu"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailModal(true);
                            }}
                            className="rounded-lg bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="rounded-lg bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/60 p-6 rounded-2xl backdrop-blur-lg ring-1 ring-yellow-500/20 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-yellow-400">
                Detail Pengajuan Cuti
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400">Nama Karyawan</label>
                <p className="mt-1 text-sm text-white">{selectedRequest.employeeName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400">ID Karyawan</label>
                <p className="mt-1 text-sm text-white">{selectedRequest.employeeId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400">Periode Cuti</label>
                <p className="mt-1 text-sm text-white">
                  {new Date(selectedRequest.startDate).toLocaleDateString("id-ID")} - {new Date(selectedRequest.endDate).toLocaleDateString("id-ID")}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400">Jenis Cuti</label>
                <p className="mt-1 text-sm text-white">{selectedRequest.type}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400">Alasan</label>
                <p className="mt-1 text-sm text-white">{selectedRequest.reason}</p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleReject(selectedRequest.id);
                    setShowDetailModal(false);
                  }}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Tolak
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedRequest.id);
                    setShowDetailModal(false);
                  }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}