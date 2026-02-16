import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eatry Cloud | Kiosk",
  description: "Eatry Cloud — Order your food, your way",
  viewport: {
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen antialiased overflow-x-hidden">
        <ThemeProvider>
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
