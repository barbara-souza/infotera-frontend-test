import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { HotelData } from '@/types/hotel'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useHotelDetails(id: string) {
  return useQuery<HotelData>({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/hotels/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}