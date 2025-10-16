import './globals.css'
import { ReactQueryProvider } from '@/components/providers/react-query-provider'
import PageTransition from "@/components/layout/pageTransition";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Infotravel',
  description: 'Simulador de reserva de hotéis',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className="font-sans bg-[#e9f1f9] text-[#002b5c] antialiased overflow-x-hidden overflow-y-scroll">
        <ReactQueryProvider>
          <main className="w-full">
            <div className="max-w-[100%]">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </ReactQueryProvider>
      </body>
    </html>
  )
}