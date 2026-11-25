"use client";
import React from "react";
import Link from "next/link";
import { setups, units, type Unit } from "../../lib/setups";
import { Logo, cx } from "../ui";

// Top bar shared by every setup: which setup this is, and a quick way to the others.
export function SetupFrame({ slug, children, dark }: { slug: string; children: React.ReactNode; dark?: boolean }) {
  const s = setups.find((x) => x.slug === slug)!;
  return (
    <div className={cx("min-h-screen", dark ? "bg-[#0c0701] text-[#fdf3e7]" : "bg-[var(--bg)]")}>
      <header className="sticky top-0 z-40 border-b border-black/20 bg-[#0c0701] text-[#fdf3e7]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
          <Link href="/setups" className="flex items-center gap-3" aria-label="All six setups">
            <span className="rounded-md bg-[#fdf3e7] px-1.5 py-1"><Logo size={26} /></span>
            <span className="hidden text-sm font-semibold text-[#ec9220] sm:inline">6 ways to set up Home Base</span>
          </Link>
          <nav className="flex flex-1 flex-wrap items-center justify-end gap-1" aria-label="Setups">
            {setups.map((x) => (
              <Link
                key={x.slug}
                href={`/setups/${x.slug}`}
                title={x.name}
                className={cx(
                  "flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-bold",
                  x.slug === slug ? "bg-[#ec9220] text-[#0c0701]" : "bg-white/10 text-[#fdf3e7] hover:bg-white/20",
                )}
              >
                {x.n}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 pb-2">
          <div className="font-display text-2xl leading-none tracking-wide">
            <span className="text-[#ec9220]">Setup {s.n}:</span> {s.name}
          </div>
          <p className="mt-1 text-sm text-[#e6d8c6]">{s.line}</p>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-5">{children}</main>
      <footer className={cx("mx-auto max-w-[1400px] px-4 pb-8 text-xs", dark ? "text-[#b0a08c]" : "text-[var(--muted)]")}>
        Sample only. Every name, number and message is made up.
      </footer>
    </div>
  );
}

export function UnitDot({ u, label }: { u: Unit; label?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold" style={{ color: units[u].color }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: units[u].color }} />
      {label !== false && units[u].short}
    </span>
  );
}

export function Tone({ tone, children }: { tone?: "good" | "bad" | "warn"; children: React.ReactNode }) {
  return (
    <span className={cx("inline-flex min-h-[24px] items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", tone ? `pill-${tone}` : "bg-[var(--sunk)] text-[var(--ink-soft)]")}>
      {children}
    </span>
  );
}

export function Box({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)]", className)}>{children}</div>;
}
