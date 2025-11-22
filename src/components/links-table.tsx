"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, ExternalLink, Trash2, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { LinkDTO } from "@/lib/links";
import { buildShortUrl, formatTimestamp } from "@/lib/utils";

type SortKey = "recent" | "clicks" | "code";

const sortOptions: Record<SortKey, string> = {
  recent: "Newest",
  clicks: "Most clicks",
  code: "Code A → Z",
};

export function LinksTable({ links, baseUrl }: { links: LinkDTO[]; baseUrl: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const dataset = [...links];

    switch (sort) {
      case "clicks":
        dataset.sort((a, b) => b.clickCount - a.clickCount);
        break;
      case "code":
        dataset.sort((a, b) => a.code.localeCompare(b.code));
        break;
      default:
        dataset.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (!normalized) return dataset;
    return dataset.filter(
      (link) =>
        link.code.toLowerCase().includes(normalized) ||
        link.url.toLowerCase().includes(normalized),
    );
  }, [links, query, sort]);

  async function handleCopy(code: string) {
    const shortUrl = buildShortUrl(code, baseUrl);
    try {
      await navigator.clipboard.writeText(shortUrl);
    } catch {
      alert("Clipboard access was blocked. Copy manually instead.");
      return;
    }
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode((current) => (current === code ? null : current));
    }, 1500);
  }

  async function handleDelete(code: string) {
    const confirmed = window.confirm(
      "Delete this short link? Visitors will no longer be redirected.",
    );
    if (!confirmed) return;

    setDeletingCode(code);
    const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
    setDeletingCode(null);
    if (!res.ok) {
      alert("Unable to delete link. Please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 shadow-2xl shadow-indigo-950/20">
      <div className="flex flex-col gap-4 border-b border-white/5 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Your links</h2>
          <p className="text-sm text-slate-400">
            Search, copy, or delete links in your workspace.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <input
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by code or URL"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            {Object.entries(sortOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-white/5 text-left font-medium text-slate-300">
            <tr>
              <th className="px-6 py-3">Short code</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3 text-center">Clicks</th>
              <th className="px-6 py-3">Last clicked</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white">
            {filtered.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-slate-400" colSpan={5}>
                  No links yet. Create one to get started!
                </td>
              </tr>
            )}
            {filtered.map((link) => {
              const shortUrl = buildShortUrl(link.code, baseUrl);
              return (
                <tr key={link.id} className="transition hover:bg-white/5">
                  <td className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{link.code}</span>
                      <button
                        type="button"
                        className="rounded-full border border-white/10 bg-white/5 p-1 text-slate-300 transition hover:text-white"
                        onClick={() => handleCopy(link.code)}
                        aria-label={`Copy link ${shortUrl}`}
                      >
                        {copiedCode === link.code ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">{shortUrl}</p>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex max-w-xs items-center gap-1 text-indigo-200 underline decoration-transparent transition hover:decoration-indigo-300 md:max-w-md"
                      title={link.url}
                    >
                      <span className="truncate">{link.url}</span>
                      <ExternalLink size={14} />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold">{link.clickCount}</td>
                  <td className="px-6 py-4 text-slate-300">{formatTimestamp(link.lastClicked)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/code/${link.code}`}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-indigo-400 hover:text-white"
                      >
                        <BarChart3 size={14} />
                        Stats
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-rose-300 hover:text-white"
                        onClick={() => handleDelete(link.code)}
                        disabled={deletingCode === link.code}
                      >
                        <Trash2 size={16} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

