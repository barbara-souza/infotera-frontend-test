import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { HotelData } from '@/types/hotel'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useHotels(destination: string) {
  return useQuery<HotelData[]>({
    queryKey: ['hotels', destination],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/hotels?destination=${destination}`)
      return response.data
    },
    enabled: true
  })
}