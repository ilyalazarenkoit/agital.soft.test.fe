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

  const { searchParams } = new URL(request.url);
  const starsParam = searchParams.get("stars");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const stars = starsParam ? parseInt(starsParam, 10) : undefined;
  const page = Math.max(Number(pageParam) || 1, 1);
  const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 100);

  if (stars !== undefined && (stars < 1 || stars > 5)) {
    return NextResponse.json(
      { error: "Stars must be between 1 and 5" },
      { status: 400 }
    );
  }

  try {
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

    const params = new URLSearchParams();
    if (stars !== undefined) {
      params.set("stars", stars.toString());
    }
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    const url = `${base.replace(
      /\/$/,
      ""
    )}/products/${id}/reviews?${params.toString()}`;


    const res = await fetch(url, {
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

export async function POST(
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

  try {
    const body = await request.json();
    const { name, stars, text } = body;

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

    const url = `${base.replace(/\/$/, "")}/products/${id}/reviews`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, stars, text }),
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
