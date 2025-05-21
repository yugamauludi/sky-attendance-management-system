import { getSignature } from "./signature";

interface AttendanceData {
    Id: number;
    UserId: string;
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

interface AttendanceResponse {
    code: number;
    message: string;
    data: AttendanceData[];
    meta: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}
export const getAllAttendance = async (): Promise<AttendanceData[]> => {
    try {
        // Dapatkan signature terlebih dahulu
        const { timestamp, signature } = await getSignature();

        const response = await fetch('/api/attendance/get-all', {
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

        const responseData: AttendanceResponse = await response.json();
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
