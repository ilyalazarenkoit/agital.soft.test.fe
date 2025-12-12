import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const apiBaseUrl =
      process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        {
          error: "API_BASE_URL is not configured. Please set it in .env.local",
        },
        { status: 500 }
      );
    }

    const base = apiBaseUrl.endsWith("/")
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;

    const url = `${base.replace(/\/$/, "")}/auth/login`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Request failed", detail: (error as Error).message },
      { status: 500 }
    );
  }
}
