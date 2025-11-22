import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, recordLinkClick } from "@/lib/links";
import { isValidCode } from "@/lib/code";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params;

  if (!isValidCode(code)) {
    return NextResponse.json({ message: "Invalid code" }, { status: 404 });
  }

  const link = await getLinkByCode(code);
  if (!link) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    await recordLinkClick(code);
  } catch (error) {
    console.error("Failed to record click", error);
  }

  return NextResponse.redirect(link.url, { status: 302 });
}
