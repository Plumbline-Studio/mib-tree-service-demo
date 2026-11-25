"use client";
import React, { useState } from "react";
import { roles, needsThomas, todayNumbers, units, type Role } from "../../lib/setups";
import { cx, PhotoTile } from "../ui";
import { UnitDot } from "./Frame";

const order: Role[] = ["owner", "office", "crew", "yard", "counter", "customer"];
const device: Record<Role, string> = { owner: "Phone", office: "Computer", crew: "Phone", yard: "Tablet at the gate", counter: "Tablet at the counter", customer: "Their own phone, by text link" };

function Phone({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={cx("mx-auto rounded-[28px] border-[8px] border-[#0c0701] bg-[var(--bg)] p-4 shadow-xl", wide ? "max-w-[720px]" : "max-w-[380px]")}>
      {children}
    </div>
  );
}

function Owner() {
  return (
    <Phone>
      <div className="label">Thomas · Monday</div>
      <h3 className="font-display text-3xl leading-none">3 things need you</h3>
      <div className="mt-3 space-y-2">
        {needsThomas.map((n) => (
          <div key={n.text} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
            <UnitDot u={n.unit} />
            <p className="mt-1 text-[15px]">{n.text}</p>
            <div className="mt-2 flex gap-2"><button className="btn flex-1">Yes</button><button className="btn-quiet flex-1">No</button><button className="btn-quiet">Talk</button></div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {todayNumbers.map((t) => (
          <div key={t.unit} className="rounded-lg bg-[var(--surface)] p-2 text-center" style={{ borderTop: `3px solid ${units[t.unit].color}` }}>
            <div className="text-[11px] font-semibold text-[var(--muted)]">{units[t.unit].short}</div>
            <div className="font-display text-xl leading-none">{t.big}</div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function Office() {
  const lists: [string, string[]][] = [
    ["Bills to send", ["Linda Parks, $3,800 (job done today)", "Oak Grove HOA, $1,750"]],
    ["Call for a review", ["Pat Moran (crew said yes)", "Cave Spring Baptist (crew said yes)"]],
    ["Ship today", ["#1042 wedges, label made", "#1043 walnut slab, needs crate"]],
    ["Money owed", ["Hollow Creek Tree, yard, $480, 45 days", "Cave Spring Baptist, $2,600, 6 days"]],
  ];
  return (
    <Phone wide>
      <div className="label">Kat · Office</div>
      <h3 className="font-display text-3xl leading-none">Your lists for today</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {lists.map(([t, items]) => (
          <div key={t} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
            <div className="font-semibold">{t} <span className="text-[var(--muted)]">({items.length})</span></div>
            {items.map((i) => (
              <label key={i} className="mt-2 flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-4 w-4 accent-[#ec9220]" />{i}</label>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-[var(--muted)]">Every bill she sends goes into QuickBooks on its own.</p>
    </Phone>
  );
}

function Crew() {
  const [photos, setPhotos] = useState(4);
  const [done, setDone] = useState<"no" | "ask" | "yes" | "skip">("no");
  return (
    <Phone>
      <div className="label">Crew 1 · Marcus</div>
      <h3 className="font-display text-3xl leading-none">Linda Parks</h3>
      <p className="text-sm text-[var(--muted)]">Grandin Rd SW · Take down 2 dead oaks</p>
      <div className="mt-2 rounded-lg bg-[var(--warn-bg)] p-2 text-sm text-[var(--warn)]">Power line on the left. Dog in back yard.</div>
      <button onClick={() => setPhotos(photos + 1)} className="btn mt-3 h-24 w-full text-2xl">📷 SNAP A PHOTO</button>
      <div className="mt-2 grid grid-cols-4 gap-1.5">{Array.from({ length: Math.min(photos, 8) }, (_, i) => <PhotoTile key={i} seed={i} />)}</div>
      <p className="mt-1 text-xs text-[var(--muted)]">{photos} photos. They go into this job's folder by themselves.</p>
      {done === "no" && <button onClick={() => setDone("ask")} className="btn-quiet mt-3 h-14 w-full text-lg">✅ Job done</button>}
      {done === "ask" && (
        <div className="mt-3 rounded-xl border-2 border-[#ec9220] p-3">
          <p className="font-semibold">Should Kat call them for a review?</p>
          <div className="mt-2 flex gap-2"><button onClick={() => setDone("yes")} className="btn flex-1">Yes, call</button><button onClick={() => setDone("skip")} className="btn-quiet flex-1">Don't call</button></div>
        </div>
      )}
      {(done === "yes" || done === "skip") && (
        <div className="mt-3 rounded-xl bg-[var(--good-bg)] p-3 text-sm text-[var(--good)]">Done. Bill drafted for Kat.{done === "yes" ? " Review call is on her list." : ""}</div>
      )}
    </Phone>
  );
}

function Yard() {
  const [who, setWho] = useState("");
  const [log, setLog] = useState<string[]>(["9:31 Blue Ridge Limb Co. · Tractor trailer", "9:12 Star City Tree · Dump truck"]);
  const add = (size: string) => { if (!who) return; setLog([`9:4${log.length} ${who} · ${size}`, ...log]); setWho(""); };
  return (
    <Phone wide>
      <div className="label">Yard gate tablet</div>
      <h3 className="font-display text-3xl leading-none">Who is dumping?</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {["Blue Ridge Limb Co.", "Star City Tree", "Hollow Creek Tree", "Roanoke Lawn Pros", "MIB crew", "Walk-in (cash)"].map((c) => (
          <button key={c} onClick={() => setWho(c)} className={cx("min-h-[56px] rounded-xl border-2 px-2 text-sm font-bold", who === c ? "border-[#ec9220] bg-[var(--chip)]" : "border-[var(--line)] bg-[var(--surface)]")}>{c}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {["Pickup $15", "Dump truck $20", "Tractor trailer $25"].map((s) => (
          <button key={s} disabled={!who} onClick={() => add(s.replace(/ \$\d+/, ""))} className={cx("btn h-16", !who && "opacity-40")}>{s}</button>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-[var(--surface)] p-3 text-sm">
        <div className="label mb-1">Today's loads ({log.length})</div>
        {log.map((l) => <div key={l} className="border-b border-[var(--line)] py-1 last:border-0">{l}</div>)}
      </div>
    </Phone>
  );
}

function Counter() {
  const [cart, setCart] = useState<[string, number][]>([]);
  const items: [string, number][] = [["Asphalt shovel", 38], ["Work gloves", 12], ["Chainsaw chain", 24], ["Tarp 20x30", 29], ["Wheelbarrow", 89], ["Log splitter 37 ton", 4600]];
  const total = cart.reduce((a, [, p]) => a + p, 0);
  return (
    <Phone wide>
      <div className="label">Store counter tablet</div>
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <div className="grid grid-cols-2 gap-2">
          {items.map(([n, p]) => (
            <button key={n} onClick={() => setCart([...cart, [n, p]])} className="min-h-[64px] rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2 text-left">
              <div className="text-sm font-semibold">{n}</div><div className="text-sm text-[var(--muted)]">${p.toLocaleString()}</div>
            </button>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--surface)] p-3">
          <div className="label">Sale</div>
          {cart.length === 0 && <p className="text-sm text-[var(--muted)]">Tap an item.</p>}
          {cart.map(([n, p], i) => <div key={i} className="flex justify-between text-sm"><span>{n}</span><span>${p}</span></div>)}
          <div className="mt-2 flex justify-between border-t border-[var(--line)] pt-2 font-bold"><span>Total</span><span>${total.toLocaleString()}</span></div>
          <button onClick={() => setCart([])} className="btn mt-2 w-full">Take payment</button>
          <p className="mt-1 text-xs text-[var(--muted)]">Stock goes down by itself.</p>
        </div>
      </div>
    </Phone>
  );
}

function Customer() {
  return (
    <Phone>
      <div className="rounded-lg bg-[#0c0701] p-2 text-center text-xs font-bold tracking-widest text-[#ec9220]">MIB TREE SERVICE</div>
      <h3 className="font-display mt-3 text-3xl leading-none">Hi Linda, your job is done</h3>
      <p className="text-sm text-[var(--muted)]">2 dead oaks taken down and hauled off.</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">{Array.from({ length: 6 }, (_, i) => <PhotoTile key={i} seed={i + 2} />)}</div>
      <p className="mt-1 text-xs text-[var(--muted)]">Before, during and after photos from the crew.</p>
      <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
        <div className="flex justify-between"><span>Invoice 1047</span><span className="font-bold">$3,800</span></div>
        <button className="btn mt-2 w-full">Pay now</button>
      </div>
      <button className="btn-quiet mt-2 w-full">⭐ Leave us a review</button>
    </Phone>
  );
}

const screens: Record<Role, () => React.ReactElement> = { owner: Owner, office: Office, crew: Crew, yard: Yard, counter: Counter, customer: Customer };

export default function Roles() {
  const [r, setR] = useState<Role>("crew");
  const S = screens[r];
  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {order.map((x) => (
          <button key={x} onClick={() => setR(x)} className={cx("rounded-xl border-2 p-3 text-left", r === x ? "border-[#ec9220] bg-[var(--chip)]" : "border-[var(--line)] bg-[var(--surface)]")}>
            <div className="font-semibold">{roles[x].who}</div>
            <div className="text-xs text-[var(--muted)]">{device[x]}</div>
          </button>
        ))}
      </div>
      <p className="mb-4 text-center text-sm text-[var(--muted)]">Same app and same data. Each person only gets the door they need. Tap the buttons inside, they work.</p>
      <S />
    </div>
  );
}
