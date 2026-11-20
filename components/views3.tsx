"use client";
import React, { useState } from "react";
import * as D from "../lib/data";
import { Card, Title, Pill, Who, BizTag, StatusPill, Sparkline, Sheet, fmt, cx } from "./ui";
import type { Ctx } from "./views";

const hit = (n: D.Num) => {
  const last = n.weeks[n.weeks.length - 1];
  return n.better === "up" ? last >= n.goal : last <= n.goal;
};

// ---------------- Weekly numbers ----------------
export function Numbers({ c }: { c: Ctx }) {
  const onGoal = D.numbers.filter(hit).length;
  return (
    <div>
      <Title eyebrow={`Week ${D.company.week}`} title="Weekly numbers" sub={`${onGoal} of ${D.numbers.length} numbers hit the goal this week. Red dot means look at it Monday.`} />
      <div className="space-y-2">
        {D.numbers.map((n) => {
          const last = n.weeks[n.weeks.length - 1];
          return (
            <Card key={n.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <BizTag b={n.biz} />
                  <div className="font-semibold leading-snug">{n.name}</div>
                  <div className="text-sm text-[var(--muted)]">Goal {n.better === "down" ? "under" : ""} {fmt(n.goal, n.fmt)} · from {n.source}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={cx("font-display text-2xl font-semibold leading-none tabular-nums", hit(n) ? "text-[var(--good)]" : "text-[var(--bad)]")}>{fmt(last, n.fmt)}</div>
                  <div className="mt-1"><Sparkline values={n.weeks} goal={n.goal} better={n.better} /></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-[var(--muted)]">No one types these in. They fill from the job board, the yard log, the store and Facebook.</p>
      <button className="btn-quiet mt-3 w-full" onClick={() => c.go("feeds")}>See where numbers come from</button>
    </div>
  );
}

// ---------------- 90-day goals ----------------
export function Goals({ c }: { c: Ctx }) {
  const cycle: Record<D.Status, D.Status> = { on: "off", off: "done", done: "on" };
  return (
    <div>
      <Title eyebrow={`${D.company.quarter} · week ${D.company.quarterWeek} of ${D.company.quarterWeeks}`} title="90-day goals" sub="Five things we finish this season. Tap the status to change it." />
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--sunk)]">
        <div className="h-full rounded-full bg-[var(--safety)]" style={{ width: `${(D.company.quarterWeek / D.company.quarterWeeks) * 100}%` }} />
      </div>
      <div className="space-y-2">
        {c.goals.map((g) => (
          <Card key={g.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <BizTag b={g.biz} />
                <div className="font-semibold leading-snug">{g.title}</div>
              </div>
              <StatusPill s={g.status} onClick={() => c.setGoals((all) => all.map((x) => (x.id === g.id ? { ...x, status: cycle[x.status] } : x)))} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2">
              <Who id={g.who} />
              <button className="text-sm font-semibold text-[var(--brand)]" onClick={() => c.go("line")}>Line of sight</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- Line of sight ----------------
export function Line({ c }: { c: Ctx }) {
  const [pick, setPick] = useState(c.goals[0].id);
  const g = c.goals.find((x) => x.id === pick)!;
  const n = D.numbers.find((x) => x.id === g.numberId)!;
  const last = n.weeks[n.weeks.length - 1];
  const Step = ({ tag, children, last: isLast }: { tag: string; children: React.ReactNode; last?: boolean }) => (
    <div className="relative pl-6">
      {!isLast && <span className="absolute left-[7px] top-5 h-[calc(100%-4px)] w-0.5 bg-[var(--line-strong)]" />}
      <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-[var(--brand)] bg-[var(--surface)]" />
      <div className="label mb-1">{tag}</div>
      <div className="pb-4">{children}</div>
    </div>
  );
  return (
    <div>
      <Title eyebrow="See it all at once" title="Line of sight" sub="Pick a goal. See where it comes from and what moves it this week." />
      <label className="label mb-1 block" htmlFor="goal">Goal</label>
      <select id="goal" className="field mb-5" value={pick} onChange={(e) => setPick(e.target.value)}>
        {c.goals.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
      </select>
      <Card className="p-4">
        <Step tag="Where we are going">
          <p className="text-[15px]">{D.bigAim.line}</p>
        </Step>
        <Step tag="This season's goal">
          <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{g.title}</span><StatusPill s={g.status} /></div>
          <div className="mt-1"><Who id={g.who} /></div>
        </Step>
        <Step tag="This week's number">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold">{n.name}</div>
              <div className="text-sm text-[var(--muted)]">Goal {fmt(n.goal, n.fmt)}</div>
            </div>
            <div className={cx("font-display text-2xl font-semibold", hit(n) ? "text-[var(--good)]" : "text-[var(--bad)]")}>{fmt(last, n.fmt)}</div>
          </div>
        </Step>
        <Step tag="To-dos this week">
          <ul className="space-y-1 text-[15px]">{g.todos.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true">☐</span>{t}</li>)}</ul>
        </Step>
        <Step tag="Files" last>
          <button className="w-full rounded-xl border border-[var(--line)] bg-[var(--sunk)] px-3 py-2 text-left text-sm" onClick={() => c.go("files")}>
            <span className="font-semibold">MIB Drive / {g.folder}</span>
          </button>
        </Step>
      </Card>
    </div>
  );
}

// ---------------- Monday huddle ----------------
const huddleSteps = [
  { t: "Good news", min: 5, what: "Each person shares one win from last week." },
  { t: "Numbers", min: 5, what: "Look at the weekly numbers. Red dots go on the problems list." },
  { t: "Goals", min: 5, what: "Each goal owner says on track or behind. No long talks." },
  { t: "Problems", min: 10, what: "Pick the top problem. Find the real cause. Agree on the fix." },
  { t: "To-dos", min: 5, what: "Read back who does what by next Monday." },
];
export function Huddle({ c }: { c: Ctx }) {
  const [done, setDone] = useState<number[]>([]);
  const toggle = (i: number) => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]));
  return (
    <div>
      <Title eyebrow="Mondays · 7:00 AM · 30 minutes" title="Monday huddle" sub="Thomas, Kat, David and the two crew leads. Same five steps every week." />
      <div className="mb-4 flex flex-wrap gap-2">{["thomas", "kat", "david", "marcus", "jesse"].map((p) => <Who key={p} id={p} />)}</div>
      <Card className="overflow-hidden">
        <ol className="divide-y divide-[var(--line)]">
          {huddleSteps.map((s, i) => (
            <li key={s.t}>
              <button onClick={() => toggle(i)} className="flex w-full items-start gap-3 p-3 text-left">
                <span className={cx("mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold", done.includes(i) ? "bg-[var(--brand)] text-[var(--brand-ink)]" : "bg-[var(--sunk)]")}>{done.includes(i) ? "✓" : i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2"><span className="font-semibold">{s.t}</span><span className="text-xs text-[var(--muted)]">{s.min} min</span></span>
                  <span className="block text-sm text-[var(--muted)]">{s.what}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="btn-quiet" onClick={() => c.go("problems")}>Problems list</button>
        <button className="btn" onClick={() => { setDone([0, 1, 2, 3, 4]); c.say("Huddle done. Notes and to-dos saved for everyone."); }}>Finish huddle</button>
      </div>
    </div>
  );
}

// ---------------- Problems to fix ----------------
export function Problems({ c }: { c: Ctx }) {
  const [open, setOpen] = useState<string | null>(null);
  const [fix, setFix] = useState("");
  const p = c.problems.find((x) => x.id === open);
  const openList = c.problems.filter((x) => !x.solved);
  const solved = c.problems.filter((x) => x.solved);
  return (
    <div>
      <Title eyebrow="Write it down, fix it once" title="Problems to fix" sub="Anyone can add a problem. The Monday huddle fixes the top one." />
      <div className="space-y-2">
        {openList.map((x) => (
          <Card key={x.id} className="p-3" onClick={() => { setOpen(x.id); setFix(""); }}>
            <BizTag b={x.biz} />
            <div className="font-semibold leading-snug">{x.title}</div>
            <div className="mt-1 text-sm text-[var(--muted)]">Added by {D.people[x.by].name} · {x.age} ago</div>
          </Card>
        ))}
      </div>
      <button className="btn-quiet mt-3 w-full" onClick={() => c.say("Sample only. Type or say the problem and it lands here.")}>Add a problem</button>
      {solved.length > 0 && (
        <div className="mt-5">
          <div className="label mb-2">Fixed</div>
          <div className="space-y-2">
            {solved.map((x) => (
              <Card key={x.id} className="p-3">
                <div className="font-semibold text-[var(--muted)] line-through">{x.title}</div>
                <div className="mt-1 text-sm">Fix: {x.fix}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {p && (
        <Sheet eyebrow="Problem" title={p.title} onClose={() => setOpen(null)}>
          <label className="label mb-1 block" htmlFor="fix">What is the fix?</label>
          <textarea id="fix" className="field mb-3 min-h-[90px]" placeholder="Example: put gate codes on every job card" value={fix} onChange={(e) => setFix(e.target.value)} />
          <button className="btn w-full" onClick={() => { c.setProblems((all) => all.map((x) => (x.id === p.id ? { ...x, solved: true, fix: fix || "Agreed at the huddle" } : x))); setOpen(null); c.say("Marked fixed. A to-do was made for the owner."); }}>Mark fixed</button>
        </Sheet>
      )}
    </div>
  );
}

// ---------------- Files ----------------
const kindTag: Record<D.FileRef["kind"], string> = { folder: "FOLDER", doc: "DOC", sheet: "SHEET", pdf: "PDF", photos: "PHOTOS" };
export function Files({ c }: { c: Ctx }) {
  return (
    <div>
      <Title eyebrow="MIB Drive" title="Company files" sub="Every file stays in MIB's own Google Drive. Home Base just finds it fast." />
      <div className="space-y-4">
        {D.files.map((g) => (
          <div key={g.group}>
            <div className="mb-2"><BizTag b={g.biz} /> <span className="ml-1 font-semibold">{g.group}</span></div>
            <div className="space-y-2">
              {g.items.map((f) => (
                <button key={f.label} onClick={() => c.say(`Sample only. Opens "${f.label}" in Google Drive.`)} className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-left active:bg-[var(--sunk)]">
                  <span className="shrink-0 rounded bg-[var(--chip)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[var(--brand-strong)]">{kindTag[f.kind]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{f.label}</span>
                    <span className="block truncate text-xs text-[var(--muted)]">{f.path}</span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">{f.updated}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Connections ----------------
export function Feeds() {
  return (
    <div>
      <Title eyebrow="Where numbers come from" title="Connections" sub="Home Base pulls from the tools MIB already uses. Nothing gets typed twice." />
      <div className="space-y-2">
        {D.feeds.map((f) => (
          <Card key={f.name} className="flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{f.name}</div>
              <div className="text-sm text-[var(--muted)]">{f.what}</div>
            </div>
            <Pill tone={f.state === "Sample" ? "good" : "brand"}>{f.state === "Sample" ? "In mockup" : "Planned"}</Pill>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- About ----------------
export function About() {
  return (
    <div>
      <Title eyebrow="Plumbline Studio" title="About this mockup" />
      <Card className="space-y-3 p-4 text-[15px] leading-relaxed">
        <p>This is a mockup. It shows how one app could run MIB Tree Service, the grinding yard and MIB Supplies.</p>
        <p>Every name, number and message is made up. Nothing here is sent to anyone.</p>
        <p>The first real piece we would build is the message helper. It answers Facebook questions about log splitters, using Thomas&apos;s own answers.</p>
        <p>Next comes the job board for the crews. Then the yard log and the store.</p>
      </Card>
    </div>
  );
}
