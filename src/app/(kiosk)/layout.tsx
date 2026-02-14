import { KioskLayout } from "@/components/kiosk/KioskLayout";

export default function KioskRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KioskLayout>{children}</KioskLayout>;
}
