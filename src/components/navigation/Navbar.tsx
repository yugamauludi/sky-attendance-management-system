"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/login");
  };

  return (
    <>
      {/* Navbar Desktop Only */}
      <nav className="hidden sm:block bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  Sky AMS
                </Link>
              </div>
              <div className="sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/attendance"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Kehadiran
                </Link>
              </div>
            </div>
            
            {/* Profile Menu Desktop */}
            <div className="sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 rounded-full bg-white p-1 text-gray-700 hover:text-gray-900"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200">
                    <Image
                      src="/images/user_icon.png"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 block border-t bg-white sm:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around">
          <Link
            href="/dashboard"
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/attendance"
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Kehadiran</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex flex-col items-center px-3 py-2 text-xs font-medium text-gray-600"
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