import React from "react";
import { EmployeeAttendance } from "@/app/(authenticated)/dashboard/hr/page";

interface EmployeeDetail {
  isOpen: boolean;
  employee: EmployeeAttendance | null;
  onClose: () => void;
}

const DetailModal: React.FC<EmployeeDetail> = ({
  isOpen,
  employee,
  onClose,
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 pb-24">
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-2xl w-full mx-2 sm:mx-4 space-y-4 ring-1 ring-yellow-500/20 overflow-y-auto max-h-full">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-yellow-400">
              Detail Kehadiran Karyawan
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">Data lengkap absensi</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Foto Profile & Info */}
          <div className="space-y-2 sm:space-y-4">
            <div className="aspect-square rounded-xl bg-black/40 flex items-center justify-center">
              <span className="text-zinc-400">Foto Profile</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h4 className="font-medium text-white">
                {employee.name}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                Jabatan: Software Engineer
              </p>
            </div>
          </div>

          {/* Foto Bukti/Lokasi */}
          <div className="space-y-2 sm:space-y-4">
            <div className="aspect-video rounded-xl bg-black/40 flex items-center justify-center">
              <span className="text-zinc-400">
                {employee.status === "Sakit"
                  ? "Surat Dokter"
                  : employee.status === "Cuti"
                  ? "Approval Cuti"
                  : "Foto Lokasi"}
              </span>
            </div>
          </div>

          {/* Informasi Detail */}
          <div className="md:col-span-2 space-y-2 sm:space-y-4 rounded-xl bg-black/40 p-2 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-zinc-400">Lokasi</p>
                <p className="text-xs sm:text-sm text-white">
                  {employee.location}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-400">Status</p>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    employee.status === "Hadir"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : employee.status === "Sakit"
                      ? "bg-red-400/10 text-red-400"
                      : "bg-blue-400/10 text-blue-400"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-400">Check In - Check Out</p>
                <p className="text-xs sm:text-sm text-white">
                  {employee.checkIn} - {employee.checkOut}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-zinc-400">Durasi Kerja</p>
                <p className="text-sm text-white">
                  {employee.duration}
                </p>
              </div>
            </div>
            {employee.notes && (
              <div>
                <p className="text-sm text-zinc-400">Keterangan</p>
                <p className="text-sm text-white">
                  {employee.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
