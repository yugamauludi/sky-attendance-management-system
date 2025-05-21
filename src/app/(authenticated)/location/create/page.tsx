"use client";
import React, { useState } from "react";

const CreateLocationPage: React.FC = () => {
  const [locationData, setLocationData] = useState({
    location_code: "",
    location_name: "",
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
      const response = await fetch("/v1/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan lokasi baru");
      }

      alert("Lokasi baru berhasil ditambahkan!");
      // Reset form
      setLocationData({
        location_code: "",
        location_name: "",
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

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4">
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">
        Tambah Lokasi Baru
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="location_code"
          value={locationData.location_code}
          onChange={handleChange}
          placeholder="Kode Lokasi"
          className="w-full p-2 rounded bg-black/30 text-white"
          required
        />
        <input
          type="text"
          name="location_name"
          value={locationData.location_name}
          onChange={handleChange}
          placeholder="Nama Lokasi"
          className="w-full p-2 rounded bg-black/30 text-white"
          required
        />
        {/* Tambahkan input lainnya sesuai kebutuhan */}
        <button
          type="submit"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Tambah Lokasi
        </button>
      </form>
    </div>
  );
};

export default CreateLocationPage;