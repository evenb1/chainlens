import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mintAddress = searchParams.get("mintAddress");

  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenMetadata",
    params: [mintAddress],
  };

  try {
    const response = await fetch("https://your-quicknode-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch token metadata" }, { status: 500 });
  }
}
