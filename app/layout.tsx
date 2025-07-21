import "./globals.css";
import localFont from "next/font/local";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // строка, не импорт
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff", // строка, не импорт
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    {children}
    </body>


    </html>
  );
}