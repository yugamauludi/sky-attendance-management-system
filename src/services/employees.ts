/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSignature, getSignatureAddUser } from "./signature";

interface Employee {
  Id: string;
  UserId: string;
  NIK: string;
  Name: string;
  Departement: string;
  Divisi: string;
  Address: string;
  NoTlp: string;
  LocationCode: string;
  StatusKaryawan: string;
  Status: string;
  CreatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
  UpdatedBy: string | null;
  DeletedAt: string | null;
  DeletedBy: string | null;
  Record: string;
}

interface EmployeeResponse {
  code: number;
  message: string;
  data: Employee[];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}


export const getAllEmployees = async (page = 1, limit = 10): Promise<EmployeeResponse> => {
  try {
    const { timestamp, signature } = await getSignature();

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch(`/api/detail-users/get-all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      console.error('Error response:', response.status);
      const errorData = await response.json();
      console.error('Error data:', errorData);
      throw new Error(errorData.message || 'Gagal mendapatkan daftar karyawan');
    }

    const responseData: EmployeeResponse = await response.json();

    if (!responseData.data || !Array.isArray(responseData.data)) {
      throw new Error('Format data tidak valid');
    }

    return responseData;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    // Dapatkan signature terlebih dahulu
    const { timestamp, signature } = await getSignature();

    const response = await fetch(`/api/users/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menghapus karyawan');
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const addEmployee = async (employeeData: any) => {
  try {
    // Dapatkan signature terlebih dahulu
    const { timestamp, signature } = await getSignatureAddUser(employeeData);

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menambahkan karyawan');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};


interface EmployeeDetailResponse {
  code: number;
  status: string;
  message: string;
  data: {
    Id: string;
    UserId: string;
    KTPNo: string;
    NIK: string;
    Name: string;
    DOB: string;
    Gender: string;
    JoinDate: string;
    Departement: string;
    Divisi: string;
    Address: string;
    NoTlp: string;
    LocationCode: string;
    StatusKaryawan: string;
    Status: string;
    CreatedBy: string;
    CreatedAt: string;
    UpdatedAt: string;
    UpdatedBy: string | null;
    DeletedAt: string | null;
    DeletedBy: string | null;
    Record: string;
  };
}

export const getEmployeeDetail = async (id: string): Promise<EmployeeDetailResponse> => {
  try {
    const { timestamp, signature } = await getSignature();
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch(`/api/users/profile?id=${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mendapatkan detail karyawan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee detail:', error);
    throw error;
  }
};