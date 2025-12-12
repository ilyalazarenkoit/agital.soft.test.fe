import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || DEFAULT_LIMIT, 1), 100);
  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "API_BASE_URL is not configured. Please set it in .env.local" },
      { status: 500 }
    );
  }

  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const url = `${base}/products/home?limit=${limit}`;


  try {
    const res = await fetch(url, {
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Failed to load products", detail: text },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Request failed", detail: (error as Error).message },
      { status: 500 }
    );
  }
}
