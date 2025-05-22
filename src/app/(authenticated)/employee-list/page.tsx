"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import Background from "@/components/Background";
import { deleteEmployee, getAllEmployees } from "@/services/employees";
import { Employee } from "@/types/employee";
import { toast } from "react-hot-toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapApiEmployeeToEmployee = (apiEmployee: any): Employee => {
  return {
    id: apiEmployee.Id,
    name: apiEmployee.Name,
    email: apiEmployee.Email,
    gender: apiEmployee.StatusKaryawan,
    idNumber: apiEmployee.NIK,
    birthPlace: "",
    birthDate: "",
    address: apiEmployee.Address,
    position: apiEmployee.Divisi,
    department: apiEmployee.Departement,
    joinDate: "",
    phoneNumber: apiEmployee.NoTlp,
    location: apiEmployee.LocationCode,
  };
};

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const apiEmployees = await getAllEmployees();
        console.log(apiEmployees, "<<<api employees");

        const mappedEmployees = apiEmployees.map(mapApiEmployeeToEmployee);
        setEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);
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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getAllEmployees();
        const mappedEmployees = data.map(mapApiEmployeeToEmployee);
        setEmployees(mappedEmployees);
        setError(null);
      } catch (error) {
        setError("Gagal memuat data karyawan");
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <Background />
        <div className="text-yellow-400">Memuat data...</div>
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

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />

      <div className="relative h-screen overflow-auto">
        <div className="mx-4 lg:mx-8">
          <h1 className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-2xl font-bold text-transparent">
            Daftar Karyawan
          </h1>

          <div className="rounded-2xl bg-black/40 p-4 sm:p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg mt-4">
            <DataTable
              columns={[
                { key: "id", label: "ID Karyawan" },
                { key: "name", label: "Nama" },
                { key: "position", label: "Jabatan" },
                { key: "department", label: "Departemen" },
                { key: "actions", label: "Aksi" },
              ]}
              data={employees}
              onRowClick={(employee) => setSelectedEmployee(employee)}
              renderCell={renderEmployeeCell}
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
                  <p className="text-sm text-white">{selectedEmployee.id}</p>
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
                <div>
                  <p className="text-xs text-zinc-400">Tempat Lahir</p>
                  <p className="text-sm text-white">
                    {selectedEmployee.birthPlace}
                  </p>
                </div>
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
                <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="text-sm text-white">{selectedEmployee.email}</p>
                </div>
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
                <div>
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
                </div>
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
