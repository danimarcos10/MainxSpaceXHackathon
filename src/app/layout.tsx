import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RoomRelay — Temporary student housing",
    template: "%s | RoomRelay",
  },
  description:
    "Verified student-to-student temporary subletting, made safer with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={manrope.variable}>
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[200] -translate-y-20 rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-[calc(100dvh-var(--header-height))]">
          {children}
        </main>
      </body>
    </html>
  );
}
