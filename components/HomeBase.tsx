"use client";
import React, { useCallback, useEffect, useState } from "react";
import * as D from "../lib/data";
import { Logo, cx } from "./ui";
import { Today, Jobs, Inbox, type Ctx } from "./views";
import { Yard, Store } from "./views2";
import { Numbers, Goals, Huddle, Problems, Line, Files, Feeds, About } from "./views3";

const TABS = [
  { id: "today", label: "Today", icon: "M3 11 L12 4 L21 11 V20 H14 V14 H10 V20 H3 Z" },
  { id: "jobs", label: "Jobs", icon: "M12 3 L19 14 H15 L20 21 H4 L9 14 H5 Z" },
  { id: "inbox", label: "Messages", icon: "M4 5 H20 V16 H9 L5 20 V16 H4 Z" },
  { id: "yard", label: "Yard", icon: "M3 18 H21 M5 18 L8 10 H16 L19 18 M9 10 L10 6 H14 L15 10" },
  { id: "store", label: "Store", icon: "M4 9 L6 4 H18 L20 9 M4 9 H20 V20 H4 Z M10 20 V14 H14 V20" },
];

const MORE = [
  { id: "numbers", label: "Weekly numbers", note: "One number per business" },
  { id: "goals", label: "90-day goals", note: "What we finish this season" },
  { id: "line", label: "Line of sight", note: "How a goal ties to this week" },
  { id: "huddle", label: "Monday huddle", note: "30 minutes with Kat and the leads" },
  { id: "problems", label: "Problems to fix", note: "Write it down, fix it once" },
  { id: "files", label: "Company files", note: "Everything in one Drive" },
  { id: "feeds", label: "Connections", note: "Where the numbers come from" },
  { id: "about", label: "About this mockup", note: "What is real and what is sample" },
];

const ALL = [...TABS.map((t) => t.id), ...MORE.map((m) => m.id)];

export default function HomeBase() {
  const [view, setView] = useState("today");
  const [more, setMore] = useState(false);
  const [jobs, setJobs] = useState(D.jobs);
  const [threads, setThreads] = useState(D.threads);
  const [loads, setLoads] = useState(D.loads);
  const [goals, setGoals] = useState(D.goals);
  const [problems, setProblems] = useState(D.problems);
  const [checklist, setChecklist] = useState(D.openingChecklist);
  const [autoSend, setAutoSend] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      setView(ALL.includes(h) ? h : "today");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const go = useCallback((v: string) => {
    window.location.hash = v;
    setView(v);
    setMore(false);
    window.scrollTo({ top: 0 });
  }, []);

  const c: Ctx = { jobs, setJobs, threads, setThreads, loads, setLoads, goals, setGoals, problems, setProblems, checklist, setChecklist, autoSend, setAutoSend, go, say: setToast };

  const View = ({ today: Today, jobs: Jobs, inbox: Inbox, yard: Yard, store: Store, numbers: Numbers, goals: Goals, line: Line, huddle: Huddle, problems: Problems, files: Files, feeds: Feeds, about: About } as Record<string, React.FC<{ c: Ctx }>>)[view];
  const waiting = threads.filter((t) => t.state !== "sent").length;
  const inMore = MORE.some((m) => m.id === view);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[var(--bg)]">
        <div className="bg-[var(--brand-strong)] px-4 py-1 text-center text-[11px] text-white">Mockup with sample data. Made by Plumbline Studio.</div>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--bg)]/95 px-4 py-2.5 backdrop-blur">
          <Logo size={32} />
          <div className="min-w-0 flex-1">
            <div className="font-display text-xl font-semibold leading-none">{D.company.appName}</div>
            <div className="truncate text-xs text-[var(--muted)]">MIB Tree Service · Yard · Supplies</div>
          </div>
          <button onClick={() => setMore(true)} className={cx("btn-quiet", inMore && "border-[var(--brand)] text-[var(--brand-strong)]")} aria-label="More screens">More</button>
        </header>

        <main className="px-4 pb-28 pt-4">
          <View c={c} />
        </main>

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]">
          <ul className="mx-auto grid max-w-[480px] grid-cols-5">
            {TABS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); go(t.id); }} aria-current={view === t.id ? "page" : undefined}
                  className={cx("relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold", view === t.id ? "text-[var(--brand)]" : "text-[var(--muted)]")}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={t.icon} /></svg>
                  {t.label}
                  {t.id === "inbox" && waiting > 0 && <span className="absolute right-[18%] top-1.5 rounded-full bg-[var(--safety)] px-1.5 text-[10px] leading-4 text-white">{waiting}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {more && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setMore(false)}>
          <div className="safe-bottom w-full max-w-[480px] rounded-t-3xl bg-[var(--surface)] px-4 pt-3" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More screens">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--line-strong)]" />
            <div className="label mb-2">Run the whole company</div>
            <ul className="mb-4 divide-y divide-[var(--line)]">
              {MORE.map((m) => (
                <li key={m.id}>
                  <button onClick={() => go(m.id)} className="flex min-h-[52px] w-full items-center justify-between gap-3 py-2 text-left">
                    <span className="min-w-0">
                      <span className={cx("block font-semibold", view === m.id && "text-[var(--brand)]")}>{m.label}</span>
                      <span className="block text-sm text-[var(--muted)]">{m.note}</span>
                    </span>
                    <span aria-hidden="true" className="text-[var(--muted)]">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-20 z-[60] mx-auto w-[calc(100%-32px)] max-w-[448px] rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--bg)] shadow-lg">{toast}</div>
      )}
    </div>
  );
}
