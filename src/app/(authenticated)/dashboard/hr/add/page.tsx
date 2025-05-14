"use client";

import { useState } from "react";
import Background from "@/components/Background";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';

interface NewEmployee {
  name: string;
  email: string;
  position: string;
  employeeType: "inhouse" | "vendor";
  joinDate: string;
}

export default function AddEmployeePage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<NewEmployee>({
    name: "",
    email: "",
    position: "",
    employeeType: "inhouse",
    joinDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save employee data
      console.log("Data karyawan baru:", employee);
      router.push("/dashboard/hr");
    } catch (error) {
      console.error("Gagal menambahkan karyawan:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      if (!evt.target?.result) return;
      
      const workbook = XLSX.read(evt.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      // TODO: Implementasi API untuk bulk import
      console.log('Data bulk import:', data);
    };
    
    reader.readAsBinaryString(file);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />

      <div className="relative h-screen overflow-auto">
        <div className="mx-auto max-w-2xl space-y-6 p-4 pb-24 sm:p-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
              Tambah Karyawan Baru
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Isi formulir di bawah untuk menambahkan data karyawan baru
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-black/40 p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-yellow-400 mb-2">Upload Data Karyawan (Bulk)</h2>
              <p className="text-sm text-zinc-400 mb-4">
                Upload file Excel untuk menambahkan banyak karyawan sekaligus. Format kolom: Nama, Divisi, Lokasi
              </p>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-500/20 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-black/30">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-yellow-400">
                      <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                    </p>
                    <p className="text-xs text-zinc-400">XLSX, XLS (MAX. 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-yellow-500/10 pt-6">
              <h2 className="text-lg font-medium text-yellow-400 mb-4">
                Atau Tambah Karyawan Satu Per Satu
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {" "}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={employee.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={employee.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="contoh@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Jabatan
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      required
                      value={employee.position}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Masukkan jabatan"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="employeeType"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Tipe Karyawan
                    </label>
                    <select
                      id="employeeType"
                      name="employeeType"
                      required
                      value={employee.employeeType}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                      <option value="inhouse">Inhouse</option>
                      <option value="vendor">Vendor (DW)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="joinDate"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Tanggal Bergabung
                    </label>
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      required
                      value={employee.joinDate}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
