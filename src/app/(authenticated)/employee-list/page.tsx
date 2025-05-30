/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Background from "@/components/Background";
import {
  deleteEmployee,
  getAllEmployees,
  getEmployeeDetail,
} from "@/services/employees";
import { Employee } from "@/types/employee";
import { toast } from "react-hot-toast";

const mapApiEmployeeToEmployee = (apiEmployee: any): Employee => {
  return {
    id: apiEmployee.Id,
    userId: apiEmployee.NIK,
    name: apiEmployee.Name,
    gender: apiEmployee.StatusKaryawan,
    idNumber: apiEmployee.KTPNo,
    address: apiEmployee.Address,
    position: apiEmployee.Divisi,
    department: apiEmployee.Departement,
    phoneNumber: apiEmployee.NoTlp,
    location: apiEmployee.LocationCode,
    employeeStatus: apiEmployee.StatusKaryawan,
    birthDate: apiEmployee.DOB,
    nik: apiEmployee.NIK,
  };
};

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((employee) => employee.id !== id));
      setIsConfirmationOpen(false);
      toast.success("Data karyawan berhasil dihapus");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Gagal menghapus data karyawan");
    }
  };

  const openConfirmationModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmationOpen(true);
  };

  const renderEmployeeCell = (employee: Employee, key: string) => {
    switch (key) {
      case "actions":
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openConfirmationModal(employee);
              }}
              className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 cursor-pointer"
            >
              Hapus
            </button>
          </div>
        );
      default:
        return employee[key as keyof Employee] || "-";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEmployees(currentPage, itemsPerPage);

        const mappedEmployees = data.data.map(mapApiEmployeeToEmployee);
        setEmployees(mappedEmployees);
        setPagination(data.meta);
        setError(null);
      } catch (error) {
        setError("Gagal memuat data karyawan");
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [itemsPerPage, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Background />
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-yellow-400 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Background />
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const handleRowClick = async (employee: Employee) => {
    try {
      const detailResponse = await getEmployeeDetail(employee.id);
      const detailData = detailResponse.data;

      // Update employee detail dengan data dari API
      const updatedEmployee: Employee = {
        id: detailData.Id,
        userId: detailData.UserId,
        name: detailData.Name,
        gender: detailData.Gender,
        idNumber: detailData.KTPNo,
        address: detailData.Address,
        position: detailData.Divisi,
        department: detailData.Departement,
        phoneNumber: detailData.NoTlp,
        location: detailData.LocationCode,
        employeeStatus: detailData.StatusKaryawan,
        birthDate: detailData.DOB,
        nik: detailData.NIK,
      };

      setSelectedEmployee(updatedEmployee);
    } catch (error) {
      console.error("Error fetching employee detail:", error);
      toast.error("Gagal memuat detail karyawan");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />

      <div className="relative h-screen overflow-auto">
        <div className="mx-4 lg:mx-8">
          <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
            Daftar Karyawan
          </h1>

          <div className="rounded-2xl bg-black/40 p-4 sm:p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg mt-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-zinc-400">Tampilkan:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-zinc-400">data per halaman</span>
              </div>
            </div>
            <DataTable
              columns={[
                { key: "userId", label: "ID Karyawan" },
                { key: "name", label: "Nama" },
                { key: "position", label: "Jabatan" },
                { key: "department", label: "Departemen" },
                { key: "actions", label: "Aksi" },
              ]}
              data={employees}
              onRowClick={handleRowClick}
              renderCell={renderEmployeeCell}
              currentPage={currentPage}
              totalPages={(pagination as any).totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={(pagination as any).totalItems}
            />
          </div>
        </div>
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 max-w-3xl w-full mx-4 space-y-4 ring-1 ring-yellow-500/20 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-400">
                  Detail Karyawan
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Data lengkap karyawan
                </p>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-zinc-400">ID Karyawan</p>
                  <p className="text-sm text-white">{selectedEmployee.nik}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Nama Lengkap</p>
                  <p className="text-sm text-white">{selectedEmployee.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Jenis Kelamin</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.gender}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Nomor KTP</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.idNumber}
                  </p>
                </div>
                {/* <div>
                  <p className="text-xs text-zinc-400">Tempat Lahir</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.birthPlace}
                  </p>
                </div> */}
                <div>
                  <p className="text-xs text-zinc-400">Tanggal Lahir</p>
                  <p className="text-sm text-white">
                    {new Date(selectedEmployee.birthDate).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="text-sm text-white">{selectedEmployee.email}</p>
                </div> */}
                <div>
                  <p className="text-xs text-zinc-400">Alamat</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Jabatan</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.position}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Departemen</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.department}
                  </p>
                </div>
                {/* <div>
                  <p className="text-xs text-zinc-400">Tanggal Bergabung</p>
                  <p className="text-sm text-white">
                    {new Date(selectedEmployee.joinDate).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div> */}
                <div>
                  <p className="text-xs text-zinc-400">Nomor Telepon</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={() => handleDelete(employeeToDelete?.id || "")}
        onCancel={() => setIsConfirmationOpen(false)}
        message={`Apakah Anda yakin ingin menghapus karyawan ${employeeToDelete?.name}?`}
      />
    </div>
  );
}
