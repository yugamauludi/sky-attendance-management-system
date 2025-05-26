/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Background from "@/components/Background";
import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import {
  checkInAttendance,
  checkOutAttendance,
  getAttendanceDetail,
} from "@/services/attendance";
import { formatDateTime } from "@/utiils/dateFormatter";

interface AttendanceStatus {
  status: "present" | "absent" | "not_yet";
  checkIn?: string;
  checkOut?: string;
  duration?: string;
  location?: {
    address: string;
  };
}

export default function DashboardPage() {
  const [attendance, setAttendance] = useState<AttendanceStatus>({
    status: "not_yet",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const handleCheckIn = async () => {
    try {
      setIsCheckingIn(true);
      const currentPosition = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      setPosition(currentPosition);
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      toast.error("Gagal mengakses kamera atau lokasi");
    }
  };

  const handleCheckOut = async () => {
    try {
      const currentPosition = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      setPosition(currentPosition);
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error during check-out:", error);
      toast.error("Gagal mengakses kamera atau lokasi");
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setIsDataLoading(true);
      const attendanceDetail = await getAttendanceDetail();
      setAttendance({
        status:
          attendanceDetail?.data?.Status === "Hadir"
            ? "present"
            : attendanceDetail?.data?.Status === "Tidak Hadir"
            ? "absent"
            : "not_yet",
        checkIn: formatDateTime(attendanceDetail?.data?.InTime),
        checkOut: formatDateTime(attendanceDetail?.data?.OutTime),
        duration: attendanceDetail?.data?.Duration
          ? `${attendanceDetail?.data?.Duration} jam`
          : undefined,
        location: {
          address: `${attendanceDetail?.data?.LocationName}, ${attendanceDetail?.data?.Address}`,
        },
      });
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleCapturePhoto = async () => {
    try {
      if (!position || !videoRef.current) return;
      setIsLoading(true);

      // Ambil foto
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      });

      // Buat file dari blob
      const photoFile = new File([blob], "check-in-photo.jpg", {
        type: "image/jpeg",
      });

      // Kirim data check-in ke API
      const response = await checkInAttendance({
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
        photo: photoFile,
      });

      if (response.code === 250002) {
        // Set pesan modal setelah check-in berhasil
        setModalMessage("Selamat bekerja! Anda telah berhasil check-in.");
        setIsModalOpen(true);
        await fetchAttendanceData();
      }
      // Matikan kamera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      setShowCamera(false);
    } catch (error: any) {
      // Tambahkan type any untuk mengakses message
      console.error("Error during photo capture:", error);
      if (error.message === "Kamu sudah lakukan absen masuk") {
        setModalMessage("Kamu sudah melakukan absen masuk");
      } else {
        setModalMessage("Gagal melakukan check-in. Silakan coba lagi.");
      }
      setIsModalOpen(true);
      setShowCamera(false);
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureCheckOutPhoto = async () => {
    try {
      if (!position || !videoRef.current) return;
      setIsLoading(true);

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      });

      // Buat file dari blob
      const photoFile = new File([blob], "check-out-photo.jpg", {
        type: "image/jpeg",
      });

      // Hitung durasi kerja
      const today = new Date().toISOString().split("T")[0];
      const checkInTime = new Date(`${today} ${attendance.checkIn}`);
      const checkOutTime = new Date();
      let durationMs = checkOutTime.getTime() - checkInTime.getTime();

      if (durationMs < 0) {
        durationMs += 24 * 60 * 60 * 1000;
      }

      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
      const durationStr = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Kirim data check-out ke API
      const response = await checkOutAttendance({
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
        photo: photoFile,
      });

      if (response.code === 250003) {
        // Update state setelah check-out berhasil
        setAttendance((prev) => ({
          ...prev,
          checkOut: new Date()
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })
            .replace(/\./g, ":"),
          duration: durationStr,
          location: {
            address: "Akan diisi dari hasil geocoding",
          },
        }));

        // Set pesan modal setelah check-out berhasil
        setModalMessage(
          "Terima kasih atas kerja keras Anda hari ini! Anda telah berhasil check-out."
        );
        setIsModalOpen(true);
        toast.success("Berhasil melakukan check-out");
        await fetchAttendanceData();
      }

      // Matikan kamera
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
      setShowCamera(false);
    } catch (error) {
      console.error("Error during check-out photo capture:", error);
      toast.error("Gagal melakukan check-out");
      setModalMessage("Gagal melakukan check-out. Silakan coba lagi.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Geometric Accents - Fixed Position */}
      <Background />

      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Scrollable Content Container */}
      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-4xl space-y-6 p-4 pb-2 sm:p-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
                  Dashboard Karyawan
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Selamat datang kembali!
                </p>
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
              <div className="flex space-x-4">
                <button
                  className="px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-black"
                  onClick={handleCheckIn}
                >
                  Check In
                </button>
                <button
                  className="px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    setShowConfirmation(true);
                    setIsCheckingIn(false);
                  }}
                >
                  Check Out
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-b from-black/60 to-black/40 p-5 ring-1 ring-yellow-500/20">
                {isDataLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-yellow-400 text-sm">Memuat data...</p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="rounded-xl bg-gradient-to-b from-black/60 to-black/40 p-5 ring-1 ring-yellow-500/20">
                <h3 className="text-sm font-medium text-yellow-400">
                  Lokasi Absen
                </h3>
                {isDataLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-yellow-400 text-sm">Memuat data...</p>
                  </div>
                ) : (
                  attendance.location ? (
                    <>
                      <p className="mt-3 text-xs text-zinc-400">
                        {attendance.location.address}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-400">
                      Belum ada data lokasi
                    </p>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Card Pengajuan Cuti */}
          {/* <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-yellow-400">
                  Pengajuan Cuti
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Ajukan cuti atau lihat status pengajuan cuti Anda
                </p>
              </div>
              <Link
                href="/leave-request"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
              >
                Ajukan Cuti
              </Link>
            </div>
          </div> */}
        </div>
      </div>
      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/60 p-4 sm:p-6 rounded-2xl backdrop-blur-lg ring-1 ring-yellow-500/20 w-full h-full sm:h-auto sm:max-w-2xl mx-auto flex flex-col">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">
              Ambil Foto Absen
            </h3>
            <div className="relative flex-1 sm:aspect-video w-full overflow-hidden rounded-lg bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ transform: "scaleX(-1)" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-yellow-400 text-sm">Sedang memproses...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => {
                  if (videoRef.current?.srcObject) {
                    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                    tracks.forEach((track) => track.stop());
                  }
                  setShowCamera(false);
                }}
                className="px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={isCheckingIn ? handleCapturePhoto : handleCaptureCheckOutPhoto}
                className="px-4 py-2 text-sm font-medium bg-yellow-500 text-black hover:bg-yellow-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : !isCheckingIn ? "Ambil Foto & Check Out" : "Ambil Foto & Check In"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Pop-up */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black/60 p-4 sm:p-6 rounded-2xl backdrop-blur-lg ring-1 ring-yellow-500/20 w-full sm:max-w-md mx-auto">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">
              Konfirmasi Check Out
            </h3>
            <p className="text-sm text-gray-300">
              Apakah Anda yakin ingin melakukan check out? Pastikan semua
              pekerjaan Anda telah selesai.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  handleCheckOut();
                }}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
              >
                Ya, Check Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pop-up */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
}
