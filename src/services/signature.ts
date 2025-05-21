/* eslint-disable @typescript-eslint/no-explicit-any */
interface SignatureResponse {
  timestamp: string;
  signature: string;
}

export const getSignature = async (): Promise<SignatureResponse> => {
  try {
    const response = await fetch('/api/signature/signatureGet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Gagal mendapatkan signature:', response.status);
      throw new Error('Gagal mendapatkan signature');
    }

    const data = await response.json();
    console.log(data, "<<<ini data");
    return {
      timestamp: data.signature.timestamp,
      signature: data.signature.signature
    };

  } catch (error) {
    console.error('Error getting signature:', error);
    throw error;
  }
};

export const getSignatureAddUser = async (employeeData: any): Promise<SignatureResponse> => {
  try {
    const response = await fetch('/api/signature/signatureAddUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: employeeData.Username,
        Email: employeeData.Email,
        Password: employeeData.Password,
        RoleId: employeeData.RoleId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mendapatkan signature untuk menambahkan karyawan');
    }

    const data = await response.json();
    return {
      timestamp: data.signature.timestamp,
      signature: data.signature.signature
    };
  } catch (error) {
    console.error('Error getting signature:', error);
    throw error;
  }
};

export const getSignatureAddUserDetail = async (employeeData: any): Promise<SignatureResponse> => {
  try {
    const response = await fetch('/api/signature/signatureAddUserDetail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: employeeData.Username,
        Email: employeeData.Email,
        RoleId: employeeData.RoleId,
        Name: employeeData.Name,
        Departement: employeeData.Departement,
        Divisi: employeeData.Divisi,
        Address: employeeData.Address,
        NoTlp: employeeData.NoTlp,
        LocationCode: employeeData.LocationCode,
        StatusKaryawan: employeeData.StatusKaryawan
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal mendapatkan signature untuk edit profile');
    }

    const data = await response.json();
    return {
      timestamp: data.signature.timestamp,
      signature: data.signature.signature
    };
  } catch (error) {
    console.error('Error getting signature:', error);
    throw error;
  }
};
