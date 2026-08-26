import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudSaaS | ACG Demo",
  description: "Agentic Commerce Gateway Demonstration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}