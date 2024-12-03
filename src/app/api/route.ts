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

    // Replace this with an actual API call (e.g., Etherscan, Alchemy, etc.)
    const apiResponse = await fetch(`https://api.etherscan.io/api`, {
      method: "GET",
      headers: {
        // Replace with your API key and appropriate headers
        Authorization: `Bearer YOUR_API_KEY`,
      },
    });

    const apiData = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: apiData.message || "Failed to fetch data." },
        { status: 500 }
      );
    }

    return NextResponse.json(apiData);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
