import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RE.HAB · Demo MVP menisco",
  description: "Demo condivisa del percorso fisioterapico post-operatorio del menisco"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
