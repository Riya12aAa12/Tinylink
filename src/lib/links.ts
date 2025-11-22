import { prisma } from "./prisma";
import { generateCode, MIN_CODE_LENGTH, MAX_CODE_LENGTH } from "./code";
import type { Link } from "@prisma/client";

export type LinkDTO = {
  id: string;
  code: string;
  url: string;
  clickCount: number;
  lastClicked: string | null;
  createdAt: string;
  updatedAt: string;
};

function serialize(link: Link): LinkDTO {
  return {
    ...link,
    lastClicked: link.lastClicked?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
}

export async function getAllLinks(): Promise<LinkDTO[]> {
  const links = await prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return links.map(serialize);
}

export async function getLinkByCode(code: string): Promise<LinkDTO | null> {
  const link = await prisma.link.findUnique({
    where: { code },
  });
  return link ? serialize(link) : null;
}

export async function createLink(url: string, requestedCode?: string): Promise<LinkDTO> {
  const code = requestedCode ?? (await findAvailableCode());

  const link = await prisma.link.create({
    data: {
      url,
      code,
    },
  });

  return serialize(link);
}

async function findAvailableCode(): Promise<string> {
  let attempt = 0;
  while (attempt < 5) {
    const len = MIN_CODE_LENGTH + (attempt % (MAX_CODE_LENGTH - MIN_CODE_LENGTH + 1));
    const candidate = generateCode(len);
    const existing = await prisma.link.findUnique({ where: { code: candidate } });
    if (!existing) {
      return candidate;
    }
    attempt += 1;
  }
  throw new Error("Could not generate a unique code. Please specify one manually.");
}

export async function deleteLink(code: string): Promise<void> {
  await prisma.link.delete({
    where: { code },
  });
}

export async function recordLinkClick(code: string): Promise<LinkDTO | null> {
  const link = await prisma.link.update({
    where: { code },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });
  return serialize(link);
}

