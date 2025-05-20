/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSignature, getSignatureAddUser } from "./signature";

interface Role {
  Name: string;
}

interface Employee{
  Id: string;
  Username: string;
  Email: string;
  RoleId: number;
  CreatedAt: string;
  UpdatedAt: string;
  Record: string;
  role: Role;
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


export const getAllEmployees = async (): Promise<Employee[]> => {
  try {    
    // Dapatkan signature terlebih dahulu
    const { timestamp, signature } = await getSignature();
    
    console.log('Signature diterima:', {
      timestamp,
      signature
    });

    const response = await fetch('/api/users/get-all', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature
      },
    });

    if (!response.ok) {
      console.error('Error response:', response.status);
      const errorData = await response.json();
      console.error('Error data:', errorData);
      throw new Error(errorData.message || 'Gagal mendapatkan daftar karyawan');
    }

    const responseData: EmployeeResponse = await response.json();
    console.log('Response data:', responseData);

    if (!responseData.data || !Array.isArray(responseData.data)) {
      throw new Error('Format data tidak valid');
    }

    return responseData.data;
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
    console.log(employeeData, "<<<<employeeData");
    
    // Dapatkan signature terlebih dahulu
    const { timestamp, signature } = await getSignatureAddUser(employeeData);

    const response = await fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature
      },
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