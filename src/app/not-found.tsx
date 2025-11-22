import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-rose-200">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">That link doesn’t exist</h1>
      <p className="mt-2 max-w-lg text-slate-400">
        The short code you requested was deleted or never created. Try searching from the dashboard.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
      >
        Return home
      </Link>
    </div>
  );
}

