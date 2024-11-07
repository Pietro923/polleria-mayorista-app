import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Sidebar from '../components/Sidebar'
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Polleria',
  description: 'Sistema integral para la gestión de Alenort',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}