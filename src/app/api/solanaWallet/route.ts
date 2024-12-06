import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet, page = 1, page_size = 10 } = await req.json();
    console.log("Wallet Address Received:", wallet);

    if (!wallet || wallet.length !== 44) {
      return NextResponse.json(
        { message: "Invalid wallet address provided." },
        { status: 400 }
      );
    }

    const apiUrl = `https://pro-api.solscan.io/v2.0/account/token-accounts?page=${page}&page_size=${page_size}&address=${wallet}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch wallet data." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
