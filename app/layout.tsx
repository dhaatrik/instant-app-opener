import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Instant App Opener | Open Social Links in App',
  description: 'Convert standard social media URLs into mobile-app-compatible URI schemes instantly.',
  authors: [{ name: 'Dhaatrik Chowdhury', url: 'https://github.com/dhaatrik' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'App Opener',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#050505] text-white" suppressHydrationWarning>{children}</body>
    </html>
  );
}
