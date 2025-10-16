"use client";

export function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-44 md:h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-9 w-28 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}