"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/LocaleProvider";
import { saveToken, saveUser } from "@/lib/auth";
import Link from "next/link";

type ValidationErrors = {
  email?: string;
  password?: string;
  general?: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    birth: string;
  };
};

type ErrorResponse = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t.auth.emailInvalid;
    }

    if (!formData.password) {
      newErrors.password = t.auth.passwordRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        const newErrors: ValidationErrors = {};

        if (res.status === 401) {
          newErrors.general = t.auth.invalidCredentials;
        } else if (res.status === 400) {
          const messages = Array.isArray(errorData.message)
            ? errorData.message
            : [errorData.message || t.auth.validationError];

          messages.forEach((msg) => {
            if (msg.includes("email")) {
              newErrors.email = msg;
            } else if (msg.includes("password")) {
              newErrors.password = msg;
            }
          });
        } else {
          newErrors.general = t.auth.loginFailed;
        }

        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const successData = data as LoginResponse;
      saveToken(successData.token);
      saveUser(successData.user);
      router.push("/home");
    } catch {
      setErrors({
        general: t.auth.loginFailed,
      });
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.auth.email}
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t.auth.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.auth.password}
        </label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={t.auth.passwordPlaceholder}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-(--dialog-button-accept-all-color) text-(--dialog-button-accept-all-text-color) hover:bg-(--dialog-button-accept-all-color-hover)"
      >
        {isLoading ? t.auth.signingIn : t.auth.signIn}
      </Button>

      <p className="text-center text-sm font-medium text-(--dialog-link-secondary-color)">
        {t.auth.dontHaveAccount}{" "}
        <Link
          href="/auth/register"
          className="font-medium text-(--dialog-link-primary-color) hover:underline"
        >
          {t.auth.register}
        </Link>
      </p>
    </form>
  );
}
