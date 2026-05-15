import "./globals.css";
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { Providers } from './Providers' // Our NextAuth Gatekeeper

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
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-[#0a0a0a] text-white overflow-hidden`}>
        {/* We wrap the entire app in our custom NextAuth provider instead of Clerk */}
        <Providers>
          
          {/* THE PERSISTENT SIDEBAR */}
          <Sidebar />

          {/* THE DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

        </Providers>
      </body>
    </html>
  )
}