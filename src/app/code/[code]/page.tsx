import { notFound } from "next/navigation";
import { LinkStats } from "@/components/link-stats";
import { getLinkByCode } from "@/lib/links";

export const revalidate = 0;

type Params = {
  params: {
    code: string;
  };
};

export default async function LinkStatsPage({ params }: Params) {
  const link = await getLinkByCode(params.code);
  if (!link) {
    notFound();
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

  return (
    <div className="py-10">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-widest text-indigo-200">Analytics</p>
        <h1 className="text-4xl font-semibold text-white">Stats for /{params.code}</h1>
        <p className="text-slate-400">Live metrics backed by Neon Postgres.</p>
      </div>
      <LinkStats link={link} baseUrl={baseUrl} />
    </div>
  );
}

