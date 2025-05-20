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