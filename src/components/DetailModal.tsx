import React from "react";
import { EmployeeAttendance } from "@/app/(authenticated)/dashboard/hr/page";
import Image from "next/image";

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
  console.log(employee, "<<employee.pathIn");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(baseUrl, "<<baseUrl");
  

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
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
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
        <div className="gap-4">

          {/* Foto Check-in & Check-out */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video rounded-xl bg-black/40 flex flex-col items-center justify-center">
              <p className="text-xs sm:text-sm text-zinc-400 mb-2">Foto Check-in</p>
              <Image
                width={400}
                height={225}
                src={`${baseUrl}/${employee.pathIn}`}
                alt="Foto Check-in"
                className="rounded-xl object-cover"
              />
            </div>
            <div className="aspect-video rounded-xl bg-black/40 flex flex-col items-center justify-center relative">
              <p className="text-xs sm:text-sm text-zinc-400 mb-2">Foto Check-out</p>
              {employee.pathOut ? (
                <Image
                  width={400}
                  height={225}
                  src={`${baseUrl}/${employee.pathOut}`}
                  alt="Foto Check-out"
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-zinc-400 text-sm">Belum melakukan check-out</span>
                </div>
              )}
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
