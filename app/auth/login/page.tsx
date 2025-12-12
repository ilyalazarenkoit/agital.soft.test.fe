import LoginForm from "@/components/auth/LoginForm";
import LoginHeader from "@/components/auth/LoginHeader";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-6">
      <LoginHeader />
      <LoginForm />
    </section>
  );
}
