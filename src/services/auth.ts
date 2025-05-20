interface LoginCredentials {
  identifier: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  token: string;
  role: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login gagal");
    }    

    return data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Terjadi kesalahan saat menghubungi server");
  }
};

export const logout = async () => {
  try {
    // Hapus cookie dengan parameter lengkap
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; Secure; SameSite=Strict";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; Secure; SameSite=Strict";
    
    // Hapus token dari localStorage jika ada
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    // Clear session storage juga
    sessionStorage.clear();
    
    // Tunggu sebentar untuk memastikan semua cookie terhapus
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force reload halaman untuk membersihkan state
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Gagal melakukan logout');
  }
};