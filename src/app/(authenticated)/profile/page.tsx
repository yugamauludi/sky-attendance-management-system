"use client";

import { useEffect, useState } from "react";
import Background from "@/components/Background";
import Image from "next/image";
import { logout } from "@/services/auth";
import { editUserProfile, getUserProfile } from "@/services/profile";
import toast from "react-hot-toast";

interface UserProfile {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  gender: string;
  idNumber: string;
  birthPlace: string;
  birthDate: string;
  joinDate: string;
  phoneNumber: string;
  address: string;
  workLocation: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    employeeId: "",
    name: "",
    email: "",
    position: "",
    department: "",
    gender: "",
    idNumber: "",
    birthPlace: "",
    birthDate: "",
    joinDate: "",
    phoneNumber: "",
    address: "",
    workLocation: "",
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  // setProfile(editedProfile);
  // setIsEditing(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Membuat preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedImage) {
        console.log("Uploading image:", selectedImage);
      }

      // Persiapkan data untuk API
      const profileData = {
        Email: editedProfile.email,
        Name: editedProfile.name,
        Address: editedProfile.address,
        NoTlp: editedProfile.phoneNumber,
      };

      // Panggil API untuk update profil
      await editUserProfile(profileData);

      // Update state lokal
      setProfile(editedProfile);
      setIsEditing(false);

      // Tampilkan notifikasi sukses
      toast.success("Profil berhasil diperbarui");
    } catch (error) {
      console.error("Gagal menyimpan perubahan:", error);
      toast.error("Gagal memperbarui profil. Silakan coba lagi.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setPreviewImage(null);
    setEditedProfile(profile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />

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
                  Profil Saya
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Informasi data diri
                </p>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Edit Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-40 w-40 group">
                  <div className="h-40 w-40 rounded-full bg-gray-700 overflow-hidden">
                    <Image
                      src={previewImage || "/images/profile-photo.png"}
                      alt="Profile"
                      width={160}
                      height={160}
                      className="rounded-full object-cover"
                    />
                  </div>

                  {isEditing && (
                    <label
                      htmlFor="profile-image"
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 mx-auto text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm text-white">Ubah Foto</span>
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {profile.name}
                </h2>
                <p className="text-sm text-yellow-400">{profile.position}</p>
              </div>

              {/* Profile Details */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-medium text-yellow-400 mb-4">
                  Informasi Pribadi
                </h3>

                <div className="space-y-4">
                  {isEditing ? (
                    // Edit Mode
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            ID Karyawan
                          </label>
                          <input
                            type="text"
                            name="employeeId"
                            value={editedProfile.employeeId}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white opacity-75 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editedProfile.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Jenis Kelamin
                          </label>
                          <select
                            name="gender"
                            value={editedProfile.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Nomor KTP
                          </label>
                          <input
                            type="text"
                            name="idNumber"
                            value={editedProfile.idNumber}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Tempat Lahir
                          </label>
                          <input
                            type="text"
                            name="birthPlace"
                            value={editedProfile.birthPlace}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Tanggal Lahir
                          </label>
                          <input
                            type="text"
                            name="birthDate"
                            value={editedProfile.birthDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={editedProfile.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Alamat
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={editedProfile.address}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Jabatan
                          </label>
                          <input
                            type="text"
                            name="position"
                            value={editedProfile.position}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white opacity-75 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Departemen
                          </label>
                          <input
                            type="text"
                            name="department"
                            value={editedProfile.department}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white opacity-75 cursor-not-allowed"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Tanggal Bergabung
                          </label>
                          <input
                            type="text"
                            name="joinDate"
                            value={editedProfile.joinDate}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white opacity-75 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-1">
                            Nomor Telepon
                          </label>
                          <input
                            type="text"
                            name="phoneNumber"
                            value={editedProfile.phoneNumber}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-yellow-500/20 bg-black/20 px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">ID Karyawan</p>
                          <p className="text-white">{profile.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Nama Lengkap</p>
                          <p className="text-white">{profile.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">Jenis Kelamin</p>
                          <p className="text-white">{profile.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Nomor KTP</p>
                          <p className="text-white">{profile.idNumber}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">Tempat Lahir</p>
                          <p className="text-white">{profile.birthPlace}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Tanggal Lahir</p>
                          <p className="text-white">{profile.birthDate}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">Email</p>
                          <p className="text-white">{profile.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Alamat</p>
                          <p className="text-white">{profile.address}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">Jabatan</p>
                          <p className="text-white">{profile.position}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Departemen</p>
                          <p className="text-white">{profile.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-zinc-400">
                            Tanggal Bergabung
                          </p>
                          <p className="text-white">{profile.joinDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Nomor Telepon</p>
                          <p className="text-white">{profile.phoneNumber}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
