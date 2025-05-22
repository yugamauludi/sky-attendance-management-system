/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllLocations, Location } from "@/services/location";
import { DataTable } from "@/components/DataTable";
import Background from "@/components/Background";

const LocationListPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations(currentPage, itemsPerPage);
        console.log(data, "<<<data");
        
        setLocations(data.data);
        setPagination(data.meta);
      } catch (err) {
        setError("Gagal memuat data lokasi");
        console.error(err);
      }
    };

    fetchLocations();
  }, [currentPage, itemsPerPage]);

  const renderLocationCell = (location: Location, key: string) => {
    if (key === "action") {
      return (
        <button 
          onClick={() => {
            // Handle edit action
            console.log("Edit location:", location);
          }}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
        >
          Edit
        </button>
      );
    }
    return location[key as keyof Location] || "-";
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Background />
      <div className="relative h-screen overflow-auto">
        <div className="mx-4 lg:mx-8">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">
            Daftar Lokasi
          </h1>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => router.push("/location/create")}
              className="text-white bg-gradient-to-br from-green-500 to-teal-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Tambah Lokasi Baru
            </button>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-zinc-400">Tampilkan:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="rounded-lg bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-yellow-500/20 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-zinc-400">data per halaman</span>
            </div>
          </div>
          {error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="rounded-2xl bg-black/40 p-4 sm:p-6 shadow-xl ring-1 ring-yellow-500/20 backdrop-blur-lg">
              <DataTable
                columns={[
                  { key: "location_name", label: "Nama Lokasi" },
                  { key: "location_code", label: "Kode Lokasi" },
                  { key: "action", label: "Aksi" }
                ]}
                data={locations}
                renderCell={renderLocationCell}
                currentPage={currentPage}
                totalPages={(pagination as any).totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={(pagination as any).totalItems}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationListPage;
