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

    const apiUrl = `https://pro-api.solscan.io/v2.0/account/token-accounts?address=${wallet}`;
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
      },
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      return NextResponse.json(
        { message: errorData.message || "Failed to fetch wallet data." },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("API Response Data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred.", error: String(error) },
      { status: 500 }
    );
  }
}
