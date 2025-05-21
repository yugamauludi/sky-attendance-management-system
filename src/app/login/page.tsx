"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

interface LoginCredentials {
  identifier: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await login(credentials);

      document.cookie = `token=${data.token}; path=/`;
      document.cookie = `userRole=${data.role}; path=/`;
      localStorage.setItem("username", data.username);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);

      if (data.role === "hr") {
        router.replace("/dashboard/hr");
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Terjadi kesalahan saat login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a1a1a]">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-black/40 shadow-xl ring-1 ring-yellow-500/20">
        <div className="relative h-32 bg-gradient-to-r from-yellow-400 to-yellow-600">
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <div className="rounded-full bg-black/40 p-6 shadow-lg ring-1 ring-yellow-500/20">
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
          <h2 className="mb-2 text-center text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Selamat Datang
          </h2>
          <p className="mb-8 text-center text-zinc-400">
            Masuk untuk melanjutkan
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Image
                    src="/images/user_icon.png"
                    alt="User Icon"
                    width={20}
                    height={20}
                    className="text-yellow-400 brightness-0 invert sepia hue-rotate-[20deg] saturate-[1000%]"
                  />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  className="peer w-full rounded-lg border border-yellow-500/20 bg-black/20 pl-10 pr-4 py-3 outline-none transition-all focus:border-yellow-500 text-yellow-400 placeholder-zinc-400 autofill-style"
                  placeholder=""
                  value={credentials.identifier}
                  onChange={handleChange}
                />
                <label
                  htmlFor="identifier"
                  className="absolute left-4 top-3 z-10 transform bg-transparent px-1 text-sm text-zinc-400 transition-all peer-placeholder-shown:left-10 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-yellow-400 peer-[&:not(:placeholder-shown)]:-translate-y-7 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:left-4"
                >
                  Username
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Image
                    src="/images/lock_icon.png"
                    alt="Lock Icon"
                    width={20}
                    height={20}
                    className="text-yellow-400 brightness-0 invert sepia hue-rotate-[20deg] saturate-[1000%]"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="peer w-full rounded-lg border border-yellow-500/20 bg-black/20 pl-10 pr-4 py-3 outline-none transition-all focus:border-yellow-500 text-yellow-400 placeholder-zinc-400 autofill-style"
                  placeholder=""
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                >
                  {showPassword ? (
                    <Image
                      src="/images/eye_open.png"
                      alt="Hide password"
                      width={20}
                      height={20}
                      className="text-yellow-400 brightness-0 invert sepia hue-rotate-[20deg] saturate-[1000%]"
                    />
                  ) : (
                    <Image
                      src="/images/close_eye.png"
                      alt="Show password"
                      width={20}
                      height={20}
                      className="text-yellow-400 brightness-0 invert sepia hue-rotate-[20deg] saturate-[1000%]"
                    />
                  )}
                </button>
                <label
                  htmlFor="password"
                  className="absolute left-4 top-3 z-10 transform bg-transparent px-1 text-sm text-zinc-400 transition-all peer-placeholder-shown:left-10 peer-focus:left-4 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-yellow-400 peer-[&:not(:placeholder-shown)]:-translate-y-7 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:left-4"
                >
                  Kata Sandi
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input
                  type="checkbox"
                  name="remember"
                  checked={credentials.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-yellow-500/20 bg-black/20 text-yellow-500 focus:ring-yellow-500"
                />
                <span>Ingat Saya</span>
              </label>
              <a
                href="#"
                className="text-yellow-400 hover:text-yellow-500 hover:underline"
              >
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full transform rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 py-3 text-sm font-medium text-black transition-all hover:from-yellow-500 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
