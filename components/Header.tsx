"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, startTransition } from "react";
import { ShoppingCart, User as UserIcon, Globe } from "@phosphor-icons/react";
import { useLocale } from "@/components/LocaleProvider";
import { getUser, logout } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale, setLocale, locales } = useLocale();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    startTransition(() => {
      setUser(getUser());
    });

    const handleStorageChange = () => {
      setUser(getUser());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/home");
  };

  const navItems = [
    { href: "/home", label: t.header.home },
    { href: "/catalog", label: t.header.catalog },
    { href: "/reviews", label: t.header.reviews },
    { href: "/contacts", label: t.header.contacts },
  ];

  const isActive = (href: string) => {
    if (href === "/home") {
      return pathname === "/home" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className="sticky top-0 z-30 border-b border-(--dialog-separator-color) bg-(--dialog-background-color) shadow-sm"
      suppressHydrationWarning
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5">
        <Link
          href="/home"
          className="flex items-center gap-2 text-(--dialog-text-color) shrink-0"
          aria-label={`${t.header.brandLabel} — ${t.header.home}`}
          suppressHydrationWarning
        >
          <span
            className="text-2xl font-semibold tracking-tight"
            suppressHydrationWarning
          >
            {t.header.brandLabel}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 mx-auto text-base font-semibold text-(--dialog-link-secondary-color) md:flex"
          suppressHydrationWarning
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 transition-all"
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-(--dialog-button-accept-all-color)" />
                )}
                {!active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-(--dialog-separator-color) scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-(--dialog-separator-color) bg-white px-4 py-2 text-sm font-semibold text-(--dialog-text-color) shadow-sm transition-all hover:border-(--dialog-button-accept-all-color) hover:shadow-md focus:outline-none "
                  aria-label="Select language"
                >
                  <Globe weight="bold" className="h-4 w-4" />
                  <span>{locales.find((l) => l.code === locale)?.label}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map((item) => (
                  <DropdownMenuItem
                    key={item.code}
                    onClick={() => setLocale(item.code)}
                    className={`cursor-pointer ${
                      locale === item.code
                        ? "bg-(--dialog-card-background-color)"
                        : ""
                    }`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user && (
                <span
                  className="hidden text-base font-medium text-(--dialog-text-color) sm:inline"
                  suppressHydrationWarning
                >
                  {user.name}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-(--dialog-separator-color) px-3 py-2 text-(--dialog-text-color) transition hover:border-(--dialog-button-accept-all-color) hover:text-(--dialog-button-accept-all-color)"
                    aria-label="Profile"
                  >
                    <UserIcon weight="bold" className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href="/profile">
                          {t.header.profile}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleLogout}
                      >
                        {t.auth.logout}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href="/auth/login">
                          {t.auth.signIn}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link className="cursor-pointer" href="/auth/register">
                          {t.auth.register}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              href="/cart"
              className="flex cursor-pointer items-center gap-1 rounded-full border border-(--dialog-separator-color) px-3 py-2 text-(--dialog-text-color) transition hover:border-(--dialog-button-accept-all-color) hover:text-(--dialog-button-accept-all-color)"
              aria-label={t.header.cart}
            >
              <ShoppingCart weight="bold" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
