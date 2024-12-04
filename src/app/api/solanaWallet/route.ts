import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();
    console.log("Wallet Address Received:", wallet);

    if (!wallet) {
      console.error("No wallet address provided");
      return NextResponse.json(
        { message: "Wallet address is required." },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.solscan.io/account/tokens?account=${wallet}`;
    console.log("Fetching data from Solscan API:", apiUrl);

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
      console.error("Error in Solscan API Response:", data);
      return NextResponse.json(
        { message: data.message || "Failed to fetch wallet data." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API Route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
