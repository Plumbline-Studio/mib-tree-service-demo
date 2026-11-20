// Sample data for the MIB Home Base mockup.
// Every customer, crew name, number and message here is made up to show how the app works.

export const company = {
  appName: "Home Base",
  name: "MIB",
  owner: "Thomas",
  today: "Friday, Nov 20",
  week: 47,
  quarter: "Winter push",
  quarterWeek: 4,
  quarterWeeks: 13,
};

export type Biz = "tree" | "yard" | "store" | "splitters";

export const bizInfo: Record<Biz, { label: string; short: string; color: string }> = {
  tree: { label: "MIB Tree Service", short: "Tree", color: "var(--leaf)" },
  yard: { label: "Grinding yard", short: "Yard", color: "var(--bark)" },
  store: { label: "MIB Supplies store", short: "Store", color: "var(--sky)" },
  splitters: { label: "Log splitters", short: "Splitters", color: "var(--safety)" },
};

export type Person = { id: string; name: string; role: string; initials: string };
export const people: Record<string, Person> = {
  thomas: { id: "thomas", name: "Thomas", role: "Owner", initials: "TC" },
  kat: { id: "kat", name: "Kat", role: "Office manager", initials: "K" },
  david: { id: "david", name: "David", role: "Estimator", initials: "D" },
  marcus: { id: "marcus", name: "Marcus R.", role: "Crew lead, Crew 1", initials: "MR" },
  jesse: { id: "jesse", name: "Jesse T.", role: "Crew lead, Crew 2", initials: "JT" },
  ray: { id: "ray", name: "Ray", role: "Mechanic", initials: "R" },
  home: { id: "home", name: "Home Base", role: "Drafts replies and logs", initials: "HB" },
};

// ---------- Tree service ----------
export type JobStatus = "booked" | "rolling" | "working" | "done";
export const jobStatusText: Record<JobStatus, string> = {
  booked: "Booked",
  rolling: "On the way",
  working: "On site",
  done: "Done",
};
export type Job = {
  id: string;
  customer: string;
  street: string;
  work: string;
  crew: "marcus" | "jesse";
  time: string;
  day: string;
  price: number;
  status: JobStatus;
  photos: number;
  notes: string;
  phone: string;
};

export const jobs: Job[] = [
  { id: "j1", customer: "Linda Parks", street: "Grandin Rd SW", work: "Take down 2 dead oaks, haul off", crew: "marcus", time: "8:00 AM", day: "Today", price: 3800, status: "working", photos: 6, notes: "Power line on the left side. Gate code is on the job card. Dog in back yard.", phone: "(540) 555-0141" },
  { id: "j2", customer: "Hillcrest Church", street: "Peters Creek Rd", work: "Trim 6 maples off the roof", crew: "jesse", time: "8:30 AM", day: "Today", price: 2200, status: "rolling", photos: 2, notes: "Park in the side lot. Ask for Pastor Dale.", phone: "(540) 555-0187" },
  { id: "j3", customer: "Mark Ellison", street: "Brambleton Ave", work: "Stump grind, 4 stumps", crew: "marcus", time: "1:30 PM", day: "Today", price: 650, status: "booked", photos: 0, notes: "Customer wants chips left in a pile by the shed.", phone: "(540) 555-0119" },
  { id: "j4", customer: "Star City Apartments", street: "Colonial Ave", work: "Storm cleanup, 3 limbs on lot", crew: "jesse", time: "2:00 PM", day: "Today", price: 1400, status: "booked", photos: 3, notes: "Property manager sent photos by text. Billing goes to the main office.", phone: "(540) 555-0166" },
  { id: "j5", customer: "Tom Whitlow", street: "Mud Lick Rd", work: "Remove pine leaning on garage", crew: "marcus", time: "8:00 AM", day: "Mon", price: 2900, status: "booked", photos: 4, notes: "Needs crane? David says no, rig and lower.", phone: "(540) 555-0102" },
  { id: "j6", customer: "Oak Grove HOA", street: "Electric Rd", work: "Trim entrance trees", crew: "jesse", time: "9:00 AM", day: "Mon", price: 1750, status: "booked", photos: 1, notes: "Cones out by 8:45. HOA wants it done before noon.", phone: "(540) 555-0133" },
  { id: "j7", customer: "Rita Gomez", street: "Memorial Ave", work: "Take down cherry, grind stump", crew: "marcus", time: "8:00 AM", day: "Tue", price: 1600, status: "booked", photos: 2, notes: "", phone: "(540) 555-0177" },
  { id: "j8", customer: "Valley Feed Co.", street: "Orange Ave", work: "Clear fence line, 300 ft", crew: "jesse", time: "8:00 AM", day: "Wed", price: 4200, status: "booked", photos: 5, notes: "Two day job. Chips go to our yard.", phone: "(540) 555-0150" },
];

// Two finished jobs from last week, so the folders show the whole chain to "paid".
jobs.push(
  { id: "j9", customer: "Pat Moran", street: "Starkey Rd", work: "Grind 2 stumps, rake out", crew: "marcus", time: "10:00 AM", day: "Last week", price: 480, status: "done", photos: 5, notes: "", phone: "(540) 555-0124" },
  { id: "j10", customer: "Cave Spring Baptist", street: "Chaparral Dr", work: "Raise canopy over parking lot", crew: "jesse", time: "8:00 AM", day: "Last week", price: 2600, status: "done", photos: 8, notes: "", phone: "(540) 555-0193" },
);

// ---------- Job folders ----------
// Every job gets one folder. The estimate, crew photos, invoice and payment all land in it.
export type Stage = "before" | "during" | "after";
export const stageText: Record<Stage, string> = { before: "Before", during: "During", after: "After" };
export type InvoiceState = "none" | "draft" | "sent" | "paid";
export type Folder = {
  jobId: string;
  estimate: { no: string; date: string; signed: string | null };
  shots: Record<Stage, number>;
  invoice: { no: string | null; state: InvoiceState; date?: string };
};
const f = (jobId: string, est: string, date: string, signed: string | null, b: number, d: number, a: number, inv: Folder["invoice"] = { no: null, state: "none" }): Folder =>
  ({ jobId, estimate: { no: est, date, signed }, shots: { before: b, during: d, after: a }, invoice: inv });
export const folders: Folder[] = [
  f("j1", "E-2214", "Nov 12", "Nov 13", 3, 3, 0),
  f("j2", "E-2209", "Nov 10", "Nov 11", 2, 0, 0),
  f("j3", "E-2219", "Nov 16", "Nov 17", 0, 0, 0),
  f("j4", "E-2221", "Nov 18", "Nov 18", 3, 0, 0),
  f("j5", "E-2224", "Nov 19", "Nov 19", 4, 0, 0),
  f("j6", "E-2201", "Nov 6", "Nov 9", 1, 0, 0),
  f("j7", "E-2226", "Nov 19", null, 2, 0, 0),
  f("j8", "E-2218", "Nov 14", "Nov 16", 5, 0, 0),
  f("j9", "E-2190", "Nov 2", "Nov 3", 2, 1, 2, { no: "1045", state: "paid", date: "Nov 18" }),
  f("j10", "E-2196", "Nov 4", "Nov 5", 3, 2, 3, { no: "1046", state: "sent", date: "Nov 19" }),
];
export const folderPath = (j: Job) => `MIB Drive / Tree Service / Jobs / ${j.customer} - ${j.street}`;

// ---------- QuickBooks (sample connection) ----------
export const quickbooks = {
  company: "MIB (sample company)",
  lastSync: "9:12 AM",
  toQB: [
    { what: "New customers", note: "Name, address and phone. Typed once, never again." },
    { what: "Signed estimates", note: "Show up in QuickBooks as estimates." },
    { what: "Finished jobs", note: "Become invoices. Kat checks each one before it sends." },
    { what: "Yard accounts", note: "One bill per company at the end of the month." },
    { what: "Store and splitter sales", note: "One daily total, by item." },
  ],
  fromQB: [
    { what: "Paid or not", note: "Each job folder shows when its invoice is paid." },
    { what: "Who owes money", note: "Shows on the weekly numbers." },
  ],
  recent: [
    { time: "9:12 AM", text: "Invoice 1046 for Cave Spring Baptist is sent" },
    { time: "8:40 AM", text: "Pat Moran paid $480. Matched to invoice 1045" },
    { time: "Yesterday", text: "New customer Valley Feed Co. added" },
  ],
};

// ---------- Other tree services on Home Base (sample) ----------
// Thomas could let other tree services use the tree side of the app under their own name.
export type Tenant = { id: string; name: string; short: string; color: string; town: string; crews: number; people: number; jobs: number; since: string; status: "you" | "live" | "trial"; fee: number };
export const tenants: Tenant[] = [
  { id: "mib", name: "MIB Tree Service", short: "MIB", color: "#ec9220", town: "Roanoke", crews: 2, people: 7, jobs: 41, since: "Day one", status: "you", fee: 0 },
  { id: "hc", name: "Hollow Creek Tree", short: "HC", color: "#2f6690", town: "Salem", crews: 3, people: 9, jobs: 52, since: "Sep", status: "live", fee: 199 },
  { id: "ch", name: "Copper Hill Arbor", short: "CH", color: "#3c7a3a", town: "Floyd", crews: 1, people: 3, jobs: 18, since: "Oct", status: "live", fee: 199 },
  { id: "fr", name: "Fox Run Tree Care", short: "FR", color: "#8a3b8f", town: "Bedford", crews: 2, people: 5, jobs: 4, since: "Nov 16", status: "trial", fee: 0 },
];

export type Quote = { id: string; customer: string; work: string; price: number; sent: string; age: number; by: string; hot?: boolean };
export const quotes: Quote[] = [
  { id: "q1", customer: "Greg Hollins", work: "Remove 3 poplars near house", price: 5400, sent: "Tue", age: 3, by: "david", hot: true },
  { id: "q2", customer: "Fairview Elementary PTA", work: "Trim playground oaks", price: 1900, sent: "Mon", age: 4, by: "david" },
  { id: "q3", customer: "Dana Pruitt", work: "Stump grind, 2 stumps", price: 300, sent: "Last Fri", age: 7, by: "david" },
  { id: "q4", customer: "Riverside Storage", work: "Clear back lot", price: 3100, sent: "Wed", age: 2, by: "david" },
];

// ---------- Facebook inbox (log splitters) ----------
export type MsgState = "drafted" | "needs" | "sent";
export type Thread = {
  id: string;
  from: string;
  when: string;
  ask: string;
  topic: string;
  draft: string;
  state: MsgState;
  why?: string;
};

export const threads: Thread[] = [
  { id: "m1", from: "Carl Dempsey", when: "6:12 AM", topic: "Price", ask: "Is the log splitter still $4,600? Saw it on marketplace.", draft: "Hey Carl, yes it is $4,600. We have them in stock right now at our shop on Patterson Ave. Want me to hold one for you?", state: "drafted" },
  { id: "m2", from: "Brenda Sykes", when: "6:40 AM", topic: "See it run", ask: "can i come see one run before i buy", draft: "Hi Brenda, sure thing. Come by the shop Monday to Saturday, 8 to 4, and we will fire one up for you. What day works?", state: "drafted" },
  { id: "m3", from: "Josh Keener", when: "7:05 AM", topic: "Delivery", ask: "Do you deliver to Salem? How much", draft: "Hey Josh, yes we deliver around the valley. Salem is $75. We can usually bring it out in 2 or 3 days. Want to set it up?", state: "drafted" },
  { id: "m4", from: "Wayne Hurt", when: "7:22 AM", topic: "Payment plan", ask: "Any way to make payments on one? Can do $500 down", draft: "Hi Wayne, thanks for asking. Let me check with Thomas on that and get right back to you today.", state: "needs", why: "Payment plans are your call. Home Base does not promise these." },
  { id: "m5", from: "Amy Lowe", when: "7:48 AM", topic: "Trade in", ask: "I have an old 22 ton splitter. would you take it in trade", draft: "Hi Amy, good question. Let me ask Thomas and get back to you today. Can you send a photo of it?", state: "needs", why: "Trade-ins need your price. Home Base asked for a photo so you can judge it." },
  { id: "m6", from: "Ronnie Bishop", when: "Yesterday", topic: "In stock", ask: "you got any left?", draft: "Hey Ronnie, yes we do. Come grab one any time Monday to Saturday, 8 to 4.", state: "sent" },
  { id: "m7", from: "Paula Greer", when: "Yesterday", topic: "Price", ask: "How much is the splitter", draft: "Hi Paula, it is $4,600 and we have them in stock at our shop on Patterson Ave.", state: "sent" },
];

export type Answer = { id: string; topic: string; rule: string; mode: "auto" | "draft" | "ask" };
export const answerSheet: Answer[] = [
  { id: "a1", topic: "Price", rule: "Splitter is $4,600. Say we have them in stock and offer to hold one.", mode: "auto" },
  { id: "a2", topic: "In stock", rule: "Yes, in stock. Shop is open Monday to Saturday, 8 to 4.", mode: "auto" },
  { id: "a3", topic: "See it run", rule: "Invite them to the shop. Offer to run one for them.", mode: "auto" },
  { id: "a4", topic: "Delivery", rule: "We deliver in the valley. Salem $75, Vinton $75, farther ask Thomas.", mode: "draft" },
  { id: "a5", topic: "Payment plan", rule: "Never promise. Say Thomas will reply today.", mode: "ask" },
  { id: "a6", topic: "Trade in", rule: "Never promise. Ask for a photo. Thomas sets the price.", mode: "ask" },
  { id: "a7", topic: "Dealer or bulk", rule: "Get their name and number. Send to Thomas the same hour.", mode: "ask" },
];

// ---------- Buyer visits and alerts ----------
export type Visit = { id: string; who: string; day: string; time: string; said: string; want: string; held: boolean; remind: string; state: "coming" | "sold" | "noshow" };
export const visits: Visit[] = [
  { id: "v1", who: "Dale Price", day: "Today", time: "2:30 PM", said: "Ill swing by around 2:30 today with my truck and grab one", want: "Buying 1 splitter. Bringing his own truck.", held: true, remind: "1:30 PM", state: "coming" },
  { id: "v2", who: "Carl Dempsey", day: "Sat", time: "10:00 AM", said: "Yes hold one for me. I can be there Saturday at 10", want: "Picking up 1 splitter. Wants to see it run first.", held: true, remind: "9:00 AM Sat", state: "coming" },
];
export type AlertRule = { id: string; when: string; does: string; buzz: boolean };
export const alertRules: AlertRule[] = [
  { id: "r1", when: "A buyer gives a day and time to come by", does: "Buzz Thomas right away. Hold one splitter. Remind Thomas and Kat 1 hour before.", buzz: true },
  { id: "r2", when: "A buyer says they are on the way or running late", does: "Buzz Thomas right away.", buzz: true },
  { id: "r3", when: "A dealer or a bulk order asks", does: "Buzz Thomas right away with their name and number.", buzz: true },
  { id: "r4", when: "Price, stock, hours or see it run", does: "Answered for Thomas from the answer sheet. No buzz.", buzz: false },
  { id: "r5", when: "Payment plan, trade in or delivery", does: "Polite holding reply goes out. Shows on Today. One roundup at noon and 4 PM.", buzz: false },
  { id: "r6", when: "A held buyer goes quiet for 2 days", does: "Hold comes off. Thomas sees it in the roundup.", buzz: false },
];

// ---------- Grinding yard ----------
export type Load = { id: string; time: string; who: string; size: "Pickup" | "Dump truck" | "Tractor trailer"; price: number; paid: "On account" | "Cash" | "Card"; photo: boolean };
export const loadPrices: Record<Load["size"], number> = { Pickup: 15, "Dump truck": 20, "Tractor trailer": 25 };
export const yardCompanies = ["Blue Ridge Limb Co.", "Star City Tree", "Hollow Creek Tree", "Roanoke Lawn Pros", "Walk-in (cash)", "MIB crews"];
export const loads: Load[] = [
  { id: "l1", time: "5:48 AM", who: "Blue Ridge Limb Co.", size: "Dump truck", price: 20, paid: "On account", photo: true },
  { id: "l2", time: "6:15 AM", who: "Star City Tree", size: "Tractor trailer", price: 25, paid: "On account", photo: true },
  { id: "l3", time: "6:52 AM", who: "Hollow Creek Tree", size: "Dump truck", price: 20, paid: "On account", photo: true },
  { id: "l4", time: "7:30 AM", who: "Walk-in (cash)", size: "Pickup", price: 15, paid: "Cash", photo: true },
  { id: "l5", time: "8:04 AM", who: "Star City Tree", size: "Dump truck", price: 20, paid: "On account", photo: true },
];
export const yardAccounts = [
  { who: "Star City Tree", loads: 22, owed: 510, last: "Today" },
  { who: "Blue Ridge Limb Co.", loads: 18, owed: 390, last: "Today" },
  { who: "Hollow Creek Tree", loads: 11, owed: 240, last: "Today" },
  { who: "Roanoke Lawn Pros", loads: 6, owed: 105, last: "Mon" },
];

// ---------- Store ----------
export type Stock = { id: string; item: string; onHand: number; low: number; price: number; biz: Biz };
export const stock: Stock[] = [
  { id: "s1", item: "Log splitter, MIB engraved", onHand: 38, low: 10, price: 4600, biz: "splitters" },
  { id: "s2", item: "Wheelbarrow", onHand: 486, low: 50, price: 129, biz: "store" },
  { id: "s3", item: "Asphalt shovel", onHand: 64, low: 40, price: 42, biz: "store" },
  { id: "s4", item: "Contractor rake", onHand: 120, low: 40, price: 34, biz: "store" },
  { id: "s5", item: "Heavy tarp, 20 x 30", onHand: 22, low: 30, price: 58, biz: "store" },
  { id: "s6", item: "Chainsaw chain, 20 in", onHand: 15, low: 25, price: 31, biz: "store" },
  { id: "s7", item: "Felling wedges, 3 pack", onHand: 90, low: 30, price: 24, biz: "store" },
  { id: "s8", item: "Work gloves, 12 pack", onHand: 140, low: 40, price: 36, biz: "store" },
];
export const dealers = [
  { name: "Valley Outdoor Supply", city: "Salem", status: "Selling", sold: 6, last: "Nov 14" },
  { name: "Ridge Farm and Home", city: "Bedford", status: "Sample sent", sold: 0, last: "Nov 18" },
  { name: "Mountain Power Equipment", city: "Christiansburg", status: "First call", sold: 0, last: "Nov 19" },
];
export const openingChecklist = [
  { id: "o1", text: "Shelves up in the front bay", done: true },
  { id: "o2", text: "Price tags on every item", done: true },
  { id: "o3", text: "Card reader set up", done: false },
  { id: "o4", text: "Coupon mailer goes out", done: false },
  { id: "o5", text: "Opening day sign out front", done: false },
];

// ---------- Weekly numbers ----------
export type Num = { id: string; biz: Biz; name: string; who: string; goal: number; better: "up" | "down"; fmt: "money" | "count" | "pct" | "min"; weeks: number[]; source: string };
export const numbers: Num[] = [
  { id: "n1", biz: "tree", name: "Tree jobs done", who: "marcus", goal: 14, better: "up", fmt: "count", weeks: [11, 13, 12, 15, 14, 12], source: "Job board" },
  { id: "n2", biz: "tree", name: "Quotes sent", who: "david", goal: 20, better: "up", fmt: "count", weeks: [18, 22, 17, 21, 19, 23], source: "Job board" },
  { id: "n3", biz: "tree", name: "Quotes won", who: "david", goal: 45, better: "up", fmt: "pct", weeks: [38, 41, 44, 40, 47, 46], source: "Job board" },
  { id: "n4", biz: "yard", name: "Yard loads in", who: "thomas", goal: 18, better: "up", fmt: "count", weeks: [17, 21, 19, 16, 20, 22], source: "Yard log" },
  { id: "n5", biz: "splitters", name: "Splitters sold", who: "thomas", goal: 4, better: "up", fmt: "count", weeks: [1, 2, 1, 3, 2, 4], source: "Store sales" },
  { id: "n6", biz: "splitters", name: "Minutes to answer a message", who: "home", goal: 15, better: "down", fmt: "min", weeks: [240, 180, 200, 35, 12, 9], source: "Facebook" },
  { id: "n7", biz: "store", name: "Store and dealer sales", who: "kat", goal: 6000, better: "up", fmt: "money", weeks: [3100, 4200, 3800, 5200, 4900, 6400], source: "Store sales" },
  { id: "n8", biz: "tree", name: "Calls Thomas had to take", who: "thomas", goal: 20, better: "down", fmt: "count", weeks: [140, 120, 95, 60, 41, 28], source: "Phone" },
];

// ---------- 90-day goals ----------
export type Status = "on" | "off" | "done";
export type Goal = { id: string; biz: Biz; title: string; who: string; status: Status; numberId: string; todos: string[]; folder: string };
export const goals: Goal[] = [
  { id: "g1", biz: "store", title: "Open the store by Dec 1", who: "kat", status: "on", numberId: "n7", todos: ["Card reader set up", "Coupon mailer goes out"], folder: "Store / Opening" },
  { id: "g2", biz: "splitters", title: "Answer every splitter message in 15 minutes", who: "home", status: "done", numberId: "n6", todos: ["Thomas checks the answer sheet each Monday"], folder: "Splitters / Answer sheet" },
  { id: "g3", biz: "splitters", title: "Sell 40 splitters this season", who: "thomas", status: "on", numberId: "n5", todos: ["Call back the dealer in Bedford", "Post the splitter video on Facebook"], folder: "Splitters / Sales" },
  { id: "g4", biz: "tree", title: "Crew leads run the day without calling Thomas", who: "marcus", status: "off", numberId: "n8", todos: ["Write the storm job checklist", "Give Jesse the job board login"], folder: "Tree Service / Crew" },
  { id: "g5", biz: "yard", title: "Every yard load logged with a photo", who: "thomas", status: "on", numberId: "n4", todos: ["Put the sign with the QR code at the gate"], folder: "Yard / Load log" },
];

export const bigAim = {
  title: "Where we are going",
  line: "MIB runs without Thomas on every call. The crews run the jobs, the yard runs itself, and the store sells all year.",
  points: ["Thomas works on the business, not in it", "Every message answered fast", "Every load and job written down in one place"],
};

// ---------- Problems to fix ----------
export type Problem = { id: string; biz: Biz; title: string; by: string; age: string; solved?: boolean; fix?: string };
export const problems: Problem[] = [
  { id: "p1", biz: "tree", title: "Crew 2 keeps calling Thomas for gate codes", by: "jesse", age: "2 wk" },
  { id: "p2", biz: "yard", title: "Two yard companies are 30 days behind on their tab", by: "kat", age: "1 wk" },
  { id: "p3", biz: "splitters", title: "Delivery price is different every time", by: "thomas", age: "3 days" },
  { id: "p4", biz: "store", title: "Tarps and chain are running low before opening", by: "kat", age: "1 day" },
];

// ---------- Files and connections ----------
export type FileRef = { label: string; path: string; kind: "folder" | "doc" | "sheet" | "pdf" | "photos"; updated: string };
export const files: { group: string; biz: Biz; items: FileRef[] }[] = [
  { group: "Tree Service", biz: "tree", items: [
    { label: "Job folders", path: "MIB Drive / Tree Service / Jobs", kind: "folder", updated: "Today" },
    { label: "Job photos", path: "Inside each job folder", kind: "photos", updated: "Today" },
    { label: "Quote sheet", path: "MIB Drive / Tree Service / Quotes", kind: "sheet", updated: "Yesterday" },
    { label: "Storm job checklist", path: "MIB Drive / Tree Service / Crew", kind: "doc", updated: "Nov 12" },
  ] },
  { group: "Grinding yard", biz: "yard", items: [
    { label: "Yard load log", path: "MIB Drive / Yard / Load log", kind: "sheet", updated: "Today" },
    { label: "Yard rules for drivers", path: "MIB Drive / Yard", kind: "pdf", updated: "Oct 2" },
  ] },
  { group: "Store and splitters", biz: "store", items: [
    { label: "Winter catalog", path: "MIB Drive / Store / Catalog", kind: "pdf", updated: "Sep 15" },
    { label: "Splitter answer sheet", path: "MIB Drive / Splitters / Answer sheet", kind: "doc", updated: "Nov 18" },
    { label: "Stock count", path: "MIB Drive / Store / Stock", kind: "sheet", updated: "Nov 19" },
  ] },
  { group: "Office", biz: "store", items: [
    { label: "Office folder (Kat)", path: "MIB Drive / Office", kind: "folder", updated: "Nov 17" },
  ] },
];

export const feeds = [
  { name: "Facebook messages", what: "Reads splitter questions. Drafts the reply.", state: "Sample" },
  { name: "Job board and crew app", what: "Jobs, crews, quotes and photos. Lives in Home Base.", state: "Sample" },
  { name: "Phone and texts", what: "Logs missed calls and texts so none get lost.", state: "Planned" },
  { name: "QuickBooks", what: "Customers, estimates and invoices go over. Paid status comes back.", state: "Sample" },
  { name: "Google Drive", what: "Every job gets its own folder in the company Drive.", state: "Sample" },
  { name: "Store sales", what: "Counts what sold today, in the store and online.", state: "Planned" },
];
