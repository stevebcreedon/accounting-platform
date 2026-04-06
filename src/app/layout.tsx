import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { SkipToContent } from '@/components/layout/skip-to-content';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageViewTracker } from '@/components/analytics/page-view-tracker';
import { MotionProvider } from '@/components/motion/motion-provider';
import { PageTransition } from '@/components/motion/page-transition';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://the-ledger.vercel.app'
  ),
  title: {
    default: 'The Ledger — Irish Accounting Guidance',
    template: '%s | The Ledger',
  },
  description:
    'Clear, jargon-free accounting guidance for Irish small businesses, sole traders, and company directors.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    siteName: 'The Ledger',
  },
  twitter: {
    card: 'summary',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${satoshi.variable}`}>
      <body className="font-body bg-white text-charcoal antialiased">
        <SkipToContent />
        <Header />
        <main id="main-content" className="pt-16 min-h-screen">
          <MotionProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </MotionProvider>
        </main>
        <Footer />
        <PageViewTracker />
      </body>
    </html>
  );
}
