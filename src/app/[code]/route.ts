import { NextRequest, NextResponse } from "next/server";
import { getLinkByCode, recordLinkClick } from "@/lib/links";
import { isValidCode } from "@/lib/code";

type Params = {
  params: {
    code: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  if (!isValidCode(params.code)) {
    return NextResponse.json({ message: "Invalid code" }, { status: 404 });
  }

  const link = await getLinkByCode(params.code);
  if (!link) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  try {
    await recordLinkClick(params.code);
  } catch (error) {
    console.error("Failed to record click", error);
  }

  return NextResponse.redirect(link.url, {
    status: 302,
  });
}

