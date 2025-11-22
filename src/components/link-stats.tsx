import { LinkDTO } from "@/lib/links";
import { buildShortUrl, formatTimestamp } from "@/lib/utils";
import Link from "next/link";

export function LinkStats({ link, baseUrl }: { link: LinkDTO; baseUrl: string }) {
  const shortUrl = buildShortUrl(link.code, baseUrl);
  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/50 p-8 shadow-2xl shadow-black/40">
      <div>
        <p className="text-sm uppercase tracking-widest text-indigo-200">Code</p>
        <h1 className="text-4xl font-semibold text-white">{link.code}</h1>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-indigo-200 underline underline-offset-4"
        >
          {shortUrl}
        </a>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <StatsItem label="Destination" value={link.url} isLink />
        <StatsItem label="Total clicks" value={link.clickCount.toLocaleString()} />
        <StatsItem label="Last clicked" value={formatTimestamp(link.lastClicked)} />
        <StatsItem label="Created" value={new Date(link.createdAt).toLocaleString()} />
      </dl>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50"
        >
          ← Back to dashboard
        </Link>
        <Link
          href={`/api/links/${link.code}`}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          View JSON stats
        </Link>
      </div>
    </div>
  );
}

function StatsItem({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block truncate text-lg font-semibold text-indigo-100 underline decoration-transparent hover:decoration-indigo-200"
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      )}
    </div>
  );
}

