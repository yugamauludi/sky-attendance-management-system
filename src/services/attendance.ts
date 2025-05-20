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

        console.log('Signature diterima:', {
            timestamp,
            signature
        });

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