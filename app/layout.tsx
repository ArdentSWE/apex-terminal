import "./globals.css";
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import SportsTicker from '@/components/SportsTicker'; // The new neon marquee
import { Providers } from './Providers'; // Your NextAuth Gatekeeper

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "ACE'S HOUSE | Quant Matrix",
  description: "Institutional-grade market and sports analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Updated background to the deep Philips Hue violet-black */}
      <body className={`${inter.className} flex flex-col h-screen bg-[#090014] text-white overflow-hidden`}>
        <Providers>
          
          {/* MAIN MATRIX: Sidebar + Dynamic Page Content */}
          <div className="flex flex-1 overflow-hidden pb-10"> {/* pb-10 prevents content from hiding behind the ticker */}
            
            {/* THE PERSISTENT SIDEBAR */}
            <Sidebar />

            {/* THE DYNAMIC CONTENT AREA */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
              {children}
            </div>

          </div>

          {/* THE PERSISTENT NEON SPORTS TICKER */}
          <SportsTicker />

        </Providers>
      </body>
    </html>
  );
}