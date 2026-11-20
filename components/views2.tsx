"use client";
import React, { useState } from "react";
import * as D from "../lib/data";
import { Card, Title, Tabs, Pill, Sheet, money, cx } from "./ui";
import type { Ctx } from "./views";

// ---------------- Grinding yard ----------------
export function Yard({ c }: { c: Ctx }) {
  const [tab, setTab] = useState<"today" | "tabs">("today");
  const [adding, setAdding] = useState(false);
  const [who, setWho] = useState(D.yardCompanies[0]);
  const [size, setSize] = useState<D.Load["size"]>("Dump truck");
  const total = c.loads.reduce((s, l) => s + l.price, 0);

  const add = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    c.setLoads((all) => [{ id: `l${all.length + 1}-${now.getTime()}`, time, who, size, price: D.loadPrices[size], paid: who.startsWith("Walk-in") ? "Cash" : "On account", photo: true }, ...all]);
    setAdding(false);
    c.say(`Load logged for ${who}. Photo saved.`);
  };

  return (
    <div>
      <Title eyebrow="Grinding yard · Open 24/7" title="Yard" sub="The paper book, but on a phone. Drivers scan the sign at the gate and log their own load." />

      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat big={`${c.loads.length}`} small="loads today" />
        <Stat big={money(total)} small="today" />
        <Stat big="82" small="loads this month" />
      </div>

      <button className="btn mb-4 w-full" onClick={() => setAdding(true)}>Log a load</button>

      <Tabs value={tab} onChange={setTab} items={[["today", "Today"], ["tabs", "Who owes"]]} />

      {tab === "today" && (
        <div className="space-y-2">
          {c.loads.map((l) => (
            <Card key={l.id} className="flex items-center gap-3 p-3">
              <div className="w-[62px] shrink-0 text-sm font-semibold tabular-nums">{l.time}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{l.who}</div>
                <div className="truncate text-sm text-[var(--muted)]">{l.size} · {l.paid}{l.photo ? " · photo" : ""}</div>
              </div>
              <div className="shrink-0 font-semibold tabular-nums">{money(l.price)}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "tabs" && (
        <div>
          <p className="mb-3 text-sm text-[var(--muted)]">Each company that dumps on account gets one bill at the end of the month. Kat sends it from here.</p>
          <div className="space-y-2">
            {D.yardAccounts.map((a) => (
              <Card key={a.who} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{a.who}</div>
                  <div className="text-sm text-[var(--muted)]">{a.loads} loads this month · last {a.last}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold tabular-nums">{money(a.owed)}</div>
                  <button className="text-sm font-semibold text-[var(--brand)]" onClick={() => c.say(`Sample only. Makes a bill for ${a.who} for Kat to check and send.`)}>Bill</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {adding && (
        <Sheet eyebrow="Grinding yard" title="Log a load" onClose={() => setAdding(false)}>
          <label className="label mb-1 block" htmlFor="who">Who is dumping</label>
          <select id="who" className="field mb-4" value={who} onChange={(e) => setWho(e.target.value)}>
            {D.yardCompanies.map((n) => <option key={n}>{n}</option>)}
          </select>
          <div className="label mb-1">Truck size</div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {(Object.keys(D.loadPrices) as D.Load["size"][]).map((s) => (
              <button key={s} onClick={() => setSize(s)} className={cx("min-h-[64px] rounded-xl border px-2 text-sm font-semibold", size === s ? "border-[var(--brand)] bg-[var(--chip)] text-[var(--brand-strong)]" : "border-[var(--line)] bg-[var(--surface)]")}>
                {s}<span className="block text-xs font-normal">{money(D.loadPrices[s])}</span>
              </button>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-dashed border-[var(--line-strong)] p-3 text-sm text-[var(--muted)]">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--sunk)] text-lg" aria-hidden="true">◉</span>
            Take a photo of the load. It is saved with the time and the price.
          </div>
          <button className="btn w-full" onClick={add}>Save load · {money(D.loadPrices[size])}</button>
        </Sheet>
      )}
    </div>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <Card className="p-2.5 text-center">
      <div className="font-display text-2xl font-semibold leading-none tabular-nums">{big}</div>
      <div className="mt-1 text-xs text-[var(--muted)]">{small}</div>
    </Card>
  );
}

// ---------------- Store ----------------
export function Store({ c }: { c: Ctx }) {
  const [tab, setTab] = useState<"stock" | "dealers" | "opening">("stock");
  const splitter = D.stock.find((s) => s.biz === "splitters")!;
  const low = D.stock.filter((s) => s.onHand < s.low);
  const doneCount = c.checklist.filter((x) => x.done).length;

  return (
    <div>
      <Title eyebrow="MIB Supplies" title="Store" sub="Stock, dealers and the opening day list." />

      <Card className="mb-3 p-3" onClick={() => c.go("inbox")}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="label" style={{ color: "var(--safety)" }}>Log splitters</div>
            <div className="font-display text-[26px] font-semibold leading-none">{splitter.onHand} in stock</div>
            <div className="mt-1 text-sm text-[var(--muted)]">4 sold this week · 2 on hold for buyers</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-semibold">{money(splitter.price)}</div>
            <div className="text-xs text-[var(--muted)]">each</div>
          </div>
        </div>
      </Card>

      {low.length > 0 && (
        <div className="mb-4 rounded-xl pill-warn p-3 text-sm font-semibold">{low.length} items are running low: {low.map((l) => l.item.toLowerCase()).join(", ")}.</div>
      )}

      <Tabs value={tab} onChange={setTab} items={[["stock", "Stock"], ["dealers", "Dealers"], ["opening", "Opening"]]} />

      {tab === "stock" && (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-[var(--line)]">
            {D.stock.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{s.item}</div>
                  <div className="text-sm text-[var(--muted)]">{money(s.price)}</div>
                </div>
                <div className={cx("shrink-0 text-right font-semibold tabular-nums", s.onHand < s.low && "text-[var(--bad)]")}>
                  {s.onHand.toLocaleString("en-US")}
                  <div className="text-xs font-normal text-[var(--muted)]">on hand</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "dealers" && (
        <div className="space-y-2">
          <p className="mb-1 text-sm text-[var(--muted)]">Other stores that sell MIB goods. Each one is one row, so no one falls through.</p>
          {D.dealers.map((d) => (
            <Card key={d.name} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-sm text-[var(--muted)]">{d.city} · last touch {d.last}</div>
                </div>
                <Pill tone={d.status === "Selling" ? "good" : "brand"}>{d.status}</Pill>
              </div>
              {d.sold > 0 && <div className="mt-1 text-sm">{d.sold} splitters sold through them</div>}
            </Card>
          ))}
        </div>
      )}

      {tab === "opening" && (
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Opening day: Dec 1</span>
            <span className="text-[var(--muted)]">{doneCount} of {c.checklist.length} done</span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--sunk)]">
            <div className="h-full rounded-full bg-[var(--sky)]" style={{ width: `${(doneCount / c.checklist.length) * 100}%` }} />
          </div>
          <Card className="overflow-hidden">
            <ul className="divide-y divide-[var(--line)]">
              {c.checklist.map((x) => (
                <li key={x.id}>
                  <label className="flex min-h-[52px] items-center gap-3 px-3">
                    <input type="checkbox" className="h-5 w-5 accent-[var(--brand)]" checked={x.done} onChange={() => c.setChecklist((all) => all.map((y) => (y.id === x.id ? { ...y, done: !y.done } : y)))} />
                    <span className={cx(x.done && "text-[var(--muted)] line-through")}>{x.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
