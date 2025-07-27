import ResetPasswordPageContent from "./ResetPasswordPageContent";
import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata = {
  title: "Reset Password | SACOLA",
  description: "Enter your new password to reset your account password.",
};

export default function Page() {
  return (
    <ProtectedRoute>
      <ResetPasswordPageContent />
    </ProtectedRoute>
  );
}
