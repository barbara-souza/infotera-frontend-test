export interface HotelData {
  id: number
  hotel: HotelInfo
  lowestPrice: Price
  rooms: Room[]
}

export interface HotelInfo {
  name: string
  address: string
  stars: number
  image: string
  description: string
}

export interface Price {
  currency: string // "BRL"
  amount: number
}

export interface Room {
  roomType: {
    name: string
  }
  price: Price
  cancellationPolicies: {
    refundable: boolean
  }
}
