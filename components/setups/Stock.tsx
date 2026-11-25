"use client";
import React, { useState } from "react";
import { products, slabValue, mulchPrice, rooms, units } from "../../lib/setups";
import { cx } from "../ui";
import { Box, Tone, UnitDot } from "./Frame";

const landed = (p: { paid: number; freight: number; tariffPct: number }) => p.paid * (1 + p.tariffPct / 100) + p.freight;
const usd = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const usd2 = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Stock() {
  const [paid, setPaid] = useState(3.25);
  const [freight, setFreight] = useState(0.6);
  const [tariff, setTariff] = useState(15);
  const [mult, setMult] = useState(3);
  const calcLanded = paid * (1 + tariff / 100) + freight;

  const valueOf = (p: (typeof products)[number]) =>
    p.unit === "slabs" ? p.onHand * slabValue * 0.6 : p.unit === "yard" ? p.onHand * mulchPrice * 0.3 : p.onHand * landed(p);
  const tiedUp = products.reduce((a, p) => a + valueOf(p), 0);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Box className="p-4"><div className="label">Money sitting on the shelf</div><div className="font-display text-4xl leading-none">{usd(tiedUp)}</div><div className="text-sm text-[var(--muted)]">at what it cost you</div></Box>
          <Box className="p-4"><div className="label">Loan cost on that stock</div><div className="font-display text-4xl leading-none text-[var(--bad)]">$100 a day</div><div className="text-sm text-[var(--muted)]">about $3,000 a month</div></Box>
          <Box className="p-4"><div className="label">Slowest seller</div><div className="font-display text-4xl leading-none">488 wheelbarrows</div><div className="text-sm text-[var(--muted)]">about $23,300 waiting to sell</div></Box>
        </div>

        <Box className="overflow-x-auto p-4">
          <h3 className="font-display text-3xl leading-none">Everything you sell</h3>
          <table className="mt-3 w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="py-2">Item</th><th>On hand</th><th>True cost each</th><th>Sell for</th><th>Profit each</th><th>Sells a week</th><th>Runs out in</th><th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const lc = landed(p);
                const sell = p.unit === "slabs" ? slabValue : p.unit === "yard" ? mulchPrice : lc * p.markup;
                const cost = p.unit === "slabs" ? slabValue * 0.35 : p.unit === "yard" ? mulchPrice * 0.3 : lc;
                const weeks = p.onHand / p.soldPerWeek;
                return (
                  <tr key={p.id} className="border-b border-[var(--line)]">
                    <td className="py-2.5"><UnitDot u={p.unit} /><div className="font-semibold">{p.name}</div></td>
                    <td className="tabular-nums">{p.onHand.toLocaleString()}</td>
                    <td className="tabular-nums">{p.unit === "store" ? usd2(lc) : "your own wood"}</td>
                    <td className="tabular-nums">{sell >= 100 ? usd(sell) : usd2(sell)}</td>
                    <td className="tabular-nums text-[var(--good)]">{sell - cost >= 100 ? usd(sell - cost) : usd2(sell - cost)}</td>
                    <td className="tabular-nums">{p.soldPerWeek}</td>
                    <td className="tabular-nums">{weeks < 4 ? `${Math.round(weeks * 7)} days` : weeks > 52 ? `${(weeks / 52).toFixed(1)} years` : `${Math.round(weeks)} weeks`}</td>
                    <td>{weeks < 2 ? <Tone tone="bad">Order now</Tone> : weeks > 52 ? <Tone tone="warn">Put on sale</Tone> : <Tone tone="good">OK</Tone>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-[var(--muted)]">True cost = what you paid + the tariff + shipping to Roanoke. Slabs and mulch come from your own tree jobs.</p>
        </Box>
      </div>

      <div className="space-y-4">
        <Box className="border-2 border-[#ec9220] p-4">
          <h3 className="font-display text-3xl leading-none">What did it really cost?</h3>
          <p className="text-sm text-[var(--muted)]">Change a number. The price fills in.</p>
          {[
            ["Paid the factory, each", paid, setPaid, 0.05],
            ["Shipping to Roanoke, each", freight, setFreight, 0.05],
            ["Tariff %", tariff, setTariff, 1],
            ["Times it by", mult, setMult, 0.1],
          ].map(([label, v, set, step]) => (
            <label key={label as string} className="mt-3 block">
              <span className="text-sm font-semibold">{label as string}</span>
              <input type="number" step={step as number} value={v as number} onChange={(e) => (set as (n: number) => void)(parseFloat(e.target.value) || 0)} className="field mt-1 tabular-nums" />
            </label>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[var(--sunk)] p-3"><div className="label">True cost</div><div className="font-display text-3xl leading-none">{usd2(calcLanded)}</div></div>
            <div className="rounded-xl bg-[var(--chip)] p-3"><div className="label">Sell for</div><div className="font-display text-3xl leading-none">{usd2(calcLanded * mult)}</div></div>
          </div>
          <div className="mt-2 text-sm">Dealer price (25% off): <b>{usd2(calcLanded * mult * 0.75)}</b></div>
        </Box>

        <Box className="p-4">
          <h3 className="font-display text-2xl leading-none">{units.ship.icon} Online orders to ship</h3>
          {rooms["ship-orders"].rows.slice(0, 4).map((r) => (
            <div key={r.a} className="mt-2 flex items-center justify-between gap-2 text-sm"><span className="min-w-0 truncate">{r.a}</span>{r.tag ? <Tone tone={r.tone}>{r.tag}</Tone> : <span className="text-[var(--muted)]">{r.c}</span>}</div>
          ))}
        </Box>
        <Box className="p-4">
          <h3 className="font-display text-2xl leading-none">QuickBooks</h3>
          <div className="mt-2 flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-[var(--good)]" /> Connected. Last sync 9:02 AM.</div>
          <ul className="mt-2 space-y-1 text-sm text-[var(--ink-soft)]">
            <li>→ Every sale, bill and shipment goes in</li>
            <li>← Bank and payments come back</li>
          </ul>
        </Box>
      </div>
    </div>
  );
}
