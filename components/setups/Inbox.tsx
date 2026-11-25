"use client";
import React, { useState } from "react";
import { inbox as start, units, type Msg, type Unit } from "../../lib/setups";
import { cx } from "../ui";
import { Box, UnitDot } from "./Frame";

const viaIcon: Record<Msg["via"], string> = { Facebook: "💬", Text: "📱", Call: "📞", Pocket: "🎙️", Website: "🌐", Email: "✉️" };

function guess(t: string): { unit: Unit; who: string } {
  const s = t.toLowerCase();
  const named = /\bkat\b/.test(s) ? "Kat" : /\bdavid\b/.test(s) ? "David" : /\bmarcus\b/.test(s) ? "Marcus" : null;
  const pick = (unit: Unit, who: string) => ({ unit, who: named ?? who });
  if (/ship|freight|crate|box|richmond|charlotte/.test(s)) return pick("ship", "Kat");
  if (/slab|walnut|cherry|mill|log/.test(s)) return pick("slabs", "Thomas");
  if (/yard|dump|load|mulch|grind/.test(s)) return pick("yard", "Kat");
  if (/store|splitter|shovel|stock|glove/.test(s)) return pick("store", "Kat");
  if (/bill|pay|invoice|quickbooks|call/.test(s)) return pick("office", "Kat");
  return pick("tree", "David");
}

export default function Inbox() {
  const [list, setList] = useState<Msg[]>(start);
  const [tab, setTab] = useState<"needs" | "handled">("needs");
  const [said, setSaid] = useState("");
  const [made, setMade] = useState<{ t: string; unit: Unit; who: string }[]>([]);
  const needs = list.filter((m) => m.needs);
  const handled = list.filter((m) => !m.needs);
  const shown = tab === "needs" ? needs : handled;
  const answer = (id: string, how: string) => setList(list.map((m) => (m.id === id ? { ...m, needs: false, did: how } : m)));
  const say = () => {
    if (!said.trim()) return;
    setMade([{ t: said.trim(), ...guess(said) }, ...made]);
    setSaid("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0">
        <div className="mb-3 grid grid-cols-2 rounded-xl bg-[var(--sunk)] p-1">
          <button onClick={() => setTab("needs")} className={cx("min-h-[44px] rounded-lg font-semibold", tab === "needs" ? "bg-[var(--surface)] shadow-sm" : "text-[var(--muted)]")}>Needs me ({needs.length})</button>
          <button onClick={() => setTab("handled")} className={cx("min-h-[44px] rounded-lg font-semibold", tab === "handled" ? "bg-[var(--surface)] shadow-sm" : "text-[var(--muted)]")}>Handled for me ({handled.length})</button>
        </div>
        {shown.length === 0 && <Box className="p-6 text-center"><div className="font-display text-3xl">All clear</div><p className="text-[var(--muted)]">Nothing needs you right now.</p></Box>}
        <div className="space-y-2">
          {shown.map((m) => (
            <Box key={m.id} className={cx("p-3", m.needs && "border-2 border-[#ec9220]")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold">{viaIcon[m.via]} {m.from} <span className="font-normal text-[var(--muted)]">· {m.via} · {m.time}</span></span>
                <UnitDot u={m.unit} />
              </div>
              <p className="mt-1 text-[15px]">{m.said}</p>
              <div className={cx("mt-2 rounded-lg p-2 text-sm", m.needs ? "bg-[var(--chip)]" : "bg-[var(--good-bg)] text-[var(--good)]")}>
                {m.needs ? "🤖 " : "✓ "}{m.did}
              </div>
              {m.needs && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => answer(m.id, "You said yes. The reply went out.")} className="btn">Send that</button>
                  <button onClick={() => answer(m.id, "You said no. A kind no went out.")} className="btn-quiet">Say no</button>
                  <button onClick={() => answer(m.id, "You'll call them. It's on your list.")} className="btn-quiet">I'll call</button>
                </div>
              )}
            </Box>
          ))}
        </div>
        {tab === "needs" && handled.length > 0 && (
          <div className="mt-4">
            <div className="label mb-1">Handled while you were busy</div>
            <div className="space-y-1">
              {handled.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-lg bg-[var(--good-bg)] px-3 py-2 text-sm">
                  <UnitDot u={m.unit} />
                  <span className="font-semibold">{m.from}</span>
                  <span className="text-[var(--muted)]">{viaIcon[m.via]} {m.time}</span>
                  <span className="text-[var(--good)]">✓ {m.did}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Box className="border-2 border-[#0c0701] p-4">
          <h3 className="font-display text-3xl leading-none">🎙️ Just say it</h3>
          <p className="text-sm text-[var(--muted)]">Talk into the Pocket, or type here. It turns into a task for the right person.</p>
          <textarea value={said} onChange={(e) => setSaid(e.target.value)} rows={3} placeholder="Try: Tell Kat to ship the walnut slab to Richmond tomorrow" className="field mt-2" />
          <button onClick={say} className="btn mt-2 w-full">Make it a task</button>
          {made.map((t, i) => (
            <div key={i} className="mt-2 rounded-lg bg-[var(--sunk)] p-2 text-sm">
              <UnitDot u={t.unit} /> <span className="font-semibold">Task for {t.who}:</span> {t.t}
            </div>
          ))}
        </Box>
        <Box className="p-4">
          <h3 className="font-display text-2xl leading-none">Where it all comes from</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(["Facebook", "Text", "Call", "Pocket", "Website", "Email"] as Msg["via"][]).map((v) => (
              <li key={v} className="flex justify-between"><span>{viaIcon[v]} {v}</span><span className="text-[var(--good)]">On</span></li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-[var(--muted)]">Easy questions get answered from Thomas's answer sheet. Money, trades and payment plans always wait for him.</p>
        </Box>
        <Box className="p-4 text-sm">
          <div className="label mb-1">Sorted to</div>
          {(["tree", "slabs", "store", "yard", "ship", "office"] as Unit[]).map((u) => (
            <div key={u} className="flex justify-between py-0.5"><UnitDot u={u} /><span>{list.filter((m) => m.unit === u).length + made.filter((t) => t.unit === u).length} today</span></div>
          ))}
          <p className="mt-1 text-xs text-[var(--muted)]">{units.tree.icon} Tree questions go to David first.</p>
        </Box>
      </div>
    </div>
  );
}
