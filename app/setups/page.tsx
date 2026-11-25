import Link from "next/link";
import { setups } from "../../lib/setups";
import { Logo } from "../../components/ui";

const look: Record<string, string> = {
  hub: "Side menu · a room per business",
  wall: "TV on the wall · month at a glance",
  roles: "Own start screen for each person",
  flow: "One board · cards move left to right",
  stock: "Shelf, costs and online orders",
  inbox: "One inbox · talk and it sorts",
};

export default function Setups() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="bg-[#0c0701] text-[#fdf3e7]">
        <div className="mx-auto max-w-[1200px] px-4 py-6">
          <span className="inline-block rounded-md bg-[#fdf3e7] px-2 py-1"><Logo size={34} /></span>
          <h1 className="font-display mt-3 text-5xl leading-none">6 ways to set up Home Base</h1>
          <p className="mt-2 max-w-[760px] text-[17px] text-[#e6d8c6]">
            One program for the tree service, the slabs, the store and splitters, the yard, shipping and the office.
            Each setup below uses the same pieces. What changes is the front: what you see first and how you get around.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {setups.map((s) => (
            <Link key={s.slug} href={`/setups/${s.slug}`} className="group flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[#ec9220]">
              <div className="flex items-center gap-3">
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-xl bg-[#ec9220] text-3xl text-[#0c0701]">{s.n}</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{look[s.slug]}</span>
              </div>
              <h2 className="font-display mt-3 text-3xl leading-none">{s.name}</h2>
              <p className="mt-2 text-[15px] text-[var(--ink-soft)]">{s.line}</p>
              <p className="mt-3 text-sm"><b>Best for:</b> {s.suits}</p>
              <span className="mt-auto pt-4 text-sm font-bold text-[var(--brand-strong)] group-hover:underline">Open setup {s.n} →</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-l-[6px] border-[#ec9220] bg-[var(--surface)] p-5">
            <h2 className="font-display text-3xl leading-none">Same engine under all six</h2>
            <p className="mt-2 text-[15px] text-[var(--ink-soft)]">
              Every setup sits on one program with one set of records: customers, jobs, stock, loads, orders, files and bills.
              Each business is its own part, so a new one, like the mill, can be added later without starting over.
            </p>
          </div>
          <div className="rounded-2xl border-l-[6px] border-[#0c0701] bg-[var(--surface)] p-5">
            <h2 className="font-display text-3xl leading-none">You can mix them</h2>
            <p className="mt-2 text-[15px] text-[var(--ink-soft)]">
              These are not either/or. A common mix is the hub for the office, a front door for each person, and the big screen on the shop wall.
            </p>
          </div>
        </div>
        <p className="mt-6 text-xs text-[var(--muted)]">Sample only. Every name, number and message is made up. Made by Plumbline Studio.</p>
      </main>
    </div>
  );
}
