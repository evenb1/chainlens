import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

    if (!wallet || wallet.length !== 44) {
      return NextResponse.json(
        { message: "Invalid wallet address provided." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.solscan.io/account/tokens?account=${wallet}`;
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch wallet data." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An unexpected error occurred.", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred.", error: "Unknown error" },
      { status: 500 }
    );
  }
}
