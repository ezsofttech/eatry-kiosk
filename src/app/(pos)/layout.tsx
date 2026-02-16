import { POSLayout } from "@/components/pos/POSLayout";

export default function POSRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <POSLayout>{children}</POSLayout>;
}
