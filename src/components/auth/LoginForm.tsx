"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login gagal:", data.error);
        return;
      }

      // Simpan token dan role ke cookies daripada localStorage
      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `userRole=${data.role}; path=/`;

      console.log("Login berhasil!");
      console.log("Role:", data.role);

      if (data.role === "hr") {
        router.replace("/dashboard/hr");
      } else {
        router.replace("/dashboard");
      }

    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-white p-6 shadow-lg">
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                width={80}
                height={80}
                priority
              />
            </div>
          </div>
        </div>

        <div className="px-8 pt-20 pb-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">
            Selamat Datang
          </h2>
          <p className="mb-8 text-center text-gray-600">
            Masuk untuk melanjutkan
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Image
                    src="/images/user_icon.png"
                    alt="User Icon"
                    width={20}
                    height={20}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="peer w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 outline-none transition-all focus:border-blue-600 text-gray-900 placeholder-gray-400"
                  placeholder=""
                  value={credentials.email}
                  onChange={handleChange}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-3 z-10 transform bg-white px-1 text-sm text-gray-700 transition-all peer-placeholder-shown:left-10 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600 peer-[&:not(:placeholder-shown)]:-translate-y-7 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:left-4"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Image
                    src="/images/lock_icon.png"
                    alt="Lock Icon"
                    width={20}
                    height={20}
                    className="text-gray-500"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="peer w-full rounded-lg border border-gray-300 pl-10 pr-10 py-3 outline-none transition-all focus:border-blue-600 text-gray-900 placeholder-gray-400"
                  placeholder=""
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <Image
                      src="/images/eye_open.png"
                      alt="Hide password"
                      width={20}
                      height={20}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  ) : (
                    <Image
                      src="/images/close_eye.png"
                      alt="Show password"
                      width={20}
                      height={20}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  )}
                </button>
                <label
                  htmlFor="password"
                  className="absolute left-4 top-3 z-10 transform bg-white px-1 text-sm text-gray-700 transition-all peer-placeholder-shown:left-10 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600 peer-[&:not(:placeholder-shown)]:-translate-y-7 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:left-4"
                >
                  Kata Sandi
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Ingat Saya</span>
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
