"use client";

import { FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";

export default function SearchBar() {
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination") ?? "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const adults = Number(searchParams.get("adults") ?? 2);
  const children = Number(searchParams.get("children") ?? 0);

  const startLabel = start
    ? format(new Date(start), "dd/MM/yyyy")
    : "Selecionar";
  const endLabel = end ? format(new Date(end), "dd/MM/yyyy") : "Selecionar";
  const guestsLabel =
    children > 0
      ? `${adults} Adult${adults > 1 ? "os" : "o"}, ${children} Crianç${
          children > 1 ? "as" : "a"
        }, 1 Quarto`
      : `${adults} Adult${adults > 1 ? "os" : "o"}, 1 Quarto`;

  return (
    <section className="w-full flex justify-center px-4 mt-6">
      <div className="bg-white rounded-2xl shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between w-full max-w-[1700px] gap-4 lg:gap-0 px-6 py-6">
        {/* DESTINO */}
        <div className="flex items-center gap-2 flex-1 px-2 relative text-left">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <FiMapPin className="text-[#0080FF] text-sm" />
              <label className="text-xs">Destino</label>
            </div>
            <p className="font-semibold text-[#002b5c]">
              {destination || "Digite o destino"}
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-gray-200" />

        {/* ENTRADA */}
        <div className="flex items-center gap-2 flex-1 px-2 relative">
          <div className="flex flex-col flex-1 text-left">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <FiCalendar className="text-[#0080FF] text-sm" />
              <label className="text-xs">Entrada</label>
            </div>
            <p className="font-semibold text-[#002b5c]">{startLabel}</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-gray-200" />

        {/* SAÍDA */}
        <div className="flex items-center gap-2 flex-1 px-2">
          <div className="flex flex-col flex-1 text-left">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <FiCalendar className="text-[#0080FF] text-sm" />
              <label className="text-xs">Saída</label>
            </div>
            <p className="font-semibold text-[#002b5c]">{endLabel}</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-gray-200" />

        {/* HÓSPEDES */}
        <div className="flex items-center gap-2 flex-1 px-2 relative">
          <div className="flex flex-col flex-1 text-left">
            <div className="flex items-center gap-1 text-gray-500 mb-1">
              <FiUsers className="text-[#0080FF] text-sm" />
              <label className="text-xs">Hóspedes</label>
            </div>
            <p className="font-semibold text-[#002b5c]">{guestsLabel}</p>
          </div>
        </div>

        {/* BOTÃO */}
        <button className="bg-[#0080FF] text-white font-medium rounded-[50px] px-6 py-3 shadow-md hover:bg-blue-600 transition w-full lg:w-auto">
          Pesquisar
        </button>
      </div>
    </section>
  );
}
