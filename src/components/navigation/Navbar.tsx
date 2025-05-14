"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isHR, setIsHR] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // TODO: Implementasi pengecekan role yang sebenarnya dari cookie/session
    const userRole = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userRole="))
      ?.split("=")[1];
    
    setIsHR(userRole === "hr");
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Navbar Desktop Only */}
      <nav className="hidden sm:block bg-black/40 backdrop-blur-lg shadow-md border-b border-yellow-500/20">
        <div className="mx-4 lg:mx-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link 
                  href={isHR ? "/dashboard/hr" : "/dashboard"} 
                  className="text-xl font-bold text-yellow-400"
                >
                  Sky AMS
                </Link>
              </div>
              <div className="sm:ml-6 sm:flex sm:space-x-8">
                {isHR ? (
                  <>
                    <Link
                      href="/dashboard/hr"
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        isActive("/dashboard/hr")
                          ? "border-yellow-400 text-yellow-400"
                          : "border-transparent text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                      }`}
                    >
                      Dashboard HR
                    </Link>
                    <Link
                      href="/dashboard"
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        isActive("/dashboard")
                          ? "border-yellow-400 text-yellow-400"
                          : "border-transparent text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                      }`}
                    >
                      Kehadiran
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      isActive("/dashboard")
                        ? "border-yellow-400 text-yellow-400"
                        : "border-transparent text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
            
            {/* Profile Menu Desktop */}
            <div className="sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 rounded-full bg-black/20 p-1 text-gray-300 hover:text-yellow-400"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-700">
                    <Image
                      src="/images/user_icon.png"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-yellow-500/20 bg-black/60 backdrop-blur-lg sm:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around">
          {isHR ? (
            <>
              <Link
                href="/dashboard/hr"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-300 hover:text-yellow-400"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard HR</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-300 hover:text-yellow-400"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Kehadiran</span>
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-300 hover:text-yellow-400"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
          )}

          <Link
            href="/profile"
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-300 hover:text-yellow-400"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profil</span>
          </Link>
        </div>
      </div>
    </>
  );
}