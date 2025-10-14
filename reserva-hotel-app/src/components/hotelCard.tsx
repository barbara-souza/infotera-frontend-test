"use client";

import { HotelData } from "@/types/hotel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface HotelCardProps {
  hotel: HotelData;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { name, image, stars } = hotel.hotel;
  const price = hotel.lowestPrice.amount.toFixed(0);

  const searchParams = useSearchParams();

  const destination = searchParams.get("destination");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");

  const queryString = new URLSearchParams({
    ...(destination ? { destination } : {}),
    ...(start ? { start } : {}),
    ...(end ? { end } : {}),
    ...(adults ? { adults } : {}),
    ...(children ? { children } : {}),
  }).toString();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden w-[397px] sm:w-[357px]">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#00264D]/80 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-2xl font-bold">
            R$ {price}
            <span className="text-gray-300 text-sm font-normal ml-1">
              / noite
            </span>
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg leading-tight font-semibold text-gray-800">
          {name}
        </h2>

        <div className="flex items-center justify-between mt-1">
          
          <div className="flex items-center gap-1">
            {Array.from({ length: stars }).map((_, i) => (
              <img
                key={i}
                src="/star.svg"
                alt="estrela"
                className="w-4 h-4 md:w-4 md:h-4"
              />
            ))}
          </div>

         
          <Link
            href={`/hotel/${hotel.id}?${queryString}`}
            className="bg-[#0080FF] text-xs text-white font-medium rounded-[50px] px-8 py-2 shadow-md hover:bg-blue-600 transition"
          >
            Ver mais
          </Link>
        </div>
      </div>
    </div>
  );
}
