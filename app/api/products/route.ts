import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "newest";
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const q = searchParams.get("q");

  const page = Math.max(Number(pageParam) || DEFAULT_PAGE, 1);
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

  let url: string;
  if (q && q.trim()) {
    url = `${base.replace(/\/$/, "")}/products/search?q=${encodeURIComponent(
      q.trim()
    )}&page=${page}&limit=${limit}`;
  } else {
    url = `${base.replace(
      /\/$/,
      ""
    )}/products?sort=${sort}&page=${page}&limit=${limit}`;
  }

  try {
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
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
