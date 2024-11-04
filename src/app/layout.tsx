import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sustainaco",
  description: "Empowering you in saving the environment",
};

export default ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en">
    <body className={inter.variable}>
      {children}
      <Toaster richColors />
    </body>
  </html>
);
