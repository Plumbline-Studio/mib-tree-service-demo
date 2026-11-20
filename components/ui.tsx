import React from "react";
import { bizInfo, people, type Biz, type Status } from "../lib/data";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Logo({ size = 36 }: { size?: number }) {
  // A simple tree on a round badge. Stand-in until MIB's own logo goes in.
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="var(--brand)" />
      <path d="M20 6 L30 20 H25 L32 29 H8 L15 20 H10 Z" fill="var(--brand-ink)" />
      <rect x="18" y="29" width="4" height="6" rx="1" fill="var(--safety)" />
    </svg>
  );
}

export function Avatar({ id }: { id: string }) {
  const p = people[id];
  return (
    <span title={p?.name} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--chip)] text-xs font-semibold text-[var(--brand-strong)]">
      {p?.initials}
    </span>
  );
}

export function Who({ id }: { id: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Avatar id={id} />
      <span className="truncate text-sm text-[var(--ink-soft)]">{people[id]?.name}</span>
    </span>
  );
}

export function BizTag({ b }: { b: Biz }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold" style={{ color: bizInfo[b].color }}>
      <span className="h-2 w-2 rounded-full" style={{ background: bizInfo[b].color }} />
      {bizInfo[b].short}
    </span>
  );
}

export function Pill({ tone, children, onClick }: { tone: "good" | "bad" | "warn" | "brand"; children: React.ReactNode; onClick?: () => void }) {
  const cls = cx("inline-flex min-h-[28px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", `pill-${tone}`);
  if (onClick) return <button onClick={onClick} className={cls} title="Tap to change">{children}</button>;
  return <span className={cls}>{children}</span>;
}

const statusText: Record<Status, string> = { on: "On track", off: "Behind", done: "Done" };
export function StatusPill({ s, onClick }: { s: Status; onClick?: () => void }) {
  return (
    <Pill tone={s === "on" ? "good" : s === "off" ? "bad" : "brand"} onClick={onClick}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusText[s]}
    </Pill>
  );
}

export function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const cls = cx("block w-full min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-left", onClick && "active:bg-[var(--sunk)]", className);
  if (onClick) return <button onClick={onClick} className={cls}>{children}</button>;
  return <div className={cls}>{children}</div>;
}

export function Title({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      {eyebrow && <div className="label mb-1">{eyebrow}</div>}
      <h1 className="font-display text-[32px] font-semibold leading-none text-[var(--ink)]">{title}</h1>
      {sub && <p className="mt-2 text-[15px] text-[var(--muted)]">{sub}</p>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="mb-4 grid rounded-xl bg-[var(--sunk)] p-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }} role="tablist">
      {items.map(([id, label]) => (
        <button key={id} role="tab" aria-selected={value === id} onClick={() => onChange(id)} className={cx("min-h-[40px] rounded-lg px-2 text-sm font-semibold", value === id ? "bg-[var(--surface)] text-[var(--ink)] shadow-sm" : "text-[var(--muted)]")}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function money(v: number) {
  return `$${v.toLocaleString("en-US")}`;
}

export function fmt(v: number, f: "money" | "count" | "pct" | "min") {
  if (f === "money") return v >= 10000 ? `$${Math.round(v / 1000)}K` : money(v);
  if (f === "pct") return `${v}%`;
  if (f === "min") return v >= 60 ? `${Math.round(v / 60)} hr` : `${v} min`;
  return v.toLocaleString("en-US");
}

export function Sparkline({ values, goal, better }: { values: number[]; goal: number; better: "up" | "down" }) {
  const all = [...values, goal];
  const min = Math.min(...all) * 0.95;
  const max = Math.max(...all) * 1.05;
  const w = 96, h = 30;
  const x = (i: number) => (i / (values.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min || 1)) * h;
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = values[values.length - 1];
  const hit = better === "up" ? last >= goal : last <= goal;
  return (
    <svg width={w} height={h + 4} viewBox={`0 -2 ${w} ${h + 4}`} aria-hidden="true" className="shrink-0 overflow-visible">
      <line x1="0" x2={w} y1={y(goal)} y2={y(goal)} stroke="var(--line-strong)" strokeDasharray="3 3" />
      <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2" />
      <circle cx={x(values.length - 1)} cy={y(last)} r="3.5" fill={hit ? "var(--good)" : "var(--bad)"} />
    </svg>
  );
}

export function Sheet({ title, eyebrow, onClose, children }: { title: string; eyebrow?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div role="dialog" aria-label={title} className="safe-bottom max-h-[90vh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-[var(--surface)] px-4 pt-3" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--line-strong)]" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && <div className="label">{eyebrow}</div>}
            <h2 className="font-display text-2xl font-semibold leading-tight">{title}</h2>
          </div>
          <button className="btn-quiet shrink-0" onClick={onClose}>Close</button>
        </div>
        <div className="pb-6">{children}</div>
      </div>
    </div>
  );
}

export function PhotoTile({ seed }: { seed: number }) {
  // Drawn stand-in for a job photo.
  const hue = [95, 110, 80, 60, 120, 100][seed % 6];
  return (
    <svg viewBox="0 0 60 60" className="aspect-square w-full rounded-lg" aria-label="Sample job photo">
      <rect width="60" height="60" fill={`hsl(${hue} 25% 78%)`} />
      <rect y="42" width="60" height="18" fill={`hsl(${hue} 30% 45%)`} />
      <path d={`M${18 + (seed % 3) * 6} 44 L${24 + (seed % 3) * 6} 14 L${30 + (seed % 3) * 6} 44 Z`} fill={`hsl(${hue + 20} 40% 30%)`} />
      <rect x={23 + (seed % 3) * 6} y="40" width="2" height="6" fill="#5b3d26" />
    </svg>
  );
}
