import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { AuthRedirect } from "@/components/auth/auth-redirect";
import { LoginForm } from "@/components/login";

export default function LoginPage() {
  return (
    <AuthRedirect>
      <AuthPageShell>
        <LoginForm />
      </AuthPageShell>
    </AuthRedirect>
  );
}
