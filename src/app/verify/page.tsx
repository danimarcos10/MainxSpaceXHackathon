import { StudentEmailVerification } from "@/components/StudentEmailVerification";

export const metadata = {
  title: "Verify your student email",
  description: "Confirm your Maastricht University email to use RoomRelay.",
};

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-10 sm:px-8 sm:py-14">
      <StudentEmailVerification />
    </div>
  );
}
