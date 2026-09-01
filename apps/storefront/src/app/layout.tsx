import "./globals.css";

export const metadata = {
  title: "Merchant Storefront",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
