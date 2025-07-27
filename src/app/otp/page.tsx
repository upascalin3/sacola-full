import OtpPageContent from "./OtpPageContent";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "OTP Verification | SACOLA",
  description: "Enter the OTP sent to your email to verify your identity.",
};

export default function Page() {
  return (
    <ProtectedRoute>
      <OtpPageContent />
    </ProtectedRoute>
  );
}
