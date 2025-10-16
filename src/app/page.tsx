"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-date-range";
import { FiMapPin, FiCalendar, FiUsers, FiLogIn } from "react-icons/fi";
import Image from "next/image";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: "selection" },
  ]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [destination, setDestination] = useState("");
  const [debouncedDestination, setDebouncedDestination] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDestination(destination);
    }, 500);
    return () => clearTimeout(timer);
  }, [destination]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      )
        setShowCalendar(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node))
        setShowGuests(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", debouncedDestination],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/suggestions`);
      return res.data.filter(
        (item: any) =>
          item.name
            .toLowerCase()
            .includes(debouncedDestination.toLowerCase()) ||
          item.region.toLowerCase().includes(debouncedDestination.toLowerCase())
      );
    },
    enabled: debouncedDestination.length > 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = selectedSuggestion || destination;
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    if (!query.trim()) {
      setErrorMessage("Por favor, selecione um destino.");
      return;
    }
    if (!start || !end) {
      setErrorMessage("Por favor, selecione as datas de entrada e saída.");
      return;
    }
    setErrorMessage("");
    const startISO = format(start, "yyyy-MM-dd");
    const endISO = format(end, "yyyy-MM-dd");
    const params = new URLSearchParams({
      destination: query,
      start: startISO,
      end: endISO,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E3EBF3]">
      <header className="py-4 w-full flex justify-center">
        <div className="flex justify-between items-center w-full max-w-[1700px] px-5">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo Infotravel"
              width={101}
              height={26}
              priority
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
            <FiLogIn className="text-base" />
            <span>Iniciar Sessão</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
        <h2 className="font-sans font-semibold text-[32px] sm:text-[40px] lg:text-[50px] leading-tight text-[#0B0B0B] text-center mb-8 sm:mb-10">
          Os melhores <span className="text-[#0080FF]">Hoteis</span> e{" "}
          <span className="text-[#0080FF]">Destinos</span> <br />
          para sua viagem
        </h2>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-md flex flex-col lg:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-0 py-4 w-full max-w-[1700px] mx-auto lg:h-[66px]"
        >
          <div
            ref={suggestionsRef}
            className="flex items-center gap-2 flex-1 px-3 sm:px-6 py-2 relative text-left w-full"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <FiMapPin className="text-[#0080FF] text-sm" />
                <label className="text-xs">Destino</label>
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setSelectedSuggestion("");
                  setErrorMessage("");
                }}
                placeholder="Digite o destino"
                className="font-semibold text-[#002b5c] outline-none w-full text-sm sm:text-base"
              />
            </div>
            {suggestions && debouncedDestination.length > 1 && (
              <div className="absolute left-0 top-full mt-3 w-full sm:w-[360px] bg-white rounded-2xl shadow-lg z-50 border border-gray-100">
                <div className="absolute -top-2 left-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />
                <div className="py-2 max-h-[320px] overflow-y-auto">
                  {suggestions.length > 0 ? (
                    suggestions.map((item: any, idx: number) => {
                      const name = item.name as string;
                      const region = item.region as string;
                      const q = debouncedDestination.trim().toLowerCase();
                      const i = name.toLowerCase().indexOf(q);
                      const renderHighlighted = () => {
                        if (i === -1 || !q) return name;
                        const before = name.slice(0, i);
                        const match = name.slice(i, i + q.length);
                        const after = name.slice(i + q.length);
                        return (
                          <>
                            {before}
                            <span className="bg-[#E6E8FF] text-[#2B3A67] px-1 rounded">
                              {match}
                            </span>
                            {after}
                          </>
                        );
                      };
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedSuggestion(item.name);
                            setDestination(item.name);
                            setDebouncedDestination("");
                            setErrorMessage("");
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#E9F1F9] transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mt-0.5 h-5 w-5 text-[#0080FF] shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 11.5a3 3 0 100-6 3 3 0 000 6z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 9.5c0 5.25-7.5 11-7.5 11S4.5 14.75 4.5 9.5a7.5 7.5 0 1115 0z"
                            />
                          </svg>
                          <div className="flex flex-col">
                            <p className="text-[15px] font-semibold text-[#00264D] leading-5">
                              {renderHighlighted()}
                            </p>
                            <p className="text-xs text-gray-500">{region}</p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-4 py-3 text-sm text-gray-500 text-center">
                      Nenhum destino encontrado
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          <div
            className="flex items-center gap-2 flex-1 px-3 sm:px-6 py-2 relative w-full"
            ref={calendarRef}
          >
            <div
              className="flex flex-col flex-1 text-left cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <FiCalendar className="text-[#0080FF] text-sm" />
                <label className="text-xs">Entrada</label>
              </div>
              <p className="font-semibold text-[#002b5c] text-sm sm:text-base">
                {dateRange[0].startDate
                  ? format(dateRange[0].startDate, "dd/MM/yyyy")
                  : "Selecionar"}
              </p>
            </div>
            {showCalendar && (
              <div className="absolute top-16 bg-white shadow-lg rounded-md z-20">
                <DateRange
                  showDateDisplay={false}
                  editableDateInputs
                  onChange={(item) => {
                    setDateRange([item.selection]);
                    setErrorMessage("");
                    const { startDate, endDate } = item.selection;
                    if (
                      startDate &&
                      endDate &&
                      startDate.getTime() !== endDate.getTime()
                    ) {
                      setShowCalendar(false);
                    }
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  minDate={new Date()}
                  locale={ptBR}
                  rangeColors={["#0080FF"]}
                />
              </div>
            )}
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          <div className="flex items-center gap-2 flex-1 px-3 sm:px-6 py-2 w-full">
            <div className="flex flex-col flex-1 text-left">
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <FiCalendar className="text-[#0080FF] text-sm" />
                <label className="text-xs">Saída</label>
              </div>
              <p className="font-semibold text-[#002b5c] text-sm sm:text-base">
                {dateRange[0].endDate
                  ? format(dateRange[0].endDate, "dd/MM/yyyy")
                  : "Selecionar"}
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-200" />

          <div
            ref={guestsRef}
            className="flex items-center gap-2 flex-1 px-3 sm:px-6 py-2 relative w-full"
          >
            <div
              onClick={() => setShowGuests(!showGuests)}
              className="flex flex-col flex-1 text-left cursor-pointer"
            >
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <FiUsers className="text-[#0080FF] text-sm" />
                <label className="text-xs">Hóspedes</label>
              </div>
              <p className="font-semibold text-[#002b5c] text-sm sm:text-base">
                {children > 0
                  ? `${adults} Adult${
                      adults > 1 ? "os" : "o"
                    }, ${children} Crianç${children > 1 ? "as" : "a"}, 1 Quarto`
                  : `${adults} Adult${adults > 1 ? "os" : "o"}, 1 Quarto`}
              </p>
            </div>
            {showGuests && (
              <div className="absolute left-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-lg p-6 z-20 border border-gray-100">
                <div className="absolute -top-2 left-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />
                <div className="flex flex-col justify-between  items-center mb-5">
                  <p className="font-semibold text-[#00264D] text-left w-full mb-3 ">
                    Adultos
                  </p>
                  <div className="flex items-center gap-[5.55rem]">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      -
                    </button>
                    <span className="w-3 text-center font-semibold text-[#0B0B0B]">
                      {adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="h-px bg-gray-200 my-3" />
                <div className="flex flex-col justify-between items-center mb-5">
                  <p className="font-semibold text-[#00264D] text-left w-full mb-3 ">
                    Crianças
                  </p>
                  <div className="flex items-center gap-[5.55rem]">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      -
                    </button>
                    <span className="w-3 text-center font-semibold text-[#0B0B0B]">
                      {children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-[25px] h-[25px] flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="h-px bg-gray-200 my-3" />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowGuests(false)}
                    className="w-[110px] h-[35px] border-2 border-[#0080FF] text-[#0080FF] font-medium rounded-full hover:bg-[#0080FF] hover:text-white transition"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#0080FF] text-white font-medium rounded-[50px] px-6 py-3 w-full sm:w-auto mx-0 lg:mx-4 shadow-md hover:bg-blue-600 transition self-stretch lg:self-auto"
          >
            Pesquisar
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg max-w-md mx-auto">
            {errorMessage}
          </div>
        )}
      </main>

      <footer className="bg-white text-center text-sm text-gray-500 py-4 mt-6 sm:mt-10">
        © 2025 | Todos os direitos reservados
      </footer>
    </div>
  );
}
