import RegisterForm from "@/components/auth/RegisterForm";
import RegisterHeader from "@/components/auth/RegisterHeader";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col gap-6">
      <RegisterHeader />
      <RegisterForm />
    </section>
  );
}
