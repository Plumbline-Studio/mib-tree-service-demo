"use client";
import React, { useState } from "react";
import { stages, tickets as start, units, unitOrder, type Ticket, type Unit } from "../../lib/setups";
import { cx, Sheet } from "../ui";
import { UnitDot } from "./Frame";

export default function Flow() {
  const [list, setList] = useState<Ticket[]>(start);
  const [only, setOnly] = useState<Unit | "all">("all");
  const [who, setWho] = useState<string | null>(null);
  const move = (id: string, dir: 1 | -1) =>
    setList(list.map((t) => {
      if (t.id !== id) return t;
      const i = stages.indexOf(t.stage) + dir;
      return i < 0 || i >= stages.length ? t : { ...t, stage: stages[i], note: undefined };
    }));
  const shown = list.filter((t) => only === "all" || t.unit === only);
  const owed = list.filter((t) => t.stage === "Done").length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setOnly("all")} className={cx("rounded-full px-3 py-1.5 text-sm font-semibold", only === "all" ? "bg-[#0c0701] text-[#fdf3e7]" : "bg-[var(--sunk)]")}>All businesses</button>
        {unitOrder.filter((u) => u !== "office").map((u) => (
          <button key={u} onClick={() => setOnly(u)} className={cx("rounded-full px-3 py-1.5 text-sm font-semibold", only === u ? "text-white" : "bg-[var(--sunk)]")} style={only === u ? { background: units[u].color } : {}}>
            {units[u].icon} {units[u].short}
          </button>
        ))}
        <span className="ml-auto text-sm font-semibold text-[var(--bad)]">{owed} done but not paid yet</span>
      </div>
      <p className="mb-3 text-sm text-[var(--muted)]">Tap ▶ to move a card along. Tap a name to see everything that customer has with MIB.</p>

      <div className="grid gap-3 overflow-x-auto pb-2" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(220px, 1fr))` }}>
        {stages.map((s) => {
          const col = shown.filter((t) => t.stage === s);
          return (
            <div key={s} className={cx("rounded-2xl p-2", s === "Done" ? "bg-[var(--bad-bg)]" : s === "Paid" ? "bg-[var(--good-bg)]" : "bg-[var(--sunk)]")}>
              <div className="flex items-baseline justify-between px-1 pb-2">
                <span className="font-display text-2xl leading-none">{s === "Done" ? "Done, not paid" : s}</span>
                <span className="text-sm font-semibold text-[var(--muted)]">{col.length}</span>
              </div>
              <div className="space-y-2">
                {col.map((t) => (
                  <div key={t.id} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5" style={{ borderLeft: `5px solid ${units[t.unit].color}` }}>
                    <UnitDot u={t.unit} />
                    <div className="mt-0.5 text-[15px] font-semibold leading-snug">{t.title}</div>
                    <button onClick={() => setWho(t.who)} className="text-left text-sm text-[var(--brand-strong)] underline-offset-2 hover:underline">{t.who}</button>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-semibold tabular-nums">{t.money}</span>
                      <span className="flex gap-1">
                        {s !== stages[0] && <button aria-label="Move back" onClick={() => move(t.id, -1)} className="h-8 w-8 rounded-lg bg-[var(--sunk)] text-sm">◀</button>}
                        {s !== stages[stages.length - 1] && <button aria-label="Move on" onClick={() => move(t.id, 1)} className="h-8 w-8 rounded-lg bg-[#ec9220] text-sm">▶</button>}
                      </span>
                    </div>
                    {t.note && <div className={cx("mt-1 text-xs", /Thomas|late/.test(t.note) ? "font-semibold text-[var(--bad)]" : "text-[var(--muted)]")}>{t.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {who && (
        <Sheet title={who} eyebrow="Everything with this customer" onClose={() => setWho(null)}>
          <div className="space-y-2">
            {list.filter((t) => t.who === who).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3">
                <div><UnitDot u={t.unit} /><div className="font-semibold">{t.title}</div></div>
                <div className="text-right"><div className="font-semibold">{t.money}</div><div className="text-xs text-[var(--muted)]">{t.stage}</div></div>
              </div>
            ))}
          </div>
          {who === "Valley Feed Co." && <p className="mt-3 text-sm text-[var(--muted)]">One customer, two businesses: a tree job and a mulch order from the yard. They show up once.</p>}
        </Sheet>
      )}
    </div>
  );
}
