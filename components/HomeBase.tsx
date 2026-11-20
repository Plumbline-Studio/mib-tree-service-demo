"use client";
import React, { useCallback, useEffect, useState } from "react";
import * as D from "../lib/data";
import { Logo, cx } from "./ui";
import { Today, Jobs, Inbox, type Ctx } from "./views";
import { Yard, Store } from "./views2";
import { Numbers, Goals, Huddle, Problems, Line, Files, Feeds, About } from "./views3";
import { CrewApp, QuickBooks, Companies } from "./views4";
import { HeardToday } from "./views5";

const TABS = [
  { id: "today", label: "Today", icon: "M3 11 L12 4 L21 11 V20 H14 V14 H10 V20 H3 Z" },
  { id: "heard", label: "Heard", icon: "M12 3 A3 3 0 0 1 15 6 V11 A3 3 0 0 1 9 11 V6 A3 3 0 0 1 12 3 Z M6 11 A6 6 0 0 0 18 11 M12 17 V21 M9 21 H15" },
  { id: "jobs", label: "Jobs", icon: "M12 3 L19 14 H15 L20 21 H4 L9 14 H5 Z" },
  { id: "inbox", label: "Messages", icon: "M4 5 H20 V16 H9 L5 20 V16 H4 Z" },
  { id: "yard", label: "Yard", icon: "M3 18 H21 M5 18 L8 10 H16 L19 18 M9 10 L10 6 H14 L15 10" },
];

const GROUPS = [
  { title: "More places", items: [
    { id: "store", label: "Store", note: "Opening day list and stock" },
    { id: "crew", label: "Crew app", note: "What your crew leads see" },
    { id: "quickbooks", label: "QuickBooks", note: "Invoices and who has paid" },
  ] },
  { title: "Plan ahead", items: [
    { id: "numbers", label: "Weekly numbers", note: "One number per business" },
    { id: "goals", label: "90-day goals", note: "What we finish this season" },
    { id: "huddle", label: "Monday huddle", note: "30 minutes with Kat and the leads" },
    { id: "problems", label: "Problems to fix", note: "Write it down, fix it once" },
  ] },
  { title: "Setup", items: [
    { id: "files", label: "Company files", note: "Everything in one Drive" },
    { id: "feeds", label: "Connections", note: "Where the numbers come from" },
    { id: "companies", label: "Other tree services", note: "Your app, under their name" },
    { id: "about", label: "About this mockup", note: "What is real and what is sample" },
  ] },
];
const MORE = [...GROUPS.flatMap((g) => g.items), { id: "line", label: "Line of sight", note: "" }];

// One short how-to for each screen, written for Thomas.
const TIPS: Record<string, string> = {
  today: "This is your start page. The list at the top is what only you can do. Tap a line to take care of it.",
  heard: "Press the button on your Pocket when you get in the truck. What it hears shows up here. Tap Keep if it is right, Fix if it is wrong, Toss if you do not want it.",
  jobs: "Every job for every crew. Tap a job to see its folder: the estimate, the photos and the bill.",
  inbox: "Facebook questions about splitters. Easy ones are answered for you. The rest wait here. Read them and tap Send.",
  yard: "Every truck that dumps at the yard. Drivers log their own load at the gate. You see who owes you.",
  store: "Get ready for opening day. Check things off the list and watch for low stock.",
  crew: "This is what your crew leads see on their phones. They pick a job, then tap to take photos.",
  quickbooks: "Home Base and QuickBooks stay in step. Kat checks each bill before it goes out.",
  numbers: "One number for each business, each week. Green means on track. Red means look closer.",
  goals: "A few big things to finish this season. Each one has a person in charge.",
  line: "This shows how a big goal turns into this week's work.",
  huddle: "A 30 minute Monday meeting. Go down this list in order.",
  problems: "When something goes wrong, write it here. Fix it once so it stays fixed.",
  files: "All your papers live in one Google Drive. Tap a folder to open it.",
  feeds: "Where each number comes from. You never type these in.",
  companies: "Other tree services can use this app under their own name. You see them all here.",
  about: "This is a sample. The names and numbers are made up.",
};

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
  const [folders, setFolders] = useState(D.folders);
  const [visits, setVisits] = useState(D.visits);
  const [heard, setHeard] = useState(D.heard);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    try { setHidden(JSON.parse(localStorage.getItem("hb-tips-hidden") || "[]")); } catch {}
  }, []);
  const saveHidden = (next: string[]) => { setHidden(next); try { localStorage.setItem("hb-tips-hidden", JSON.stringify(next)); } catch {} };

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const flipTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("hb-theme", next); } catch {}
    setTheme(next);
  };

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

  const markDone = useCallback((id: string) => {
    setJobs((all) => all.map((j) => (j.id === id ? { ...j, status: "done" } : j)));
    setFolders((all) => {
      const next = 1047 + all.filter((f) => f.invoice.state === "draft").length;
      return all.map((f) => (f.jobId === id && f.invoice.state === "none" ? { ...f, invoice: { no: String(next), state: "draft" } } : f));
    });
  }, []);

  const c: Ctx = { jobs, setJobs, threads, setThreads, loads, setLoads, goals, setGoals, problems, setProblems, checklist, setChecklist, autoSend, setAutoSend, folders, setFolders, visits, setVisits, heard, setHeard, markDone, go, say: setToast };

  const View = ({ today: Today, jobs: Jobs, inbox: Inbox, yard: Yard, store: Store, numbers: Numbers, goals: Goals, line: Line, huddle: Huddle, problems: Problems, files: Files, feeds: Feeds, about: About, crew: CrewApp, quickbooks: QuickBooks, companies: Companies, heard: HeardToday } as Record<string, React.FC<{ c: Ctx }>>)[view];
  const waiting = threads.filter((t) => t.state !== "sent").length;
  const newHeard = heard.filter((h) => h.state === "new").length;
  const badge: Record<string, number> = { inbox: waiting, heard: newHeard };
  const tip = TIPS[view] && !hidden.includes(view) ? TIPS[view] : null;
  const inMore = MORE.some((m) => m.id === view);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[var(--bg)]">
        <div className="bg-[var(--bar)] px-4 py-1 text-center text-[11px] text-white">Mockup with sample data. Made by Plumbline Studio.</div>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--line)] bg-[var(--bg)]/95 px-4 py-2.5 backdrop-blur">
          <Logo size={32} />
          <span aria-hidden="true" className="h-8 w-px shrink-0 bg-[var(--line-strong)]" />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[22px] leading-none">{D.company.appName}</div>
            <div className="truncate text-xs text-[var(--muted)]">MIB Tree Service · Yard · Supplies</div>
          </div>
          <button onClick={flipTheme} className="btn-quiet !px-2.5" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}>
            {theme === "dark" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
            )}
          </button>
          <button onClick={() => setMore(true)} className={cx("btn-quiet", inMore && "border-[var(--brand)] text-[var(--brand-strong)]")} aria-label="More screens">More</button>
        </header>

        <main className="px-4 pb-28 pt-4">
          {tip && (
            <div role="note" className="mb-4 flex items-start gap-3 rounded-2xl border border-[var(--brand)] bg-[var(--chip)] p-3">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-[var(--brand-ink)]">?</span>
              <p className="min-w-0 flex-1 text-[15px] leading-snug text-[var(--ink)]">{tip}</p>
              <button className="shrink-0 text-sm font-semibold text-[var(--brand-strong)]" onClick={() => saveHidden([...hidden, view])}>Got it</button>
            </div>
          )}
          <View c={c} />
        </main>

        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]">
          <ul className="mx-auto grid max-w-[480px] grid-cols-5">
            {TABS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} onClick={(e) => { e.preventDefault(); go(t.id); }} aria-current={view === t.id ? "page" : undefined}
                  className={cx("relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold", view === t.id ? "text-[var(--brand-strong)]" : "text-[var(--muted)]")}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={t.icon} /></svg>
                  {view === t.id && <span aria-hidden="true" className="absolute inset-x-[22%] top-0 h-[3px] rounded-b bg-[var(--brand)]" />}
                  {t.label}
                  {badge[t.id] > 0 && <span className="absolute right-[18%] top-1.5 rounded-full bg-[var(--safety)] px-1.5 text-[10px] leading-4 text-white">{badge[t.id]}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {more && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setMore(false)}>
          <div className="safe-bottom max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-[var(--surface)] px-4 pt-3" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="More screens">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--line-strong)]" />
            {GROUPS.map((g) => (
              <div key={g.title} className="mb-3">
                <div className="label mb-1">{g.title}</div>
                <ul className="divide-y divide-[var(--line)]">
                  {g.items.map((m) => (
                    <li key={m.id}>
                      <button onClick={() => go(m.id)} className="flex min-h-[52px] w-full items-center justify-between gap-3 py-2 text-left">
                        <span className="min-w-0">
                          <span className={cx("block font-semibold", view === m.id && "text-[var(--brand-strong)]")}>{m.label}</span>
                          <span className="block text-sm text-[var(--muted)]">{m.note}</span>
                        </span>
                        <span aria-hidden="true" className="text-[var(--muted)]">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {hidden.length > 0 && (
              <button className="btn-quiet mb-4 w-full" onClick={() => { saveHidden([]); setMore(false); }}>Show the tips again</button>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-20 z-[60] mx-auto w-[calc(100%-32px)] max-w-[448px] rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--bg)] shadow-lg">{toast}</div>
      )}
    </div>
  );
}
