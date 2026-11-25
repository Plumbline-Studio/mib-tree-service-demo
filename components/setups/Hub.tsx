"use client";
import React, { useState } from "react";
import { hubMenu, rooms, roles, units, todayNumbers, needsThomas, day, type Role } from "../../lib/setups";
import { cx } from "../ui";
import { Box, Tone, UnitDot } from "./Frame";

const viewers: Role[] = ["owner", "office", "crew"];

export default function Hub() {
  const [as, setAs] = useState<Role>("owner");
  const [room, setRoom] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const sees = roles[as].sees;
  const menu = hubMenu.filter((g) => sees.includes(g.unit));
  const pick = (r: string) => { setRoom(r); setOpen(false); };
  const changeViewer = (r: Role) => {
    setAs(r);
    const first = r === "crew" ? "tree-jobs" : "home";
    setRoom(first);
  };
  const current = room !== "home" && rooms[room] && sees.includes(rooms[room].unit) ? rooms[room] : null;

  const Menu = (
    <nav className="space-y-4" aria-label="Rooms">
      {as !== "crew" && (
        <button onClick={() => pick("home")} className={cx("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold", room === "home" ? "bg-[#ec9220] text-[#0c0701]" : "text-[#e6d8c6] hover:bg-white/10")}>
          🏠 Today
        </button>
      )}
      {menu.map((g) => (
        <div key={g.unit}>
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#b0a08c" }}>
            {units[g.unit].icon} {units[g.unit].label}
          </div>
          {g.items.map(([id, label]) => (
            <button key={id} onClick={() => pick(id)} className={cx("flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium", room === id ? "bg-[#ec9220] text-[#0c0701]" : "text-[#e6d8c6] hover:bg-white/10")}>
              {label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label">See it as</span>
        {viewers.map((r) => (
          <button key={r} onClick={() => changeViewer(r)} className={cx("rounded-full px-3 py-1.5 text-sm font-semibold", as === r ? "bg-[#0c0701] text-[#fdf3e7]" : "bg-[var(--sunk)] text-[var(--ink-soft)]")}>
            {roles[r].who} ({roles[r].title})
          </button>
        ))}
        <span className="text-sm text-[var(--muted)]">The menu only shows the rooms that person needs.</span>
      </div>

      <div className="flex min-h-[620px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <aside className="hidden w-60 shrink-0 bg-[#1c140c] p-3 md:block">{Menu}</aside>
        <section className="min-w-0 flex-1 p-4 md:p-6">
          <button className="btn-quiet mb-4 md:hidden" onClick={() => setOpen(!open)}>☰ Rooms</button>
          {open && <div className="mb-4 rounded-xl bg-[#1c140c] p-3 md:hidden">{Menu}</div>}

          {room === "home" || !current ? (
            <div>
              <div className="label">{day}</div>
              <h2 className="font-display text-4xl leading-none">Good morning, {roles[as].who}</h2>
              {as === "owner" && (
                <Box className="mt-4 border-[#ec9220] p-4">
                  <div className="label mb-2" style={{ color: "#9a5204" }}>Needs you (3)</div>
                  <ul className="space-y-2">
                    {needsThomas.map((n) => (
                      <li key={n.text} className="flex items-start gap-3"><UnitDot u={n.unit} /><span className="text-[15px]">{n.text}</span></li>
                    ))}
                  </ul>
                </Box>
              )}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {todayNumbers.filter((t) => sees.includes(t.unit)).map((t) => {
                  const g = hubMenu.find((h) => h.unit === t.unit)!;
                  return (
                    <button key={t.unit} onClick={() => pick(g.items[0][0])} className="rounded-2xl border border-[var(--line)] p-4 text-left hover:bg-[var(--sunk)]" style={{ borderLeft: `6px solid ${units[t.unit].color}` }}>
                      <div className="text-sm font-semibold" style={{ color: units[t.unit].color }}>{units[t.unit].icon} {units[t.unit].label}</div>
                      <div className="font-display mt-1 text-3xl leading-none">{t.big}</div>
                      <div className={cx("mt-1 text-sm", t.tone === "bad" ? "text-[var(--bad)]" : "text-[var(--muted)]")}>{t.small}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold" style={{ color: units[current.unit].color }}>{units[current.unit].icon} {units[current.unit].label}</div>
              <h2 className="font-display text-4xl leading-none">{current.title}</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">
                      {current.cols.map((c) => <th key={c} className="py-2 pr-3 font-semibold">{c}</th>)}
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {current.rows.map((r) => (
                      <tr key={r.a + r.b} className="border-b border-[var(--line)]">
                        <td className="py-3 pr-3 font-semibold">{r.a}</td>
                        <td className="py-3 pr-3 text-[var(--ink-soft)]">{r.b}</td>
                        <td className="py-3 pr-3 tabular-nums">{r.c}</td>
                        <td className="py-3 text-right">{r.tag && <Tone tone={r.tone}>{r.tag}</Tone>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
