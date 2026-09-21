import { StudentAccessGate } from "@/components/StudentAccessGate";

export default function ListingDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudentAccessGate mode="booking">{children}</StudentAccessGate>;
}
