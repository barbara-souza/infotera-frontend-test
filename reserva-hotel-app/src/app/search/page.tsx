"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useHotels } from "@/hooks/useHotels";
import { HotelCard } from "@/components/hotelCard";
import { FiltersPanel } from "@/components/filtersPanel";
import Image from "next/image";
import Header from "@/components/layout/header";
import SearchBar from "@/components/layout/searchbar";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const destination = searchParams.get("destination") ?? "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const adults = Number(searchParams.get("adults") ?? 2);
  const children = Number(searchParams.get("children") ?? 0);

  const { data, isLoading, isError } = useHotels(destination);

  const [filterName, setFilterName] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState(0);
  const [filterPriceMax, setFilterPriceMax] = useState(0);
  const [filterStars, setFilterStars] = useState<number[]>([]);
  const [maxAvailable, setMaxAvailable] = useState(0);

  useEffect(() => {
    if (data && data.length > 0) {
      const prices = data.map((h) => Number(h.lowestPrice?.amount ?? 0));
      const maxPrice = Math.max(...prices);
      setMaxAvailable(maxPrice);
      setFilterPriceMin(0);
      setFilterPriceMax(maxPrice);
    }
  }, [data]);

  const toggleStar = (star: number) => {
    setFilterStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const clearFilters = () => {
    if (maxAvailable > 0) {
      setFilterPriceMin(0);
      setFilterPriceMax(maxAvailable);
    }
    setFilterName("");
    setFilterStars([]);
  };

  const filteredHotels = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter((h) => {
      const price = Number(h.lowestPrice?.amount ?? 0);
      const name = (h.hotel?.name ?? "").toLowerCase();
      const stars = Number(h.hotel?.stars ?? 0);

      const byName = filterName.trim()
        ? name.includes(filterName.trim().toLowerCase())
        : true;
      const byPrice = price >= filterPriceMin && price <= filterPriceMax;
      const byStars =
        filterStars.length === 0 ? true : filterStars.includes(stars);

      return byName && byPrice && byStars;
    });
  }, [data, filterName, filterPriceMin, filterPriceMax, filterStars]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#0080FF] border-t-transparent rounded-full"
        />
      </div>
    );

  const starsCount =
    data?.reduce<Record<number, number>>((acc, h) => {
      const s = Number(h.hotel?.stars ?? 0);
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {}) ?? {};

  const unclassifiedCount = starsCount[0] ?? 0;
  const totalHotels = filteredHotels.length;
  const country = data?.[0]?.hotel?.country || data?.[0]?.hotel?.region || "";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E3EBF3]">
      <Header />

      <SearchBar />

      <section className="flex justify-between items-center w-full max-w-[1600px] mx-auto mt-10 px-6 relative">
        <div>
          <h1 className="text-2xl font-semibold text-[#00264D]">
            {destination}
            {country ? `, ${country}` : ""}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {totalHotels} hotéis encontrados
          </p>
        </div>

        <div className="relative" id="filter-button-wrapper">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFilters((v) => !v);
            }}
            className="w-[45px] h-[45px] flex items-center justify-center"
          >
            <Image
              src="/filter.svg"
              alt="Filtro"
              width={49}
              height={38}
              className="transition"
            />
          </button>

          {showFilters && (
            <FiltersPanel
              hotels={data ?? []}
              name={filterName}
              onNameChange={setFilterName}
              priceMin={filterPriceMin}
              priceMax={filterPriceMax}
              onPriceChange={(min, max) => {
                setFilterPriceMin(Math.max(0, Math.min(min, max)));
                setFilterPriceMax(Math.max(min, max));
              }}
              selectedStars={filterStars}
              onToggleStar={toggleStar}
              starsCount={{
                1: starsCount[1] ?? 0,
                2: starsCount[2] ?? 0,
                3: starsCount[3] ?? 0,
                4: starsCount[4] ?? 0,
                5: starsCount[5] ?? 0,
              }}
              unclassifiedCount={unclassifiedCount}
              onClear={clearFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>
      </section>

      <section className="grid gap-10 p-6 md:grid-cols-2 lg:grid-cols-4 max-w-[1600px] mx-auto">
        {filteredHotels.length === 0 ? (
          <p className="text-center text-gray-500">Nenhum hotel encontrado.</p>
        ) : (
          <motion.div
            className="contents"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {filteredHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <HotelCard hotel={hotel} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
