import type {Metadata} from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Portfolio | Aghna Fatkhi',
  description: 'Portofolio anak muda: Pelajar, Aktor Teater, Desainer Grafis, Fotografer, dan Video Editor.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} font-sans antialiased bg-white text-gray-800`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
