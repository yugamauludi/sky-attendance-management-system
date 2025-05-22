import { getSignature } from "./signature";

interface UserProfile {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  department: string;
  gender: string;
  idNumber: string;
  birthPlace: string;
  birthDate: string;
  joinDate: string;
  phoneNumber: string;
  address: string;
  workLocation: string;
  profileImage: string | File;
}

// Interface untuk request body edit profile
export interface EditProfileRequest {
//   Username: string;
  // Email: string;

//   RoleId: number;
  Name: string;
//   Departement: string;
//   Divisi: string;
  Address: string;
  NoTlp: string;
  Photo: File;
//   LocationCode: string;
//   StatusKaryawan: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId) {
      throw new Error('User ID tidak ditemukan');
    }

    const { timestamp, signature } = await getSignature();
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch(`/api/users/profile?id=${userId}`, {
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
      throw new Error(errorData.message || 'Gagal mendapatkan data profil');
    }

    const apiData = await response.json();    
    
    // Transform API response ke format UserProfile
    const transformedData: UserProfile = {
      employeeId: apiData.data.UserId,
      name: apiData.data.Name,
      email: '', // Tidak ada di response API
      position: apiData.data.Divisi,
      department: apiData.data.Departement,
      gender: '', // Tidak ada di response API
      idNumber: apiData.data.NIK,
      birthPlace: '', // Tidak ada di response API
      birthDate: '', // Tidak ada di response API
      joinDate: apiData.data.CreatedAt,
      phoneNumber: apiData.data.NoTlp,
      address: apiData.data.Address,
      workLocation: apiData.data.LocationCode,
      profileImage: '' // Tidak ada di response API
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Fungsi untuk edit profile
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editUserProfile = async (profileData: EditProfileRequest): Promise<any> => {
  try {
    const userId = localStorage.getItem('id');
    if (!userId) {
      throw new Error('User ID tidak ditemukan');
    }

    // const { timestamp, signature } = await getSignatureAddUserDetail(profileData);
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    // Create FormData from the request data
    const formData = new FormData();
    formData.append('Name', profileData.Name);
    formData.append('Address', profileData.Address);
    formData.append('NoTlp', profileData.NoTlp);
    formData.append('Photo', profileData.Photo);

    const response = await fetch(`/api/users/profile/edit?id=${userId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        // 'x-timestamp': timestamp,
        // 'x-signature': signature,
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mengupdate profile');
    }

    const data = await response.json();
    if (data.code !== 210002) {
      throw new Error(data.message || 'Gagal mengupdate profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};