import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet address is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.solscan.io/account/tokens?account=${wallet}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_SOLSCAN_API_KEY`, // Replace with your API key
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch wallet data." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
