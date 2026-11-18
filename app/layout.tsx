import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DATAVERSE | National Level Tech Symposium (Dr. Doom Edition)",
  description: "Enter the Citadel of Innovation. DATAVERSE Tech Symposium brings together cutting-edge AI, Data Science, and Multiverse challenges under the sovereign banner of Dr. Doom.",
  icons: {
    icon: "/images/characters/doom.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Cinzel+Decorative:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#05080c] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
