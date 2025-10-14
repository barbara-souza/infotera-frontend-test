"use client";

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";

// Tipagem dos dados
type StarsCount = Record<number, number>;
interface HotelData {
  id: number;
  hotel: {
    name: string;
    stars: number;
    image: string;
  };
  lowestPrice: { amount: number };
}

interface FiltersPanelProps {
  hotels: HotelData[];
  name: string;
  onNameChange: (v: string) => void;

  priceMin: number;
  priceMax: number;
  onPriceChange: (min: number, max: number) => void;

  selectedStars: number[];
  onToggleStar: (star: number) => void;

  starsCount: StarsCount;
  unclassifiedCount: number;

  onClear: () => void;
  onClose: () => void; // fecha o dropdown
}

export function FiltersPanel({
  hotels,
  name,
  onNameChange,
  priceMin,
  priceMax,
  onPriceChange,
  selectedStars,
  onToggleStar,
  starsCount,
  unclassifiedCount,
  onClear,
  onClose,
}: FiltersPanelProps) {
  // ====== sem mudar funcionalidade: cálculo do teto e estado atual ======
  const [maxAvailable, setMaxAvailable] = useState(0);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const highest = Math.max(
        ...hotels.map((h) => Number(h.lowestPrice.amount || 0))
      );
      setMaxAvailable(highest);
      onPriceChange(0, highest); // mantém comportamento: começa em 0 → máximo
    }
  }, [hotels]);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });

  const MAX = Math.max(0, maxAvailable);
  const low = Math.max(0, Math.min(priceMin, priceMax));
  const high = Math.min(MAX, Math.max(priceMin, priceMax));

  // ====== slider custom (mantido) ======
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const valueToPct = (v: number) => (MAX ? (v / MAX) * 100 : 0);
  const pctToValue = (pct: number) => {
    const clamped = Math.min(100, Math.max(0, pct));
    return Math.round((clamped / 100) * MAX);
  };

  const lowPct = valueToPct(low);
  const highPct = valueToPct(high);

  const getClientX = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e && e.touches.length) return e.touches[0].clientX;
    // @ts-ignore
    return e.clientX as number;
  };

  const updateFromClientX = (clientX: number, knob: "min" | "max") => {
    const track = trackRef.current;
    if (!track || MAX === 0) return;
    const rect = track.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const val = pctToValue(pct);

    if (knob === "min") {
      const nextMin = Math.min(val, high);
      onPriceChange(nextMin, high);
    } else {
      const nextMax = Math.max(val, low);
      onPriceChange(low, nextMax);
    }
  };

  const onTrackMouseDown = (e: MouseEvent) => {
    const clientX = getClientX(e);
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clickVal = pctToValue(pct);
    const distToMin = Math.abs(clickVal - low);
    const distToMax = Math.abs(clickVal - high);
    const knob: "min" | "max" = distToMin <= distToMax ? "min" : "max";
    setActiveThumb(knob);
    updateFromClientX(clientX, knob);
  };
  const onTrackMouseMove = (e: MouseEvent) =>
    activeThumb && updateFromClientX(getClientX(e), activeThumb);
  const onTrackMouseUp = () => setActiveThumb(null);
  const onTrackTouchStart = (e: TouchEvent) => {
    const clientX = getClientX(e);
    const rect = trackRef.current!.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clickVal = pctToValue(pct);
    const distToMin = Math.abs(clickVal - low);
    const distToMax = Math.abs(clickVal - high);
    const knob: "min" | "max" = distToMin <= distToMax ? "min" : "max";
    setActiveThumb(knob);
    updateFromClientX(clientX, knob);
  };
  const onTrackTouchMove = (e: TouchEvent) =>
    activeThumb && updateFromClientX(getClientX(e), activeThumb);
  const onTrackTouchEnd = () => setActiveThumb(null);

  // ====== fechar ao clicar fora (somente layout/UX) ======
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent | TouchEvent) => {
      const target = ev.target as Node;

      // botão do filtro tem este ID no SearchPage
      const filterButton = document.getElementById("filter-button-wrapper");

      // se clicou dentro do painel OU no botão, não fecha
      if (
        panelRef.current?.contains(target) ||
        filterButton?.contains(target)
      ) {
        return;
      }

      // fecha o dropdown
      onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-3 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200 z-50"
    >
      {/* topo */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-semibold text-[#00264D]">Filtros</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-2 text-sm text-[#0080FF] hover:underline"
        >
          <FiTrash2 className="text-[#0080FF]" />
          Limpar filtros
        </button>
      </div>

      {/* conteúdo */}
      <div className="max-h-[400px] overflow-y-auto px-4 py-4 space-y-6">
        {/* hotel */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Hotel</p>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nome do hotel"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
          />
        </div>

        {/* preço */}
        <div>
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <span>Preço</span>
            <FiChevronDown className="text-gray-500" />
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{fmt(low)}</span>
              <span>{fmt(high)}</span>
            </div>

            {/* SLIDER (layout ajustado) */}
            <div
              ref={trackRef}
              className="relative h-4 mt-2 select-none"
              onMouseDown={onTrackMouseDown}
              onMouseMove={onTrackMouseMove}
              onMouseUp={onTrackMouseUp}
              onMouseLeave={onTrackMouseUp}
              onTouchStart={onTrackTouchStart}
              onTouchMove={onTrackTouchMove}
              onTouchEnd={onTrackTouchEnd}
            >
              {/* trilha cinza → mais fina (4px) */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[4px] bg-gray-200 rounded-full" />
              {/* faixa azul → mais fina (4px) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-[#0080FF] rounded-full"
                style={{
                  left: `${(low / MAX) * 100}%`,
                  right: `${100 - (high / MAX) * 100}%`,
                }}
              />

              {/* thumb MIN → borda azul */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[#0080FF] border-2 border-[#0080FF] shadow-md cursor-pointer ${
                  activeThumb === "min" ? "ring-2 ring-blue-200" : ""
                }`}
                style={{ left: `${(low / MAX) * 100}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActiveThumb("min");
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setActiveThumb("min");
                }}
              />

              {/* thumb MAX → borda azul */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[#0080FF] border-2 border-[#0080FF] shadow-md cursor-pointer ${
                  activeThumb === "max" ? "ring-2 ring-blue-200" : ""
                }`}
                style={{ left: `${(high / MAX) * 100}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActiveThumb("max");
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setActiveThumb("max");
                }}
              />
            </div>
          </div>
        </div>

        {/* estrelas */}
        <div>
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <span>Estrelas</span>
            <FiChevronDown className="text-gray-500" />
          </div>

          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {[1, 2, 3, 4, 5].map((star) => (
              <label
                key={star}
                className="flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(star)}
                      onChange={() => onToggleStar(star)}
                      className="peer w-4 h-4 rounded border border-gray-400 appearance-none
                         checked:bg-[#0080FF] checked:border-[#0080FF]
                         transition-all duration-150 cursor-pointer"
                      style={{
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                      }}
                    />
                    {/* check branco sobre fundo azul */}
                    <svg
                      className="absolute inset-0 w-3 h-3 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>
                    {star} estrela{star > 1 && "s"}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {starsCount[star] ?? 0}
                </span>
              </label>
            ))}

            <label className="flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedStars.includes(0)}
                    onChange={() => onToggleStar(0)}
                    className="peer w-4 h-4 rounded border border-gray-400 appearance-none
                       checked:bg-[#0080FF] checked:border-[#0080FF]
                       transition-all duration-150 cursor-pointer"
                    style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                  />
                  <svg
                    className="absolute inset-0 w-3 h-3 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Não classificado</span>
              </div>
              <span className="text-gray-400 text-xs">{unclassifiedCount}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
