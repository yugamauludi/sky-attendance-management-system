import Cookies from 'js-cookie';
interface LoginCredentials {
  identifier: string;
  password: string;
  remember: boolean;
}

interface LoginResponse {
  token: string;
  role: string;
  username: string;
  id: string;
  roleId: string;
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
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    sessionStorage.clear();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error('Gagal melakukan logout');
  }
};