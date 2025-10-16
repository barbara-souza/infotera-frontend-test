"use client";

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title = "Nenhum hotel encontrado",
  subtitle = "Tente ajustar o destino, as datas ou os filtros.",
  action,
}: EmptyStateProps) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-xl shadow-md p-8 text-center">
      <p className="text-lg font-semibold text-[#00264D]">{title}</p>
      <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}