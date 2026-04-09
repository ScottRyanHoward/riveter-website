import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "riveter — Infrastructure Validation CLI",
  description:
    "Validate Terraform configurations against 15+ compliance frameworks. Catch misconfigurations before they reach production.",
  openGraph: {
    title: "riveter — Infrastructure Validation CLI",
    description:
      "Validate Terraform configurations against 15+ compliance frameworks. Catch misconfigurations before they reach production.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col" style={{ background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
