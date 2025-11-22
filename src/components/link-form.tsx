"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { createLinkSchema } from "@/lib/validators";
import { MIN_CODE_LENGTH, MAX_CODE_LENGTH } from "@/lib/code";

type FormStatus =
  | { state: "idle"; message?: string }
  | { state: "submitting" }
  | { state: "success"; shortUrl: string }
  | { state: "error"; message: string };

export function LinkForm({ baseUrl }: { baseUrl: string }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ url?: string; code?: string }>({});
  const [status, setStatus] = useState<FormStatus>({ state: "idle" });

  const isSubmitting = status.state === "submitting";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });
    setErrors({});

    const parsed = createLinkSchema.safeParse({
      url,
      code: code.trim() || undefined,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        url: fieldErrors.url?.[0],
        code: fieldErrors.code?.[0],
      });
      setStatus({ state: "idle" });
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.status === 409) {
        setErrors({ code: "That code is already taken. Try another." });
        setStatus({ state: "idle" });
        return;
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message ?? "Unable to save link");
      }

      const payload = await res.json();
      const generatedCode = payload?.data?.code ?? parsed.data.code;
      const origin = typeof window !== "undefined" ? window.location.origin : baseUrl;
      setStatus({
        state: "success",
        shortUrl: `${origin}/${generatedCode}`,
      });
      setUrl("");
      setCode("");
      router.refresh();
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Try again.",
      });
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="url">
          Destination URL
        </label>
        <Input
          id="url"
          placeholder="https://example.com/landing"
          type="url"
          autoComplete="off"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={isSubmitting}
          required
        />
        {errors.url && <p className="mt-2 text-sm text-rose-400">{errors.url}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="code">
          Custom code <span className="text-slate-400">(optional)</span>
        </label>
        <Input
          id="code"
          placeholder={`alphanumeric, ${MIN_CODE_LENGTH}-${MAX_CODE_LENGTH} chars`}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={isSubmitting}
        />
        {errors.code && <p className="mt-2 text-sm text-rose-400">{errors.code}</p>}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Shorten link"}
      </Button>
      {status.state === "success" && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Link ready:{" "}
          <a className="font-semibold underline" href={status.shortUrl} target="_blank" rel="noreferrer">
            {status.shortUrl}
          </a>
        </p>
      )}
      {status.state === "error" && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {status.message}
        </p>
      )}
    </form>
  );
}

