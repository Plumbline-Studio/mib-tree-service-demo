"use client";
import React, { useState } from "react";
import * as D from "../lib/data";
import { Card, Title, Pill, Sheet, cx } from "./ui";
import type { Ctx } from "./views";

// ---------------- Heard today ----------------
export function HeardToday({ c }: { c: Ctx }) {
  const [on, setOn] = useState(true);
  const [fix, setFix] = useState<D.Heard | null>(null);
  const [text, setText] = useState("");
  const [place, setPlace] = useState("");
  const waiting = c.heard.filter((h) => h.state === "new");
  const kept = c.heard.filter((h) => h.state === "kept");

  const setState = (id: string, state: D.HeardState, patch: Partial<D.Heard> = {}) =>
    c.setHeard((all) => all.map((h) => (h.id === id ? { ...h, ...patch, state } : h)));

  const keep = (h: D.Heard) => {
    setState(h.id, "kept");
    c.say(h.ready ? `Kept. ${h.ready}` : `Kept. It is now on ${h.goes}.`);
  };
  const keepAll = () => {
    c.setHeard((all) => all.map((h) => (h.state === "new" ? { ...h, state: "kept" } : h)));
    c.say(`Kept ${waiting.length}. Nothing was sent to anyone.`);
  };
  const openFix = (h: D.Heard) => { setFix(h); setText(h.made); setPlace(h.goes); };
  const saveFix = () => {
    if (!fix) return;
    setState(fix.id, "kept", { made: text.trim() || fix.made, goes: place });
    c.say(`Fixed and kept. It is now on ${place}.`);
    setFix(null);
  };

  return (
    <div>
      <Title eyebrow="From your Pocket" title="Heard today" sub={waiting.length ? `${waiting.length} things to check. Nothing goes anywhere until you tap Keep.` : "All checked. Nice work."} />

      <Card className="mb-4 flex items-center gap-3 p-3">
        <span className={cx("h-3 w-3 shrink-0 rounded-full", on ? "bg-[var(--good)]" : "bg-[var(--line-strong)]")} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{on ? "Pocket is recording" : "Off the clock"}</div>
          <div className="text-sm text-[var(--muted)]">{on ? "Since 7:02 AM · Battery 81% · Synced 9:41 AM" : "Press the side button on your Pocket to start again."}</div>
        </div>
        <button className="btn-quiet shrink-0" onClick={() => { setOn(!on); c.say(on ? "Pocket stopped. Nothing is heard." : "Pocket is recording again."); }}>{on ? "Stop" : "Start"}</button>
      </Card>

      {waiting.length > 0 && (
        <div className="mb-2 flex items-end justify-between">
          <div className="label">Check these</div>
          <button className="text-sm font-semibold text-[var(--brand-strong)]" onClick={keepAll}>Keep all</button>
        </div>
      )}
      <div className="mb-5 space-y-3">
        {waiting.map((h) => (
          <Card key={h.id} className="p-3">
            <div className="mb-1 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
              <span>{h.time} · {h.where}</span>
              <Pill tone="brand">{h.goes}</Pill>
            </div>
            <div className="mb-1 font-semibold leading-snug">{h.made}</div>
            <div className="mb-1 border-l-2 border-[var(--line-strong)] pl-2 text-sm italic text-[var(--muted)]">"{h.said}"</div>
            <div className="mb-3 text-xs text-[var(--muted)]">{h.who}</div>
            {h.ready && <div className="mb-3 rounded-lg bg-[var(--chip)] px-2.5 py-1.5 text-sm">{h.ready}</div>}
            <div className="grid grid-cols-3 gap-2">
              <button className="btn !min-h-[44px]" onClick={() => keep(h)}>Keep</button>
              <button className="btn-quiet !min-h-[44px]" onClick={() => openFix(h)}>Fix</button>
              <button className="btn-quiet !min-h-[44px]" onClick={() => { setState(h.id, "tossed"); c.say("Tossed. It is gone from Home Base."); }}>Toss</button>
            </div>
          </Card>
        ))}
      </div>

      {kept.length > 0 && (
        <>
          <div className="label mb-2">Kept today ({kept.length})</div>
          <Card className="mb-5 overflow-hidden">
            <ul className="divide-y divide-[var(--line)]">
              {kept.map((h) => (
                <li key={h.id}>
                  <button onClick={() => c.go(h.view)} className="flex min-h-[52px] w-full items-center gap-3 px-3 py-2 text-left active:bg-[var(--sunk)]">
                    <span aria-hidden="true" className="text-[var(--good)]">✓</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug">{h.made}</span>
                      <span className="block text-xs text-[var(--muted)]">On {h.goes}</span>
                    </span>
                    <span aria-hidden="true" className="text-[var(--muted)]">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <Card className="mb-4 p-3 text-sm">
        <div className="mb-1 font-semibold">How this works</div>
        <ul className="space-y-1 text-[var(--muted)]">
          <li>Your Pocket writes down your talks. Home Base reads them every few minutes and pulls out the jobs, promises and problems.</li>
          <li>{D.heardSkipped} talks today had no work in them, like family and small talk. They were skipped and not saved.</li>
          <li>Only you see this list. Kat and the crews see what you keep.</li>
          <li>Nothing is sent to anyone from here. A ready text still waits for you to tap Send.</li>
        </ul>
      </Card>

      {fix && (
        <Sheet eyebrow={`${fix.time} · ${fix.where}`} title="Fix this one" onClose={() => setFix(null)}>
          <div className="mb-3 border-l-2 border-[var(--line-strong)] pl-2 text-sm italic text-[var(--muted)]">"{fix.said}"</div>
          <label className="label mb-1 block" htmlFor="heard-fix">What it should say</label>
          <textarea id="heard-fix" value={text} onChange={(e) => setText(e.target.value)} rows={3}
            className="mb-3 w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg)] p-3 text-base text-[var(--ink)]" />
          <div className="label mb-1">Where it goes</div>
          <div className="mb-4 flex flex-wrap gap-2">
            {D.heardPlaces.map((p) => (
              <button key={p} onClick={() => setPlace(p)} aria-pressed={place === p}
                className={cx("rounded-full border px-3 py-1.5 text-sm font-semibold", place === p ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-ink)]" : "border-[var(--line-strong)] text-[var(--ink)]")}>{p}</button>
            ))}
          </div>
          <button className="btn w-full" onClick={saveFix}>Save and keep</button>
        </Sheet>
      )}
    </div>
  );
}
