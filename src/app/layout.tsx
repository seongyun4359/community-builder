import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "커뮤니티 빌더",
  description: "누구나 쉽게 만드는 공동체, 커뮤니티 빌더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
