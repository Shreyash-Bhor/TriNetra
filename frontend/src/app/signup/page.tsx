import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import { SignUpForm } from "@/components/signup";

export default function SignupPage() {
  return (
    <AuthRedirect>
      <AuthPageShell>
        <SignUpForm />
      </AuthPageShell>
    </AuthRedirect>
  );
}
