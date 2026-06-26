import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Travelio",
  description: "Discover hotels and places for your next trip",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-white">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
