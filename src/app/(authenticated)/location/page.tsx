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

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
      } catch (err) {
        setError("Gagal memuat data lokasi");
        console.error(err);
      }
    };

    fetchLocations();
  }, []);

  const renderLocationCell = (location: Location, key: string) => {
    if (key === "action") {
      return (
        <button 
        onClick={() => {
          // Handle edit action
          console.log("Edit location:", location);
        }}
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer">
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
          <button
            onClick={() => router.push("/location/create")}
            className="mb-4 text-white bg-gradient-to-br from-green-500 to-teal-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Tambah Lokasi Baru
          </button>
          {error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <DataTable
              columns={[
                { key: "location_name", label: "Nama Lokasi" },
                { key: "location_code", label: "Kode Lokasi" },
                {
                  key: "action",
                  label: "Aksi",
                  render: () => (
                    <button className="text-blue-400 hover:underline">
                      Edit
                    </button>
                  ),
                },
              ]}
              data={locations}
              renderCell={renderLocationCell}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationListPage;
