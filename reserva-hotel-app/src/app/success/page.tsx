'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Reservation = {
  hotel: string
  guest: string
  contactName: string
  email: string
}

export default function SuccessPage() {
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('reservation')
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  useEffect(() => {
    if (!reservation) {
      router.replace('/')
    }
  }, [reservation, router])

  if (!reservation) return null

  return (
    <div className="bg-[#123952F2] min-h-screen text-white flex flex-col justify-center items-center overflow-x-hidden">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold">Reserva realizada com sucesso!</h1>

        <div className="text-left space-y-3">
          <p><strong>Hotel:</strong> {reservation.hotel}</p>
          <p><strong>Hóspede:</strong><br />Nome: {reservation.guest}</p>
          <p><strong>Contato:</strong><br />Nome: {reservation.contactName}<br />E-mail: {reservation.email}</p>
        </div>
      </div>
    </div>
  )
}