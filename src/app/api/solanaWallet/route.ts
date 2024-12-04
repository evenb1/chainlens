import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();
    console.log("Wallet Address Received:", wallet);

    // Validate wallet address
    if (!wallet || wallet.length !== 44) {
      console.error("Invalid wallet address:", wallet);
      return NextResponse.json(
        { message: "Invalid wallet address provided." },
        { status: 400 }
      );
    }

    // Build Solscan API URL
    const apiUrl = `https://api.solscan.io/account/tokens?account=${wallet}`;
    console.log("Fetching from Solscan API URL:", apiUrl);

    // Call Solscan API
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`, // Use environment variable for API key
      },
    });

    console.log("Solscan Response Status:", response.status);

    // Parse response
    const data = await response.json();
    console.log("Solscan Response Data:", data);

    if (!response.ok) {
      console.error("API Response Error:", data);
      return NextResponse.json(
        { message: data.message || "Failed to fetch wallet data." },
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in API Route:", error.message);
      return NextResponse.json(
        {
          message: "An unexpected error occurred.",
          error: error.message, // Include error details
        },
        { status: 500 }
      );
    }

    // Handle unknown error
    console.error("Unknown Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
