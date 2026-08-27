import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DD PAY | 디디페이",
  description: "가맹점 결제 관리 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="bg-background text-foreground antialiased">
        <div className="mx-auto max-w-[430px] min-h-screen relative bg-white shadow-xl">
          {children}
        </div>
      </body>
    </html>
  );
}
