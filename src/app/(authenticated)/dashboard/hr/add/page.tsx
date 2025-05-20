"use client";

import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import Background from "@/components/Background";
import { useRouter } from "next/navigation";
import * as XLSX from 'xlsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addEmployee } from "@/services/employees";

interface NewEmployee {
  name?: string;
  userName: string; // tetap required
  password: string; // tetap required
  email: string; // menjadi opsional
  position?: string; // menjadi opsional
  employeeType?: "inhouse" | "vendor"; // menjadi opsional
  joinDate?: Date | null; // menjadi opsional
}

const employeeTypes = [
  { id: 'inhouse', name: 'Inhouse' },
  { id: 'vendor', name: 'Vendor (DW)' },
];

export default function AddEmployeePage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<NewEmployee>({
    name: "",
    userName: "",
    password: "",
    email: "",
    position: "",
    employeeType: "inhouse",
    joinDate: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEmployee({
        Username: employee.userName,
        Email: employee.email,
        Password: employee.password,
        RoleId: 1, // Sesuaikan dengan role yang diinginkan
        // name: employee.name,
        // position: employee.position,
        // employeeType: employee.employeeType,
        // joinDate: employee.joinDate ? employee.joinDate.toISOString().split('T')[0] : null,
      });
      
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

  const handleDateChange = (date: Date | null) => {
    setEmployee(prev => ({
      ...prev,
      joinDate: date
    }));
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
                Upload file Excel untuk menambahkan banyak karyawan sekaligus. Format kolom: Nama, Divisi, Password
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
                      value={employee.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-yellow-400 after:content-['*'] after:ml-0.5 after:text-red-500"
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
                      htmlFor="userName"
                      className="block text-sm font-medium text-yellow-400 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      required
                      value={employee.userName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Masukkan username untuk login SIO"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-yellow-400 after:content-['*'] after:ml-0.5 after:text-red-500"
                    >
                      Password
                    </label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      required
                      value={employee.password}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholder="Masukkan password untuk login SIO"
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
                    <Listbox value={employee.employeeType} onChange={(value) => setEmployee(prev => ({ ...prev, employeeType: value }))}>
                      <div className="relative mt-1">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-yellow-500/20 bg-black/20 py-2 pl-3 pr-10 text-left text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                          <span className="block truncate">
                            {employeeTypes.find(type => type.id === employee.employeeType)?.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-yellow-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black/90 py-1 text-base shadow-lg ring-1 ring-yellow-500/20 focus:outline-none">
                            {employeeTypes.map((type) => (
                              <Listbox.Option
                                key={type.id}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-yellow-500/10 text-yellow-400' : 'text-white'
                                  }`
                                }
                                value={type.id}
                              >
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium text-yellow-400' : 'font-normal'}`}>
                                      {type.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-400">
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>

                  <div>
                    <label
                      htmlFor="joinDate"
                      className="block text-sm font-medium text-yellow-400"
                    >
                      Tanggal Bergabung
                    </label>
                    <DatePicker
                      selected={employee.joinDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      className="mt-1 block w-full rounded-lg border border-yellow-500/20 bg-black/20 px-4 py-2 text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                      placeholderText="Pilih tanggal"
                      isClearable
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg border border-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 cursor-pointer"
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
