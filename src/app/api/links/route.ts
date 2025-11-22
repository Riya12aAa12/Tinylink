import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createLink, getAllLinks } from "@/lib/links";
import { createLinkSchema } from "@/lib/validators";

export async function GET() {
  const links = await getAllLinks();
  return NextResponse.json({ data: links });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const link = await createLink(parsed.data.url, parsed.data.code);
    return NextResponse.json({ data: link }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { message: "Code already exists. Try another." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

