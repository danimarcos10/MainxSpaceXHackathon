import { StudentAccessGate } from "@/components/StudentAccessGate";

export default function ListRoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudentAccessGate mode="page">{children}</StudentAccessGate>;
}
