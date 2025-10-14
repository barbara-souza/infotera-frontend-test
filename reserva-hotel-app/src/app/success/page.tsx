'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

console.log('Página Success carregada!')

type Reservation = {
  hotel: string
  guest: string
  contactName: string
  email: string
}

export default function SuccessPage() {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('reservation')
    console.log('Session encontrada:', stored)
    if (stored) {
      setReservation(JSON.parse(stored))
    } else {
      router.push('/')
    }
  }, [router])

  if (!reservation) return null

  return (
    <div className="bg-[#123952F2] min-h-screen text-white flex flex-col justify-center items-center">
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