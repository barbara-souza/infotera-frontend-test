"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelDetails } from "@/hooks/useHotelDetails";
import { useBookingStore } from "@/store/bookingStore";
import Header from "@/components/layout/header";
import SearchBar from "@/components/layout/searchbar";
import Footer from "@/components/layout/footer";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, isLoading, isError } = useHotelDetails(id);
  const setBooking = useBookingStore((state) => state.setBooking);

  if (isLoading)
    return (
      <div className="text-center mt-20">Carregando detalhes do hotel...</div>
    );
  if (isError)
    return (
      <div className="text-center mt-20 text-red-600">
        Erro ao carregar os dados do hotel.
      </div>
    );
  if (!data) return null;

  const { hotel, rooms } = data;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#E3EBF3]">
      
      <Header />

      
      <SearchBar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full max-w-[1700px] mx-auto mt-10  mb-10">
        
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-10">
         
          <div className="flex flex-col md:flex-row gap-8">
            
            <div className="flex-shrink-0 w-full md:w-[35%]">
              <Image
                src={hotel.image}
                alt={hotel.name}
                width={800}
                height={600}
                className="w-full h-[350px] object-cover rounded-lg"
              />
            </div>

            
            <div className="flex flex-col justify-start md:w-[65%] space-y-4">
              <h1 className="text-2xl font-bold text-[#00264D]">
                {hotel.name}
              </h1>

              
              <div className="flex items-center gap-2 text-[#5A748C] text-sm">
                <FiMapPin className="text-[#5A748C] w-4 h-4" />
                <span>{hotel.address}</span>
              </div>

              
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Image
                    key={i}
                    src="/star.svg"
                    alt="estrela"
                    width={18}
                    height={18}
                  />
                ))}
              </div>

              
              <p
                className="text-gray-700 leading-relaxed mt-2"
                dangerouslySetInnerHTML={{ __html: hotel.description }}
              />
            </div>
          </div>

          
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-[#00264D] mb-6">
              Quartos disponíveis
            </h2>

            <div className="flex flex-col gap-4">
              {rooms.map((room, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[#E3EBF3] border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-center p-4 hover:shadow-md transition"
                >
                  
                  <div className="flex flex-col items-start w-full md:w-[70%]">
                    <p className="text-[#00264D] font-semibold text-lg">
                      {room.roomType.name}
                    </p>

                    {room.cancellationPolicies.refundable ? (
                      <p className="text-[#0080FF] font-semibold text-sm mt-1 flex items-center gap-2">
                        <Image
                          src="/check.svg"
                          alt="Cancelamento gratuito"
                          width={14}
                          height={14}
                        />
                        Cancelamento gratuito
                      </p>
                    ) : (
                      <p className="text-[#FF0000] font-semibold text-sm mt-1 flex items-center gap-2">
                        <Image
                          src="/x.svg"
                          alt="Multa de cancelamento"
                          width={14}
                          height={14}
                        />
                        Multa de cancelamento
                      </p>
                    )}
                  </div>

                  
                  <div className="flex flex-col md:flex-row items-center justify-end w-full md:w-[30%] gap-10 mt-4 md:mt-0">
                    <div className="text-right">
                      <p className="text-[#0080FF] font-bold text-[27px]">
                        R$ {room.price.amount.toFixed(0)}
                        <span className="text-[#0080FF] text-sm font-normal ml-1">
                          / noite
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Pagamento no hotel
                      </p>
                    </div>

                    <button
                      className="bg-[#0080FF] text-xs text-white font-medium rounded-[50px] px-6 py-3 shadow-md hover:bg-blue-600 transition"
                      onClick={() => {
                        setBooking(data, room);
                        router.push("/checkout");
                      }}
                    >
                      Reservar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      
      <Footer />
    </div>
  );
}
