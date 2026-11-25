"use client";
import React, { useState } from "react";
import { monthEvents, monthName, monthStartWeekday, monthDays, todayNumbers, needsThomas, units, unitOrder, type Unit } from "../../lib/setups";
import { cx } from "../ui";

const week: { d: string; items: [Unit, string][] }[] = [
  { d: "Mon 30", items: [["tree", "6 tree jobs"], ["ship", "5 to ship"], ["office", "Thomas: 3 calls back"]] },
  { d: "Tue 1", items: [["store", "Store opens"], ["office", "Valpak mails"], ["tree", "4 tree jobs"]] },
  { d: "Wed 2", items: [["tree", "Valley Feed, day 1"], ["ship", "Freight pickup"]] },
  { d: "Thu 3", items: [["tree", "Valley Feed, day 2"], ["yard", "Mulch to Valley Feed"]] },
  { d: "Fri 4", items: [["office", "Yard bills due"], ["tree", "3 tree jobs"]] },
  { d: "Sat 5", items: [["store", "Splitter demo day"]] },
];

export default function Wall() {
  const [view, setView] = useState<"month" | "week">("month");
  const [hide, setHide] = useState<Unit[]>([]);
  const cells: (number | null)[] = [...Array(monthStartWeekday).fill(null), ...Array.from({ length: monthDays }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const toggle = (u: Unit) => setHide(hide.includes(u) ? hide.filter((x) => x !== u) : [...hide, u]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-white/10 p-1">
          {(["month", "week"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cx("rounded-md px-4 py-1.5 text-sm font-bold capitalize", view === v ? "bg-[#ec9220] text-[#0c0701]" : "text-[#fdf3e7]")}>{v}</button>
          ))}
        </div>
        {unitOrder.map((u) => (
          <button key={u} onClick={() => toggle(u)} className={cx("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold", hide.includes(u) ? "bg-white/5 text-white/40 line-through" : "bg-white/10")}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: units[u].color }} /> {units[u].short}
          </button>
        ))}
        <span className="text-sm text-[#b0a08c]">Tap a business to hide it. On the TV this just sits and updates itself.</span>
      </div>

      {/* The TV: a 16:9 box */}
      <div className="overflow-hidden rounded-2xl border-[6px] border-[#2a2018] bg-[#14100b] p-4 shadow-2xl">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ec9220]">MIB · Home Base</div>
            <div className="font-display text-5xl leading-none text-[#fdf3e7]">{view === "month" ? monthName : "This week"}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-5xl leading-none text-[#fdf3e7]">9:42 AM</div>
            <div className="text-sm text-[#b0a08c]">Monday, Nov 30 · 38°F, clear</div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
          {view === "month" ? (
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="pb-1 text-center text-xs font-bold uppercase tracking-wider text-[#b0a08c]">{d}</div>)}
              {cells.map((n, i) => (
                <div key={i} className={cx("min-h-[84px] rounded-md p-1.5", n ? "bg-[#1f1810]" : "")}>
                  {n && <div className="text-sm font-bold text-[#e6d8c6]">{n}</div>}
                  {n && (monthEvents[n] || []).filter((e) => !hide.includes(e.unit)).map((e) => (
                    <div key={e.t} className="mt-1 truncate rounded px-1 py-0.5 text-[11px] font-semibold text-white" style={{ background: units[e.unit].color }} title={e.t}>{e.t}</div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {week.map((w) => (
                <div key={w.d} className="min-h-[150px] rounded-lg bg-[#1f1810] p-3">
                  <div className="font-display text-2xl text-[#fdf3e7]">{w.d}</div>
                  {w.items.filter((it) => !hide.includes(it[0])).map((it) => (
                    <div key={it[1]} className="mt-1.5 rounded px-2 py-1 text-sm font-semibold text-white" style={{ background: units[it[0]].color }}>{it[1]}</div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div className="rounded-lg border-2 border-[#ec9220] bg-[#1f1810] p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#ec9220]">Needs Thomas</div>
              {needsThomas.map((n) => (
                <div key={n.text} className="mt-2 flex gap-2 text-[15px] text-[#fdf3e7]">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: units[n.unit].color }} />{n.text}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {todayNumbers.filter((t) => !hide.includes(t.unit)).map((t) => (
                <div key={t.unit} className="rounded-lg bg-[#1f1810] p-2.5" style={{ borderTop: `4px solid ${units[t.unit].color}` }}>
                  <div className="text-xs font-semibold text-[#b0a08c]">{units[t.unit].short}</div>
                  <div className="font-display text-3xl leading-none text-[#fdf3e7]">{t.big}</div>
                  <div className={cx("text-xs", t.tone === "bad" ? "text-[#f08273]" : "text-[#b0a08c]")}>{t.small}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-[#1f1810] p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#b0a08c]">Money in this week</div>
              {[["Tree jobs", 21400, "#3c7a3a"], ["Store", 6900, "#2f6690"], ["Slabs", 2600, "#7a5436"], ["Yard", 1900, "#8a6d1f"]].map(([l, v, c]) => (
                <div key={l as string} className="mt-2">
                  <div className="flex justify-between text-sm text-[#e6d8c6]"><span>{l}</span><span className="tabular-nums">${(v as number).toLocaleString()}</span></div>
                  <div className="mt-1 h-2.5 rounded bg-white/10"><div className="h-2.5 rounded" style={{ width: `${((v as number) / 21400) * 100}%`, background: c as string }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 overflow-hidden whitespace-nowrap rounded-md bg-[#ec9220] px-3 py-1.5 text-sm font-bold text-[#0c0701]">
          YARD: Blue Ridge Limb Co. trailer in 9:31 · Star City Tree dump truck 9:12 · SHIP: Order #1042 label made · STORE: splitter sold to Dale Price
        </div>
      </div>
    </div>
  );
}
