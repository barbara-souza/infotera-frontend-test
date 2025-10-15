"use client";

import { useBookingStore } from "@/store/bookingStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const schema = z.object({
  guestName: z.string().min(2, "Nome obrigatório"),
  guestSurname: z.string().min(2, "Sobrenome obrigatório"),
  contactName: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { selectedHotel, selectedRoom, clearBooking } = useBookingStore();
  const router = useRouter();

  useEffect(() => {
    if (!selectedHotel || !selectedRoom) {
      router.push("/");
    }
  }, [selectedHotel, selectedRoom, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    try {
      const reservation = {
        hotel: selectedHotel?.hotel.name ?? "",
        guest: `${data.guestName} ${data.guestSurname}`,
        contactName: data.contactName,
        email: data.email,
      };

      sessionStorage.setItem("reservation", JSON.stringify(reservation));

      clearBooking();
      setTimeout(() => {
        router.push("/success");
      }, 300);
    } catch (err) {
      console.error("Erro ao salvar reserva:", err);
    }
  };

  if (!selectedHotel || !selectedRoom) return null;

  const taxes = (selectedRoom.price.amount * 0.1).toFixed(2);
  const total = (selectedRoom.price.amount * 1.1).toFixed(2);

  return (
    <div className="bg-[#E3EBF3] min-h-screen flex flex-col justify-between">
      {/* HEADER */}
      <Header />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-[1700px] mx-auto flex flex-col md:flex-row justify-between gap-8 px-6  mb-20">
        {/* FORMULÁRIO DE RESERVA */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6">
          <h1 className="text-base font-semibold text-[#00264D] mb-2">
            Finalize sua reserva!
          </h1>

          {/* DADOS DO HÓSPEDE */}
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-sm font-semibold text-[#00264D] mb-3">
              Hotel: {selectedHotel.hotel.name}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#00264D]">
                  Nome (Hóspede)
                </label>
                <input
                  {...register("guestName")}
                  className="border w-full rounded-md p-2 mt-1 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                />
                {errors.guestName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.guestName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-[#00264D]">
                  Sobrenome
                </label>
                <input
                  {...register("guestSurname")}
                  className="border w-full rounded-md p-2 mt-1 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                />
                {errors.guestSurname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.guestSurname.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CONTATO DA RESERVA */}
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-sm font-semibold text-[#00264D] mb-3">
              Contato da reserva
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#00264D]">
                  Nome
                </label>
                <input
                  {...register("contactName")}
                  className="border w-full rounded-md p-2 mt-1 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                />
                {errors.contactName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[#00264D]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="border w-full rounded-md p-2 mt-1 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-[#00264D]">
                  Telefone (WhatsApp)
                </label>
                <input
                  {...register("phone")}
                  className="border w-full rounded-md p-2 mt-1 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-[#00264D]">
                Observações
              </label>
              <textarea
                {...register("notes")}
                className="border w-full rounded-md p-2 mt-1 h-24 text-sm focus:ring-1 focus:ring-[#0080FF] outline-none"
                placeholder="Sua mensagem"
              />
            </div>
          </div>
        </form>

        {/* RESUMO DA RESERVA */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 md:w-[380px] h-fit mt-[48px]">
          <h2 className="text-sm font-semibold text-[#0080FF] mb-3">
            Sua reserva
          </h2>

          <p className="font-semibold text-[#00264D]">
            {selectedHotel.hotel.name}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {selectedHotel.hotel.address}
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm text-[#00264D]">
              Quarto: {selectedRoom.roomType.name}
            </p>

            <p
              className={`text-sm flex items-center gap-1 ${
                selectedRoom.cancellationPolicies.refundable
                  ? "text-[#0080FF]"
                  : "text-[#FF0000]"
              }`}
            >
              <Image
                src={
                  selectedRoom.cancellationPolicies.refundable
                    ? "/check.svg"
                    : "/x.svg"
                }
                alt="Cancelamento"
                width={14}
                height={14}
              />
              {selectedRoom.cancellationPolicies.refundable
                ? "Cancelamento gratuito"
                : "Multa de cancelamento"}
            </p>
          </div>

          {/* Total formatado igual à imagem */}
          <div className="border-t mt-4 pt-3 text-sm space-y-2">
            <div className="flex items-center justify-between text-[#00264D] font-medium">
              <p>Impostos e taxas</p>
              <p>R$ {Number(taxes).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[#00264D] font-medium">Total</p>
              <p className="text-[#0080FF] font-bold text-lg">
                R$ {Number(total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="w-full text-xs bg-[#0080FF] text-white font-semibold rounded-[50px] py-3 mt-4 shadow-md hover:bg-blue-600 transition"
          >
            RESERVAR
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
