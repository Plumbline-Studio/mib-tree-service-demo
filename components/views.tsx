"use client";
import React, { useState } from "react";
import * as D from "../lib/data";
import { Card, Title, Tabs, Pill, Who, BizTag, Sheet, PhotoTile, money, cx } from "./ui";

type Set<T> = React.Dispatch<React.SetStateAction<T>>;
export type Ctx = {
  jobs: D.Job[]; setJobs: Set<D.Job[]>;
  threads: D.Thread[]; setThreads: Set<D.Thread[]>;
  loads: D.Load[]; setLoads: Set<D.Load[]>;
  goals: D.Goal[]; setGoals: Set<D.Goal[]>;
  problems: D.Problem[]; setProblems: Set<D.Problem[]>;
  checklist: typeof D.openingChecklist; setChecklist: Set<typeof D.openingChecklist>;
  autoSend: boolean; setAutoSend: Set<boolean>;
  go: (v: string) => void;
  say: (s: string) => void;
};

const nextStatus: Record<D.JobStatus, D.JobStatus> = { booked: "rolling", rolling: "working", working: "done", done: "done" };
const statusTone: Record<D.JobStatus, "brand" | "warn" | "good"> = { booked: "brand", rolling: "warn", working: "warn", done: "good" };

// ---------------- Today ----------------
export function Today({ c }: { c: Ctx }) {
  const todayJobs = c.jobs.filter((j) => j.day === "Today");
  const needs = c.threads.filter((t) => t.state === "needs");
  const drafted = c.threads.filter((t) => t.state === "drafted");
  const sent = c.threads.filter((t) => t.state === "sent").length + 12;
  const hotQuote = D.quotes.find((q) => q.hot)!;
  const yardToday = c.loads.length;
  const splitters = D.stock.find((s) => s.biz === "splitters")!;

  const asks = [
    ...needs.map((t) => ({ key: t.id, text: `${t.from} asked about a ${t.topic.toLowerCase()}`, sub: "Splitter message. Only you can answer this one.", go: "inbox" })),
    ...(drafted.length ? [{ key: "drafts", text: `${drafted.length} splitter replies are ready`, sub: "Read them and tap Send.", go: "inbox" }] : []),
    { key: "quote", text: `Call ${hotQuote.customer} about the ${money(hotQuote.price)} quote`, sub: "David says they are ready to book.", go: "jobs" },
  ];

  return (
    <div>
      <Title eyebrow={D.company.today} title="Good morning, Thomas" sub={asks.length ? `${asks.length} things need you today. Everything else is handled.` : "Nothing needs you right now."} />

      <Card className="mb-5 overflow-hidden">
        <div className="border-b border-[var(--line)] bg-[var(--sunk)] px-4 py-2 label">Needs you</div>
        <ul className="divide-y divide-[var(--line)]">
          {asks.map((a) => (
            <li key={a.key}>
              <button onClick={() => c.go(a.go)} className="flex min-h-[60px] w-full items-center gap-3 px-4 py-3 text-left active:bg-[var(--sunk)]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--safety)]" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug">{a.text}</span>
                  <span className="block text-sm text-[var(--muted)]">{a.sub}</span>
                </span>
                <span aria-hidden="true" className="text-[var(--muted)]">›</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="label mb-2">Your businesses today</div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <BizCard b="tree" big={`${todayJobs.filter((j) => j.status !== "done").length} jobs`} small={`${todayJobs.filter((j) => j.status === "done").length} done · 2 crews out`} onClick={() => c.go("jobs")} />
        <BizCard b="splitters" big={`${sent} answered`} small={`${drafted.length + needs.length} waiting · ${splitters.onHand} in stock`} onClick={() => c.go("inbox")} />
        <BizCard b="yard" big={`${yardToday} loads`} small={`${money(c.loads.reduce((s, l) => s + l.price, 0))} so far today`} onClick={() => c.go("yard")} />
        <BizCard b="store" big="11 days" small="until opening day" onClick={() => c.go("store")} />
      </div>

      <div className="mb-2 flex items-end justify-between">
        <div className="label">Crews right now</div>
        <button className="text-sm font-semibold text-[var(--brand)]" onClick={() => c.go("jobs")}>All jobs</button>
      </div>
      <div className="space-y-2">
        {todayJobs.slice(0, 3).map((j) => (
          <Card key={j.id} className="flex items-center gap-3 p-3" onClick={() => c.go("jobs")}>
            <div className="w-16 shrink-0 text-sm font-semibold tabular-nums">{j.time}</div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{j.customer}</div>
              <div className="truncate text-sm text-[var(--muted)]">{j.work}</div>
            </div>
            <Pill tone={statusTone[j.status]}>{D.jobStatusText[j.status]}</Pill>
          </Card>
        ))}
      </div>

      <p className="mt-6 rounded-xl bg-[var(--sunk)] p-3 text-sm text-[var(--ink-soft)]">
        This is the one screen Thomas opens in the morning. It shows only what needs him. The crews, the yard log and the message replies keep going without him.
      </p>
    </div>
  );
}

function BizCard({ b, big, small, onClick }: { b: D.Biz; big: string; small: string; onClick: () => void }) {
  return (
    <Card className="p-3" onClick={onClick}>
      <BizTag b={b} />
      <div className="mt-1.5 font-display text-[26px] font-semibold leading-none">{big}</div>
      <div className="mt-1 text-[13px] leading-snug text-[var(--muted)]">{small}</div>
    </Card>
  );
}

// ---------------- Jobs (tree service) ----------------
export function Jobs({ c }: { c: Ctx }) {
  const [tab, setTab] = useState<"today" | "week" | "quotes">("today");
  const [open, setOpen] = useState<string | null>(null);
  const job = c.jobs.find((j) => j.id === open);
  const advance = (id: string) => c.setJobs((all) => all.map((j) => (j.id === id ? { ...j, status: nextStatus[j.status] } : j)));

  return (
    <div>
      <Title eyebrow="MIB Tree Service" title="Jobs" sub="Every job, crew, quote and photo in one place." />
      <Tabs value={tab} onChange={setTab} items={[["today", "Today"], ["week", "This week"], ["quotes", "Quotes"]]} />

      {tab === "today" && (
        <div className="space-y-3">
          {(["marcus", "jesse"] as const).map((crew) => (
            <div key={crew}>
              <div className="mb-2 flex items-center justify-between">
                <Who id={crew} />
                <span className="text-xs text-[var(--muted)]">{crew === "marcus" ? "Crew 1 · bucket truck" : "Crew 2 · chipper"}</span>
              </div>
              <div className="space-y-2">
                {c.jobs.filter((j) => j.day === "Today" && j.crew === crew).map((j) => (
                  <JobCard key={j.id} j={j} onOpen={() => setOpen(j.id)} onAdvance={() => advance(j.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "week" && (
        <div className="space-y-4">
          {["Today", "Mon", "Tue", "Wed"].map((d) => (
            <div key={d}>
              <div className="label mb-2">{d === "Today" ? "Today, Fri" : d}</div>
              <div className="space-y-2">
                {c.jobs.filter((j) => j.day === d).map((j) => (
                  <Card key={j.id} className="flex items-center gap-3 p-3" onClick={() => setOpen(j.id)}>
                    <div className="w-[62px] shrink-0 text-sm font-semibold tabular-nums">{j.time}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{j.customer}</div>
                      <div className="truncate text-sm text-[var(--muted)]">{D.people[j.crew].name.split(" ")[0]}&apos;s crew · {money(j.price)}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          <button className="btn w-full" onClick={() => c.say("Sample only. In the real app David books the job here and the crew lead sees it.")}>Book a job</button>
        </div>
      )}

      {tab === "quotes" && <Quotes c={c} />}

      {job && (
        <Sheet eyebrow={`${job.day} · ${job.time}`} title={job.customer} onClose={() => setOpen(null)}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Pill tone={statusTone[job.status]}>{D.jobStatusText[job.status]}</Pill>
            <span className="text-sm text-[var(--muted)]">{job.street}</span>
          </div>
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="label">Work</dt><dd>{job.work}</dd></div>
            <div><dt className="label">Price</dt><dd className="font-semibold">{money(job.price)}</dd></div>
            <div><dt className="label">Crew</dt><dd>{D.people[job.crew].name}</dd></div>
            <div><dt className="label">Phone</dt><dd>{job.phone}</dd></div>
          </dl>
          {job.notes && <p className="mb-4 rounded-xl bg-[var(--sunk)] p-3 text-sm">{job.notes}</p>}
          <div className="label mb-2">Job photos ({job.photos})</div>
          {job.photos > 0 ? (
            <div className="mb-4 grid grid-cols-3 gap-2">
              {Array.from({ length: Math.min(job.photos, 6) }).map((_, i) => <PhotoTile key={i} seed={i + job.id.length} />)}
            </div>
          ) : <p className="mb-4 text-sm text-[var(--muted)]">No photos yet. The crew adds them from their phone.</p>}
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-quiet" onClick={() => c.say(`Sample only. Texts ${job.customer}: "We are on the way."`)}>Text on my way</button>
            <button className="btn" disabled={job.status === "done"} onClick={() => advance(job.id)}>
              {job.status === "done" ? "Done" : `Mark ${D.jobStatusText[nextStatus[job.status]].toLowerCase()}`}
            </button>
          </div>
          {job.status === "done" && <p className="mt-3 text-sm text-[var(--muted)]">Done jobs go to QuickBooks as an invoice. Kat checks it before it sends.</p>}
        </Sheet>
      )}
    </div>
  );
}

function JobCard({ j, onOpen, onAdvance }: { j: D.Job; onOpen: () => void; onAdvance: () => void }) {
  return (
    <Card className="p-3">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold tabular-nums text-[var(--muted)]">{j.time}</div>
            <div className="font-semibold leading-snug">{j.customer}</div>
            <div className="text-sm text-[var(--muted)]">{j.work}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-semibold tabular-nums">{money(j.price)}</div>
            <div className="text-xs text-[var(--muted)]">{j.photos} photos</div>
          </div>
        </div>
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2">
        <Pill tone={statusTone[j.status]}>{D.jobStatusText[j.status]}</Pill>
        {j.status !== "done" && <button className="text-sm font-semibold text-[var(--brand)]" onClick={onAdvance}>Mark {D.jobStatusText[nextStatus[j.status]].toLowerCase()}</button>}
      </div>
    </Card>
  );
}

function Quotes({ c }: { c: Ctx }) {
  const total = D.quotes.reduce((s, q) => s + q.price, 0);
  return (
    <div>
      <Card className="mb-3 flex items-center justify-between p-3">
        <div>
          <div className="label">Quotes waiting</div>
          <div className="font-display text-2xl font-semibold">{money(total)}</div>
        </div>
        <Who id="david" />
      </Card>
      <div className="space-y-2">
        {D.quotes.map((q) => (
          <Card key={q.id} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold">{q.customer}</div>
                <div className="text-sm text-[var(--muted)]">{q.work}</div>
              </div>
              <div className="shrink-0 font-semibold tabular-nums">{money(q.price)}</div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-2">
              <span className={cx("text-xs font-semibold", q.age >= 7 ? "text-[var(--bad)]" : "text-[var(--muted)]")}>Sent {q.sent} · {q.age} days</span>
              <button className="text-sm font-semibold text-[var(--brand)]" onClick={() => c.say(`Sample only. Drafts a friendly follow-up text to ${q.customer} for David to send.`)}>Follow up</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------------- Inbox (Facebook messages about log splitters) ----------------
export function Inbox({ c }: { c: Ctx }) {
  const [tab, setTab] = useState<"waiting" | "sent" | "answers">("waiting");
  const [open, setOpen] = useState<string | null>(null);
  const [edit, setEdit] = useState("");
  const t = c.threads.find((x) => x.id === open);
  const waiting = c.threads.filter((x) => x.state !== "sent");
  const sentList = c.threads.filter((x) => x.state === "sent");

  const send = (id: string, text?: string) => {
    c.setThreads((all) => all.map((x) => (x.id === id ? { ...x, state: "sent", draft: text ?? x.draft, when: "Just now" } : x)));
    setOpen(null);
    c.say("Sent on Facebook. (Sample only, nothing really sent.)");
  };
  const sendAllEasy = () => {
    const n = c.threads.filter((x) => x.state === "drafted").length;
    c.setThreads((all) => all.map((x) => (x.state === "drafted" ? { ...x, state: "sent", when: "Just now" } : x)));
    c.say(`${n} replies sent. (Sample only, nothing really sent.)`);
  };

  return (
    <div>
      <Title eyebrow="Facebook · Log splitters" title="Messages" sub="Home Base reads each splitter question and writes the reply. You only answer the hard ones." />

      <Card className="mb-4 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold">Send easy answers on their own</div>
            <div className="text-sm text-[var(--muted)]">Price, stock and hours. Never payment plans or trades.</div>
          </div>
          <button role="switch" aria-checked={c.autoSend} aria-label="Send easy answers on their own" onClick={() => { c.setAutoSend(!c.autoSend); c.say(c.autoSend ? "Off. Every reply waits for your Send." : "On. Easy answers go out in under a minute."); }}
            className={cx("relative h-8 w-14 shrink-0 rounded-full transition-colors", c.autoSend ? "bg-[var(--brand)]" : "bg-[var(--line-strong)]")}>
            <span className={cx("absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform", c.autoSend ? "translate-x-7" : "translate-x-1")} />
          </button>
        </div>
      </Card>

      <Tabs value={tab} onChange={setTab} items={[["waiting", `Waiting (${waiting.length})`], ["sent", "Sent"], ["answers", "Answer sheet"]]} />

      {tab === "waiting" && (
        <div className="space-y-2">
          {waiting.length === 0 && <p className="rounded-xl bg-[var(--sunk)] p-4 text-center text-sm">All caught up. No one is waiting.</p>}
          {waiting.map((x) => (
            <Card key={x.id} className="p-3" onClick={() => { setOpen(x.id); setEdit(x.draft); }}>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{x.from}</span>
                <span className="shrink-0 text-xs text-[var(--muted)]">{x.when}</span>
              </div>
              <div className="mt-0.5 text-[15px] leading-snug">&ldquo;{x.ask}&rdquo;</div>
              <div className="mt-2 flex items-center gap-2">
                {x.state === "needs" ? <Pill tone="warn">Needs you</Pill> : <Pill tone="good">Reply ready</Pill>}
                <span className="text-xs text-[var(--muted)]">{x.topic}</span>
              </div>
            </Card>
          ))}
          {waiting.some((x) => x.state === "drafted") && (
            <button className="btn btn-safety mt-2 w-full" onClick={sendAllEasy}>Send all ready replies</button>
          )}
        </div>
      )}

      {tab === "sent" && (
        <div className="space-y-2">
          <p className="mb-1 text-sm text-[var(--muted)]">12 more were sent earlier this week.</p>
          {sentList.map((x) => (
            <Card key={x.id} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{x.from}</span>
                <span className="shrink-0 text-xs text-[var(--muted)]">{x.when}</span>
              </div>
              <div className="text-sm text-[var(--muted)]">&ldquo;{x.ask}&rdquo;</div>
              <div className="mt-2 rounded-xl bg-[var(--chip)] p-2.5 text-sm">{x.draft}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "answers" && (
        <div>
          <p className="mb-3 text-sm text-[var(--muted)]">These are Thomas&apos;s own answers. Home Base only says what is on this sheet. Change a line and every reply changes.</p>
          <div className="space-y-2">
            {D.answerSheet.map((a) => (
              <Card key={a.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{a.topic}</span>
                  <Pill tone={a.mode === "auto" ? "good" : a.mode === "draft" ? "brand" : "warn"}>{a.mode === "auto" ? "Can send itself" : a.mode === "draft" ? "Draft for me" : "Always ask me"}</Pill>
                </div>
                <div className="mt-1 text-sm text-[var(--ink-soft)]">{a.rule}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {t && (
        <Sheet eyebrow={`Facebook · ${t.when}`} title={t.from} onClose={() => setOpen(null)}>
          <div className="mb-3 max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--sunk)] p-3 text-[15px]">{t.ask}</div>
          {t.why && <p className="mb-3 rounded-xl pill-warn p-3 text-sm font-semibold">{t.why}</p>}
          <label className="label mb-1 block" htmlFor="reply">{t.state === "needs" ? "Holding reply (you can change it)" : "Reply Home Base wrote"}</label>
          <textarea id="reply" className="field mb-3 min-h-[110px]" value={edit} onChange={(e) => setEdit(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-quiet" onClick={() => setOpen(null)}>Later</button>
            <button className="btn" onClick={() => send(t.id, edit)}>Send</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
