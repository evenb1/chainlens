import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();
    console.log("Wallet Address Received:", wallet);

    if (!wallet || wallet.length !== 44) {
      console.error("Invalid wallet address:", wallet);
      return NextResponse.json(
        { message: "Invalid wallet address provided." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.solscan.io/account/tokens?account=${wallet}`;
    console.log("Fetching from Solscan API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
      },
    });

    console.log("Solscan Response Status:", response.status);

    const data = await response.json();
    console.log("Solscan Response Data:", data);

    if (!response.ok) {
      console.error("API Response Error:", data);
      return NextResponse.json(
        { message: data.message || "Failed to fetch wallet data." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API Route:", error);
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
