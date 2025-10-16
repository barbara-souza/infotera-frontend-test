import { create } from 'zustand'
import { HotelData, Room } from '@/types/hotel'

type BookingState = {
  selectedHotel?: HotelData
  selectedRoom?: Room
  setBooking: (hotel: HotelData, room: Room) => void
  clearBooking: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedHotel: undefined,
  selectedRoom: undefined,
  setBooking: (hotel, room) => set({ selectedHotel: hotel, selectedRoom: room }),
  clearBooking: () => set({ selectedHotel: undefined, selectedRoom: undefined }),
}))