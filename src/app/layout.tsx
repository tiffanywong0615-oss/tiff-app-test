import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: '日本旅行規劃',
  description: '規劃您的完美日本之旅',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
