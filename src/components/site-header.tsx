import Link from "next/link";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/api/links", label: "API explorer" },
  { href: "/healthz", label: "Healthcheck" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="text-lg font-semibold tracking-tight text-white" href="/">
          TinyLink
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "transition hover:text-white",
                item.href === "/healthz" && "font-mono text-xs uppercase tracking-wide",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://vercel.com/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/10 sm:inline-flex"
          >
            Deploy to Vercel
          </a>
          <a
            href="https://neon.tech"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
          >
            Neon Console
          </a>
        </div>
      </div>
    </header>
  );
}

