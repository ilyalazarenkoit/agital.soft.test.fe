"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/LocaleProvider";
import { saveToken, saveUser } from "@/lib/auth";
import Link from "next/link";

type ValidationErrors = {
  name?: string;
  birth?: string;
  email?: string;
  password?: string;
  general?: string;
};

type RegisterResponse = {
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

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = t.auth.nameMinLength;
    }

    if (!formData.birth) {
      newErrors.birth = t.auth.birthRequired;
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.birth)) {
        newErrors.birth = t.auth.birthFormat;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t.auth.emailInvalid;
    }

    if (formData.password.length < 6) {
      newErrors.password = t.auth.passwordMinLength;
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
      const base =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
        "http://127.0.0.1:3000";
      const res = await fetch(`${base}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: RegisterResponse | ErrorResponse = await res.json();

      if (!res.ok) {
        const errorData = data as ErrorResponse;
        const newErrors: ValidationErrors = {};

        if (res.status === 400) {
          const messages = Array.isArray(errorData.message)
            ? errorData.message
            : [errorData.message || t.auth.validationError];

          messages.forEach((msg) => {
            if (msg.includes("email")) {
              newErrors.email = msg;
            } else if (msg.includes("password")) {
              newErrors.password = msg;
            } else if (msg.includes("name")) {
              newErrors.name = msg;
            } else if (msg.includes("birth")) {
              newErrors.birth = msg;
            }
          });
        } else if (res.status === 409) {
          newErrors.email = t.auth.emailExists;
        } else {
          newErrors.general = t.auth.registrationFailed;
        }

        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const successData = data as RegisterResponse;
      saveToken(successData.token);
      saveUser(successData.user);
      router.push("/home");
    } catch {
      setErrors({
        general: t.auth.registrationFailed,
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
          htmlFor="name"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.auth.name}
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder={t.auth.namePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="birth"
          className="text-sm font-medium text-(--dialog-text-color)"
        >
          {t.auth.birth}
        </label>
        <Input
          id="birth"
          type="date"
          value={formData.birth}
          onChange={(e) => handleChange("birth", e.target.value)}
          aria-invalid={!!errors.birth}
          aria-describedby={errors.birth ? "birth-error" : undefined}
        />
        {errors.birth && (
          <p id="birth-error" className="text-sm text-red-600">
            {errors.birth}
          </p>
        )}
      </div>

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
        {isLoading ? t.auth.registering : t.auth.register}
      </Button>

      <p className="text-center text-sm font-medium text-(--dialog-link-secondary-color)">
        {t.auth.alreadyHaveAccount}{" "}
        <Link
          href="/auth/login"
          className="font-medium text-(--dialog-link-primary-color) hover:underline"
        >
          {t.auth.signIn}
        </Link>
      </p>
    </form>
  );
}
