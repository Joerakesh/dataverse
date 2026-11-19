import { NextResponse } from "next/server";
import { searchColleges } from "@/src/data/colleges";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json({ success: true, colleges: searchColleges(query) });
}
