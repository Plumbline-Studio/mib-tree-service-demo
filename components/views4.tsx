"use client";
import React, { useState } from "react";
import * as D from "../lib/data";
import { Card, Title, Tabs, Pill, Sheet, PhotoTile, money, cx } from "./ui";
import type { Ctx } from "./views";

const invText: Record<D.InvoiceState, string> = { none: "Not yet", draft: "Draft in QuickBooks", sent: "Sent", paid: "Paid" };
const invTone: Record<D.InvoiceState, "brand" | "warn" | "good"> = { none: "brand", draft: "warn", sent: "warn", paid: "good" };
const total = (f: D.Folder) => f.shots.before + f.shots.during + f.shots.after;

// The four steps every job folder walks through.
function chain(f: D.Folder) {
  return [
    { label: "Estimate", done: !!f.estimate.signed },
    { label: "Photos", done: f.shots.before > 0 && f.shots.after > 0 },
    { label: "Invoice", done: f.invoice.state !== "none" },
    { label: "Paid", done: f.invoice.state === "paid" },
  ];
}

export function Chain({ f }: { f: D.Folder }) {
  const steps = chain(f);
  return (
    <ol className="grid grid-cols-4 gap-1" aria-label="Job folder steps">
      {steps.map((s, i) => (
        <li key={s.label} className="flex min-w-0 flex-col items-center gap-1 text-center">
          <span className={cx("flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-bold", s.done ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-ink)]" : "border-[var(--line-strong)] text-[var(--muted)]")}>{s.done ? "✓" : i + 1}</span>
          <span className={cx("text-[11px] font-semibold", s.done ? "text-[var(--ink)]" : "text-[var(--muted)]")}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

// ---------------- One job's folder ----------------
export function JobFolder({ j, c }: { j: D.Job; c: Ctx }) {
  const f = c.folders.find((x) => x.jobId === j.id);
  if (!f) return null;
  let seed = 0;
  return (
    <div className="mb-4">
      <div className="label mb-1">Job folder</div>
      <p className="mb-3 truncate text-xs text-[var(--muted)]">{D.folderPath(j)}</p>
      <Card className="mb-3 p-3"><Chain f={f} /></Card>

      <div className="space-y-2">
        <Row tag="PDF" title={`Estimate ${f.estimate.no}`} sub={f.estimate.signed ? `Signed by customer ${f.estimate.signed}` : `Sent ${f.estimate.date}. Not signed yet.`}
          right={f.estimate.signed ? <Pill tone="good">Signed</Pill> : <Pill tone="warn">Waiting</Pill>} onClick={() => c.say(`Sample only. Opens estimate ${f.estimate.no}.`)} />

        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2"><Tag>PHOTOS</Tag><span className="font-semibold">{total(f)} photos</span></span>
            <button className="text-sm font-semibold text-[var(--brand-strong)]" onClick={() => c.go("crew")}>Add photo</button>
          </div>
          {(Object.keys(D.stageText) as D.Stage[]).map((st) => (
            <div key={st} className="mb-2 last:mb-0">
              <div className="mb-1 text-xs font-semibold text-[var(--muted)]">{D.stageText[st]} · {f.shots[st]}</div>
              {f.shots[st] > 0 ? (
                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: Math.min(f.shots[st], 4) }).map(() => <PhotoTile key={seed} seed={seed++ + j.id.length} />)}
                </div>
              ) : <div className="rounded-lg border border-dashed border-[var(--line-strong)] p-2 text-xs text-[var(--muted)]">None yet</div>}
            </div>
          ))}
        </Card>

        <Row tag="INV" title={f.invoice.no ? `Invoice ${f.invoice.no}` : "Invoice"}
          sub={f.invoice.state === "none" ? "Made in QuickBooks when the job is marked done." : f.invoice.state === "draft" ? "Waiting in QuickBooks. Kat checks it, then it sends." : f.invoice.state === "sent" ? `Sent ${f.invoice.date}. Not paid yet.` : `Paid ${f.invoice.date}. Shown from QuickBooks.`}
          right={<Pill tone={invTone[f.invoice.state]}>{invText[f.invoice.state]}</Pill>} onClick={() => c.go("quickbooks")} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="shrink-0 rounded bg-[var(--chip)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[var(--brand-strong)]">{children}</span>;
}
function Row({ tag, title, sub, right, onClick }: { tag: string; title: string; sub: string; right: React.ReactNode; onClick: () => void }) {
  return (
    <Card className="flex items-center gap-3 p-3" onClick={onClick}>
      <Tag>{tag}</Tag>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-[var(--muted)]">{sub}</span>
      </span>
      <span className="shrink-0">{right}</span>
    </Card>
  );
}

// ---------------- All job folders (a tab on Jobs) ----------------
export function Folders({ c, onOpen }: { c: Ctx; onOpen: (id: string) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm text-[var(--muted)]">Every job has one folder. Estimate, photos, invoice and payment all land in it by themselves.</p>
      <div className="space-y-2">
        {c.jobs.map((j) => {
          const f = c.folders.find((x) => x.jobId === j.id);
          if (!f) return null;
          return (
            <Card key={j.id} className="p-3" onClick={() => onOpen(j.id)}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{j.customer}</div>
                  <div className="truncate text-sm text-[var(--muted)]">{j.day} · {total(f)} photos</div>
                </div>
                <div className="shrink-0 font-semibold tabular-nums">{money(j.price)}</div>
              </div>
              <Chain f={f} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Crew app (what Marcus and Jesse see) ----------------
export function CrewApp({ c }: { c: Ctx }) {
  const [crew, setCrew] = useState<"marcus" | "jesse">("marcus");
  const [open, setOpen] = useState<string | null>(null);
  const [stage, setStage] = useState<D.Stage>("before");
  const mine = c.jobs.filter((j) => j.day === "Today" && j.crew === crew);
  const job = c.jobs.find((j) => j.id === open);
  const folder = c.folders.find((x) => x.jobId === open);

  const snap = () => {
    if (!job) return;
    c.setFolders((all) => all.map((x) => (x.jobId === job.id ? { ...x, shots: { ...x.shots, [stage]: x.shots[stage] + 1 } } : x)));
    c.setJobs((all) => all.map((x) => (x.id === job.id ? { ...x, photos: x.photos + 1 } : x)));
    c.say(`Saved to the ${job.customer} folder under ${D.stageText[stage]}. Time and place stamped.`);
  };
  const finish = () => {
    if (!job) return;
    c.markDone(job.id);
    setOpen(null);
    c.say(`${job.customer} is done. The invoice is waiting in QuickBooks for Kat.`);
  };

  return (
    <div>
      <Title eyebrow="What the crew sees" title="Crew app" sub="The crew lead opens this on his phone. Every photo goes into the right job folder by itself." />
      <Tabs value={crew} onChange={setCrew} items={[["marcus", "Marcus, Crew 1"], ["jesse", "Jesse, Crew 2"]]} />

      <div className="space-y-2">
        {mine.map((j) => {
          const f = c.folders.find((x) => x.jobId === j.id)!;
          return (
            <Card key={j.id} className="p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold tabular-nums text-[var(--muted)]">{j.time} · {j.street}</div>
                  <div className="font-semibold leading-snug">{j.customer}</div>
                  <div className="text-sm text-[var(--muted)]">{j.work}</div>
                </div>
                <Pill tone={j.status === "done" ? "good" : "warn"}>{D.jobStatusText[j.status]}</Pill>
              </div>
              {j.notes && <p className="mb-2 rounded-lg bg-[var(--sunk)] p-2 text-sm">{j.notes}</p>}
              <button className="btn w-full" onClick={() => { setOpen(j.id); setStage(f.shots.before === 0 ? "before" : j.status === "working" ? "during" : "after"); }}>
                Take photos · {total(f)} so far
              </button>
            </Card>
          );
        })}
      </div>

      {job && folder && (
        <Sheet eyebrow={`${job.time} · ${job.street}`} title={job.customer} onClose={() => setOpen(null)}>
          <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#1b1510]">
            <div className="absolute inset-3 rounded-xl border-2 border-dashed border-white/40" />
            <div className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white/80">Camera view (sample)</div>
            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">{D.stageText[stage]}</div>
          </div>
          <div className="label mb-1">What is this photo?</div>
          <Tabs value={stage} onChange={setStage} items={(Object.keys(D.stageText) as D.Stage[]).map((s) => [s, `${D.stageText[s]} (${folder.shots[s]})`])} />
          <div className="mb-4 flex justify-center">
            <button onClick={snap} aria-label="Take photo" className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--ink)] bg-[var(--brand)] text-sm font-bold text-[var(--brand-ink)] active:scale-95">SNAP</button>
          </div>
          <p className="mb-4 text-center text-sm text-[var(--muted)]">Goes to: {job.customer} folder. No naming, no sorting.</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-quiet" onClick={() => c.say(`Sample only. ${job.customer} signs on the phone. The signed copy goes in the folder.`)}>Customer signs</button>
            <button className="btn" disabled={job.status === "done"} onClick={finish}>{job.status === "done" ? "Done" : "Job done"}</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}

// ---------------- QuickBooks ----------------
export function QuickBooks({ c }: { c: Ctx }) {
  const q = D.quickbooks;
  return (
    <div>
      <Title eyebrow="Connection" title="QuickBooks" sub="Home Base and QuickBooks stay in step. Kat keeps working in QuickBooks like today. Nothing gets typed twice." />
      <Card className="mb-4 flex items-center gap-3 p-3">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[var(--good)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">Connected</div>
          <div className="text-sm text-[var(--muted)]">{q.company} · last sync {q.lastSync}</div>
        </div>
        <button className="btn-quiet shrink-0" onClick={() => c.say("Sample only. Checks QuickBooks for anything new.")}>Sync now</button>
      </Card>

      <div className="label mb-2">Goes to QuickBooks</div>
      <Card className="mb-4 overflow-hidden">
        <ul className="divide-y divide-[var(--line)]">
          {q.toQB.map((x) => (
            <li key={x.what} className="flex items-start gap-3 px-3 py-2.5">
              <span aria-hidden="true" className="mt-0.5 font-bold text-[var(--brand-strong)]">→</span>
              <span className="min-w-0"><span className="block font-semibold">{x.what}</span><span className="block text-sm text-[var(--muted)]">{x.note}</span></span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="label mb-2">Comes back to Home Base</div>
      <Card className="mb-4 overflow-hidden">
        <ul className="divide-y divide-[var(--line)]">
          {q.fromQB.map((x) => (
            <li key={x.what} className="flex items-start gap-3 px-3 py-2.5">
              <span aria-hidden="true" className="mt-0.5 font-bold text-[var(--good)]">←</span>
              <span className="min-w-0"><span className="block font-semibold">{x.what}</span><span className="block text-sm text-[var(--muted)]">{x.note}</span></span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="label mb-2">Latest</div>
      <div className="space-y-2">
        {q.recent.map((r) => (
          <Card key={r.text} className="flex items-center gap-3 p-3">
            <span className="w-[68px] shrink-0 text-sm font-semibold tabular-nums text-[var(--muted)]">{r.time}</span>
            <span className="min-w-0 text-sm">{r.text}</span>
          </Card>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-[var(--sunk)] p-3 text-sm text-[var(--ink-soft)]">Sample. The real link signs in with QuickBooks itself. MIB&apos;s books stay in MIB&apos;s QuickBooks.</p>
    </div>
  );
}

// ---------------- Other tree services (Thomas's owner view) ----------------
export function Companies({ c }: { c: Ctx }) {
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const t = D.tenants.find((x) => x.id === open);
  const others = D.tenants.filter((x) => x.status !== "you");
  const monthly = others.reduce((s, x) => s + x.fee, 0);
  const jobs = D.tenants.reduce((s, x) => s + x.jobs, 0);

  return (
    <div>
      <Title eyebrow="Home Base for other tree services" title="Your app, their name" sub="Other tree services can use the tree side of Home Base. Each one sees only its own jobs. You see them all here." />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Stat big={`${others.length}`} small="other companies" />
        <Stat big={money(monthly)} small="a month (sample)" />
        <Stat big={`${jobs}`} small="jobs this month" />
      </div>

      <div className="space-y-2">
        {D.tenants.map((x) => (
          <Card key={x.id} className="flex items-center gap-3 p-3" onClick={() => setOpen(x.id)}>
            <Badge t={x} />
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{x.name}</div>
              <div className="truncate text-sm text-[var(--muted)]">{x.town} · {x.crews} crews · {x.jobs} jobs this month</div>
            </div>
            {x.status === "you" ? <Pill tone="brand">You</Pill> : x.status === "live" ? <Pill tone="good">Paying</Pill> : <Pill tone="warn">Trying it</Pill>}
          </Card>
        ))}
      </div>
      <button className="btn mt-4 w-full" onClick={() => setAdding(true)}>Add a tree service</button>
      <p className="mt-4 rounded-xl bg-[var(--sunk)] p-3 text-sm text-[var(--ink-soft)]">The yard, the store and the splitters stay MIB only. Other companies get jobs, the crew app, job folders and their own QuickBooks link.</p>

      {t && (
        <Sheet eyebrow={t.status === "you" ? "Your company" : `Since ${t.since}`} title={t.name} onClose={() => setOpen(null)}>
          <div className="label mb-2">What their crews see</div>
          <div className="mb-4 overflow-hidden rounded-2xl border border-[var(--line)]">
            <div className="flex items-center gap-3 bg-[var(--surface)] px-3 py-2.5" style={{ borderBottom: `3px solid ${t.color}` }}>
              <Badge t={t} />
              <div className="min-w-0"><div className="font-display text-xl leading-none">Home Base</div><div className="truncate text-xs text-[var(--muted)]">{t.name}</div></div>
            </div>
            <div className="bg-[var(--bg)] p-3">
              <div className="mb-2 rounded-lg p-2.5 text-center text-sm font-semibold text-white" style={{ background: t.color }}>Take photos</div>
              <div className="text-xs text-[var(--muted)]">Their name, their color, their jobs. No MIB jobs or customers.</div>
            </div>
          </div>
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="label">People</dt><dd>{t.people} on the app</dd></div>
            <div><dt className="label">Crews</dt><dd>{t.crews}</dd></div>
            <div><dt className="label">Jobs this month</dt><dd>{t.jobs}</dd></div>
            <div><dt className="label">Pays you</dt><dd>{t.status === "you" ? "Owner" : t.fee ? `${money(t.fee)} a month` : "Free trial"}</dd></div>
          </dl>
          <button className="btn-quiet w-full" onClick={() => c.say(`Sample only. Opens a help chat with ${t.name}.`)}>Message their owner</button>
        </Sheet>
      )}

      {adding && (
        <Sheet eyebrow="Three steps" title="Add a tree service" onClose={() => setAdding(false)}>
          <ol className="mb-4 space-y-2">
            {["Type their company name and add their logo.", "Pick their color.", "Send their owner an invite. They add their own crews."].map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-xl border border-[var(--line)] p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-[var(--brand-ink)]">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
          <button className="btn w-full" onClick={() => { setAdding(false); c.say("Sample only. Nothing was sent."); }}>Start</button>
        </Sheet>
      )}
    </div>
  );
}

function Badge({ t }: { t: D.Tenant }) {
  return <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mark text-sm text-white" style={{ background: t.id === "mib" ? "#0c0701" : t.color }}>{t.short}</span>;
}
function Stat({ big, small }: { big: string; small: string }) {
  return (
    <Card className="p-2.5 text-center">
      <div className="font-display text-2xl leading-none tabular-nums">{big}</div>
      <div className="mt-1 text-xs text-[var(--muted)]">{small}</div>
    </Card>
  );
}
