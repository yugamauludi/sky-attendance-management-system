"use client";
import { addLocation } from "@/services/location";
import React, { useState } from "react";

const CreateLocationPage: React.FC = () => {
  const [locationData, setLocationData] = useState({
    location_code: "",
    location_name: "",
    Create_by: 1,
    Update_by: 1,
    address: "",
    urlLocation: "",
    minimum_point: 0,
    region_coordinator: "",
    category: "",
    vendor: "",
    region: "",
    total_lot: 0,
    total_lot_mobil: 0,
    total_lot_motor: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLocation(JSON.stringify(locationData));

      alert("Lokasi baru berhasil ditambahkan!");
      // Reset form
      setLocationData({
        location_code: "",
        location_name: "",
        Create_by: 1,
        Update_by: 1,
        address: "",
        urlLocation: "",
        minimum_point: 0,
        region_coordinator: "",
        category: "",
        vendor: "",
        region: "",
        total_lot: 0,
        total_lot_mobil: 0,
        total_lot_motor: 0,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan lokasi baru");
    }
  };

  console.log();
  

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 flex items-center justify-center">
      <div className="bg-black/40 p-8 rounded-lg shadow-lg w-full max-w-3/4">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Tambah Lokasi Baru
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.keys(locationData).map((key) => (
            <div className="relative" key={key}>
              <input
                type={key.includes("lot") || key === "minimum_point" ? "number" : "text"}
                name={key}
                value={locationData[key as keyof typeof locationData]}
                onChange={handleChange}
                placeholder=""
                className="peer w-full rounded-lg border border-yellow-500/20 bg-black/20 pl-4 pr-4 py-4 outline-none transition-all focus:border-yellow-500 text-yellow-400 placeholder-zinc-400 autofill-style text-lg"
                required
              />
              <label
                htmlFor={key}
                className="absolute left-4 top-3 z-10 transform bg-transparent px-1 text-lg text-zinc-400 transition-all peer-placeholder-shown:left-4 peer-focus:left-4 peer-focus:-translate-y-8 peer-focus:scale-75 peer-focus:text-yellow-400 peer-[&:not(:placeholder-shown)]:-translate-y-8 peer-[&:not(:placeholder-shown)]:scale-75 peer-[&:not(:placeholder-shown)]:left-4"
              >
                {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-3 text-center transition duration-150 ease-in-out"
          >
            Tambah Lokasi
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocationPage;
