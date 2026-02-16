import { KOTLayout } from "@/components/kot/KOTLayout";

export default function KOTRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KOTLayout>{children}</KOTLayout>;
}
