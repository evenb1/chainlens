import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet, page = 1, page_size = 10 } = await req.json();

    if (!wallet || wallet.length !== 44) {
      return NextResponse.json(
        { message: "Invalid wallet address provided." },
        { status: 400 }
      );
    }

    const apiUrl = `https://pro-api.solscan.io/v2.0/account/transactions?page=${page}&page_size=${page_size}&address=${wallet}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch transactions." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: String(error) },
      { status: 500 }
    );
  }
}
