import './globals.css';
import AppShell from '@/components/AppShell';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: '日本旅行規劃',
  description: '規劃您的完美日本之旅',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <AppShell>{children}</AppShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
