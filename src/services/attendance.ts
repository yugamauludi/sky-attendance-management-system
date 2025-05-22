import { getSignature } from "./signature";

interface SummaryData {
    Karyawan: number;
    Hadir: number;
    Izin: number;
    Sakit: number;
    Cuti: number;
    Absen: number;
}

interface AttendanceData {
  Id: number;
  UserId: string;
  FUllName: string;
  Date: string;
  LocationName: string;
  pathIn: string;
  pathOut: string;
  Address: string;
  InTime: string;
  OutTime: string;
  Duration: number;
  Status: string;
  Description: string;
}

export interface AttendanceResponse {
  code: number;
  message: string;
  data: [
    {
      Summary: SummaryData;
    },
    {
      data: AttendanceData[];
    }
  ];
  meta: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}
export const getAllAttendance = async (page = 1, limit = 10) => {
  try {
    const { timestamp, signature } = await getSignature();
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch(`/api/attendance/get-all?page=${page}&limit=${limit}`, {
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
      throw new Error('Failed to fetch attendance data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

interface CheckInResponse {
  code: number;
  message: string;
  data: {
    Id: string;
    UserId: string;
    InTime: string;
    // ... tambahkan field lain sesuai kebutuhan
  };
}


export const checkInAttendance = async (data: {
  latitude: string;
  longitude: string;
  photo: File;
}): Promise<CheckInResponse> => {
  try {
    const { timestamp, signature } = await getSignature();
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const formData = new FormData();
    formData.append('longitude', data.longitude);
    formData.append('latitude', data.latitude);
    formData.append('photo', data.photo);

    const response = await fetch('/api/attendance/check-in', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal melakukan check-in');
    }

    const responseData: CheckInResponse = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error during check-in:', error);
    throw error;
  }
};

export const checkOutAttendance = async ({
  latitude,
  longitude,
  photo
}: {
  latitude: string;
  longitude: string;
  photo: File;
}) => {
  try {
    const formData = new FormData();
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('photo', photo);

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const { timestamp, signature } = await getSignature();

    const response = await fetch('/api/attendance/check-out', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-timestamp': timestamp,
        'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during check-out:', error);
    throw error;
  }
};


export interface AttendanceDetailResponse {
  code: number;
  message: string;
  data: {
    id: number;
    userId: string;
    checkIn: string;
    checkOut: string | null;
    duration: string | null;
    status: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    photo: {
      checkIn: string;
      checkOut: string | null;
    };
    notes: string | null;
  };
}

export const getAttendanceDetail = async (id: string): Promise<AttendanceDetailResponse> => {
  try {
    const response = await fetch(`/api/attendance/detail/${id}`);

    if (!response.ok) {
      throw new Error("Gagal mengambil detail attendance");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching attendance detail:", error);
    throw error;
  }
};
