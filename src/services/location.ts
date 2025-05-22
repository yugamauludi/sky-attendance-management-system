/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSignature } from "./signature";

export interface Location {
    location_name: string;
    location_code: string;
}

interface LocationResponse {
    code: number;
    message: string;
    data: Location[];
    meta: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}

export const getAllLocations = async (): Promise<Location[]> => {
    try {
        const { timestamp, signature } = await getSignature();

        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

        const response = await fetch('/api/location/get-all', {
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
            throw new Error(errorData.message || 'Gagal mendapatkan daftar lokasi');
        }

        const responseData: LocationResponse = await response.json();
        console.log('Response data:', responseData);

        if (!responseData.data || !Array.isArray(responseData.data)) {
            throw new Error('Format data tidak valid');
        }

        return responseData.data;
    } catch (error) {
        console.error('Error fetching location:', error);
        throw error;
    }
};

export const addLocation = async (locationData: any) => {
    try {
      // Dapatkan signature terlebih dahulu
      const { timestamp, signature } = await getSignature();
      
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
      
      const response = await fetch('/api/location/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-timestamp': timestamp,
          'x-signature': signature,
          'Authorization': `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(locationData)
      });
      console.log("RESPONSE: ", response);
  
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