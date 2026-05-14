import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Ace's House | Quantitative Pipeline",
  description: 'Institutional-grade market and sports analytics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#00ffff', colorBackground: '#0a0a0a', colorText: '#ffffff' } }}>
      <html lang="en">
        <body className={`${inter.className} flex h-screen bg-[#0a0a0a] text-white overflow-hidden`}>
          
          {/* THE PERSISTENT SIDEBAR */}
          <Sidebar />

          {/* THE DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

        </body>
      </html>
    </ClerkProvider>
  )
}