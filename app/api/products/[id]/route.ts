import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "API_BASE_URL is not configured. Please set it in .env.local" },
      { status: 500 }
    );
  }

  const base = apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;

  const url = `${base}/products/${id}`;


  try {
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Failed to load product", detail: text },
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
