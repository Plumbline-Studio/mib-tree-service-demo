// Sample data for the six Home Base setups (/setups).
// Every customer, crew name, number and message here is made up to show how each setup works.

export const day = "Monday, Nov 30";

export type Unit = "tree" | "slabs" | "store" | "yard" | "ship" | "office";

export const units: Record<Unit, { label: string; short: string; color: string; icon: string }> = {
  tree: { label: "Tree Service", short: "Tree", color: "#3c7a3a", icon: "🌳" },
  slabs: { label: "Slabs & Mill", short: "Slabs", color: "#7a5436", icon: "🪵" },
  store: { label: "Store & Splitters", short: "Store", color: "#2f6690", icon: "🛒" },
  yard: { label: "Grinding Yard", short: "Yard", color: "#8a6d1f", icon: "🚛" },
  ship: { label: "Shipping & Online", short: "Shipping", color: "#7b3f8c", icon: "📦" },
  office: { label: "Office", short: "Office", color: "#555555", icon: "🗂️" },
};

export const unitOrder: Unit[] = ["tree", "slabs", "store", "yard", "ship", "office"];

// ---------- The six setups ----------
export type Setup = {
  slug: string;
  n: number;
  name: string;
  line: string;
  suits: string;
  good: string[];
  watch: string[];
  build: string;
};

export const setups: Setup[] = [
  {
    slug: "hub",
    n: 1,
    name: "One hub, a room for each business",
    line: "One app with a side menu. Each business is its own room. People only see the rooms they need.",
    suits: "An owner who wants it all in one place, and a team where each person works in one or two parts.",
    good: ["Easy to add a new room later, like the mill.", "Kat sees the office rooms, a crew lead sees the tree rooms.", "Same login for everyone."],
    watch: ["Thomas still has to click into each room to see it.", "The menu gets long if every idea becomes a room."],
    build: "One Django project. Each business is its own Django app. One database, one login with roles.",
  },
  {
    slug: "wall",
    n: 2,
    name: "The big screen",
    line: "A TV on the wall shows the whole month and today's numbers. Nobody has to tap anything.",
    suits: "An owner who thinks in pictures and wants to see the month at a glance from across the room.",
    good: ["Thomas sees everything without opening an app.", "Good for a Monday huddle with Kat and the crews.", "Shows trouble in red right away."],
    watch: ["It only shows. The work still happens in the other screens.", "Needs a TV and a small computer at the shop."],
    build: "One extra page in the same Django app, set to refresh itself. A cheap stick computer runs it on the TV.",
  },
  {
    slug: "roles",
    n: 3,
    name: "A front door for each person",
    line: "Same app, but each person gets their own simple start screen with only their buttons.",
    suits: "A business where crews, the yard, the counter and customers each do one thing over and over.",
    good: ["Crews get one big camera button and a Done button.", "Customers see their own job photos and bill.", "Very little to learn for each person."],
    watch: ["Six screens to design and test.", "Thomas has to decide who sees what."],
    build: "One Django project. Each role gets its own start page. Logins send each person to their own door.",
  },
  {
    slug: "flow",
    n: 4,
    name: "Everything is a ticket",
    line: "Every tree job, slab order, splitter sale, yard load and shipment is a card that moves left to right.",
    suits: "An owner who loses track of what is stuck. One board shows what is new, what is booked and who still owes.",
    good: ["One board for every business.", "A customer who buys from three businesses shows up once.", "Easy to see what is stuck and who has not paid."],
    watch: ["A busy day makes a busy board.", "Each business needs its steps agreed up front."],
    build: "One shared Ticket table in Django with a type for each business. Same steps from New to Paid.",
  },
  {
    slug: "stock",
    n: 5,
    name: "Stock and money first",
    line: "Starts from what is on the shelf and in the yard: what it cost, what it sells for and how long it has sat.",
    suits: "When the store, splitters, slabs and online sales are where the next money comes from.",
    good: ["Shows the true cost with shipping and tariffs.", "Shows money sitting still on the shelf.", "Ties straight into QuickBooks and online orders."],
    watch: ["Less help for running tree crews day to day.", "Only as good as the stock counts."],
    build: "A Django products app with a landed cost tool, linked to QuickBooks and the online store.",
  },
  {
    slug: "inbox",
    n: 6,
    name: "Just talk to it",
    line: "One inbox for Facebook, texts, calls and what the Pocket heard. Most of it gets handled. Thomas only sees what needs him.",
    suits: "An owner buried in messages who would rather talk than type.",
    good: ["Easy questions get answered without Thomas.", "A thought he says out loud becomes a task.", "Fewest screens of all six."],
    watch: ["Needs care so the auto answers stay right.", "Facebook only works through a business page."],
    build: "A Django inbox app that pulls in each channel, sorts each message to a business and writes a draft.",
  },
];

// ---------- People ----------
export type Role = "owner" | "office" | "crew" | "yard" | "counter" | "customer";
export const roles: Record<Role, { who: string; title: string; sees: Unit[] }> = {
  owner: { who: "Thomas", title: "Owner", sees: ["tree", "slabs", "store", "yard", "ship", "office"] },
  office: { who: "Kat", title: "Office manager", sees: ["tree", "store", "ship", "office"] },
  crew: { who: "Marcus R.", title: "Crew lead", sees: ["tree"] },
  yard: { who: "Yard gate", title: "Yard tablet", sees: ["yard"] },
  counter: { who: "Store counter", title: "Counter tablet", sees: ["store"] },
  customer: { who: "Linda Parks", title: "Customer", sees: [] },
};

// ---------- Today across the businesses ----------
export const todayNumbers: { unit: Unit; big: string; small: string; tone?: "good" | "bad" }[] = [
  { unit: "tree", big: "6 jobs", small: "$11,950 booked today" },
  { unit: "slabs", big: "3 orders", small: "2 walnut, 1 cherry" },
  { unit: "store", big: "$1,840", small: "sold since 8 AM, 1 splitter" },
  { unit: "yard", big: "14 loads", small: "$290 in, 2 accounts owe", tone: "bad" },
  { unit: "ship", big: "5 to ship", small: "2 go out by 3 PM" },
  { unit: "office", big: "4 bills", small: "QuickBooks synced 9:02 AM", tone: "good" },
];

export const needsThomas = [
  { unit: "store" as Unit, text: "Carl Dempsey wants a splitter on a payment plan. Yes or no?" },
  { unit: "tree" as Unit, text: "Approve David's $6,400 quote for Valley Feed Co. fence line." },
  { unit: "slabs" as Unit, text: "A buyer wants the 9 ft walnut slab for $1,100. You asked $1,350." },
];

// ---------- Room lists for the hub ----------
export type Row = { a: string; b: string; c: string; tag?: string; tone?: "good" | "bad" | "warn" };

export const rooms: Record<string, { unit: Unit; title: string; cols: [string, string, string]; rows: Row[] }> = {
  "tree-jobs": {
    unit: "tree", title: "Jobs today", cols: ["Customer", "Work", "Crew"],
    rows: [
      { a: "Linda Parks, Grandin Rd", b: "Take down 2 dead oaks", c: "Crew 1", tag: "On site", tone: "good" },
      { a: "Hillcrest Church, Peters Creek", b: "Trim 6 maples off roof", c: "Crew 2", tag: "On the way", tone: "warn" },
      { a: "Mark Ellison, Brambleton Ave", b: "Grind 4 stumps", c: "Crew 1", tag: "1:30 PM" },
      { a: "Star City Apartments", b: "Storm cleanup", c: "Crew 2", tag: "2:00 PM" },
      { a: "Rita Gomez, Memorial Ave", b: "Take down cherry", c: "Crew 1", tag: "3:30 PM" },
      { a: "Oak Grove HOA", b: "Trim entrance trees", c: "Crew 2", tag: "4:00 PM" },
    ],
  },
  "tree-quotes": {
    unit: "tree", title: "Quotes waiting", cols: ["Customer", "Work", "Price"],
    rows: [
      { a: "Valley Feed Co.", b: "Clear 300 ft fence line", c: "$6,400", tag: "Needs Thomas", tone: "bad" },
      { a: "Tom Whitlow", b: "Pine on garage", c: "$2,900", tag: "Sent Fri" },
      { a: "Greenvale School", b: "Raise canopy, 12 trees", c: "$3,150", tag: "Sent Thu" },
    ],
  },
  "tree-folders": {
    unit: "tree", title: "Job folders", cols: ["Job", "In the folder", "Bill"],
    rows: [
      { a: "Linda Parks", b: "Quote, 6 photos", c: "Not yet" },
      { a: "Pat Moran", b: "Quote, 5 photos, bill", c: "$480", tag: "Paid", tone: "good" },
      { a: "Cave Spring Baptist", b: "Quote, 8 photos, bill", c: "$2,600", tag: "Sent", tone: "warn" },
    ],
  },
  "slab-stock": {
    unit: "slabs", title: "Slab stock", cols: ["Slab", "Size", "Price"],
    rows: [
      { a: "Walnut #W-14", b: "9 ft x 26 in x 2.5 in", c: "$1,350", tag: "Offer in", tone: "warn" },
      { a: "Walnut #W-15", b: "8 ft x 22 in x 2 in", c: "$980" },
      { a: "Cherry #C-03", b: "7 ft x 18 in x 2 in", c: "$520", tag: "Sold", tone: "good" },
      { a: "White oak #O-09", b: "10 ft x 30 in x 3 in", c: "$1,600", tag: "Drying" },
    ],
  },
  "slab-logs": {
    unit: "slabs", title: "Logs waiting to mill", cols: ["Log", "From job", "Worth"],
    rows: [
      { a: "Walnut, 32 in", b: "Linda Parks job", c: "about $4,000" },
      { a: "Red oak, 28 in", b: "Valley Feed Co.", c: "about $900" },
      { a: "Cherry, 20 in", b: "Rita Gomez job", c: "about $700" },
    ],
  },
  "store-sales": {
    unit: "store", title: "Sold today", cols: ["Item", "Who", "Total"],
    rows: [
      { a: "MIB log splitter 37 ton", b: "Dale Price (Facebook)", c: "$4,600", tag: "Picked up", tone: "good" },
      { a: "Asphalt shovels x6", b: "Blue Ridge Paving", c: "$228" },
      { a: "Chainsaw chain x4", b: "Walk-in", c: "$96" },
      { a: "Climbing rope, 150 ft", b: "Star City Tree", c: "$310" },
    ],
  },
  "store-stock": {
    unit: "store", title: "Stock", cols: ["Item", "On hand", "Status"],
    rows: [
      { a: "Log splitter 37 ton", b: "41", c: "Plenty" },
      { a: "Wheelbarrows", b: "488", c: "Too many", tone: "warn", tag: "Slow" },
      { a: "Work gloves (L)", b: "12", c: "Order soon", tone: "bad", tag: "Low" },
      { a: "Tarps 20x30", b: "64", c: "Plenty" },
    ],
  },
  "yard-loads": {
    unit: "yard", title: "Load book", cols: ["Truck", "Load", "Price"],
    rows: [
      { a: "Blue Ridge Limb Co.", b: "Tractor trailer", c: "$25", tag: "Account" },
      { a: "Star City Tree", b: "Dump truck", c: "$20", tag: "Account" },
      { a: "Walk-in", b: "Pickup", c: "$15", tag: "Paid", tone: "good" },
      { a: "MIB Crew 1", b: "Dump truck", c: "$0", tag: "Ours" },
    ],
  },
  "yard-owe": {
    unit: "yard", title: "Who owes", cols: ["Company", "Loads", "Owes"],
    rows: [
      { a: "Hollow Creek Tree", b: "22 this month", c: "$480", tag: "45 days", tone: "bad" },
      { a: "Blue Ridge Limb Co.", b: "31 this month", c: "$690", tag: "Due Fri", tone: "warn" },
    ],
  },
  "ship-orders": {
    unit: "ship", title: "Orders to ship", cols: ["Order", "Going to", "Ship by"],
    rows: [
      { a: "#1042 Splitter wedge x2", b: "Asheville, NC", c: "Today 3 PM", tag: "Label made", tone: "good" },
      { a: "#1043 Walnut slab W-15", b: "Richmond, VA", c: "Today 3 PM", tag: "Needs crate", tone: "warn" },
      { a: "#1044 Climbing rope", b: "Knoxville, TN", c: "Tue" },
      { a: "#1045 Gloves x12", b: "Lynchburg, VA", c: "Tue" },
      { a: "#1046 Log splitter", b: "Freight to Charlotte, NC", c: "Wed", tag: "Freight quote" },
    ],
  },
  "ship-online": {
    unit: "ship", title: "Online store", cols: ["Page", "Visits this week", "Sales"],
    rows: [
      { a: "Log splitters", b: "1,210", c: "3" },
      { a: "Walnut slabs", b: "640", c: "2" },
      { a: "Climbing gear", b: "380", c: "4" },
    ],
  },
  "office-bills": {
    unit: "office", title: "Bills and QuickBooks", cols: ["What", "Amount", "Status"],
    rows: [
      { a: "Invoice 1047, Linda Parks", b: "$3,800", c: "Draft", tag: "Kat", tone: "warn" },
      { a: "Invoice 1046, Cave Spring Baptist", b: "$2,600", c: "Sent", tag: "In QuickBooks", tone: "good" },
      { a: "Fuel bill, Valley Oil", b: "$1,140", c: "To pay Fri" },
      { a: "Container 5 freight", b: "$6,800", c: "To pay Dec 10" },
    ],
  },
  "office-files": {
    unit: "office", title: "Files", cols: ["Folder", "What is in it", "Last added"],
    rows: [
      { a: "Tree Service / Jobs", b: "One folder per job", c: "Today" },
      { a: "Store / Containers", b: "Packing lists, tariffs", c: "Nov 24" },
      { a: "Yard / Load book", b: "Photos of each load", c: "Today" },
      { a: "Company / Permits", b: "Store remodel, city", c: "Nov 20" },
    ],
  },
};

export const hubMenu: { unit: Unit; items: [string, string][] }[] = [
  { unit: "tree", items: [["tree-jobs", "Jobs today"], ["tree-quotes", "Quotes"], ["tree-folders", "Job folders"]] },
  { unit: "slabs", items: [["slab-stock", "Slab stock"], ["slab-logs", "Logs to mill"]] },
  { unit: "store", items: [["store-sales", "Sold today"], ["store-stock", "Stock"]] },
  { unit: "yard", items: [["yard-loads", "Load book"], ["yard-owe", "Who owes"]] },
  { unit: "ship", items: [["ship-orders", "Orders to ship"], ["ship-online", "Online store"]] },
  { unit: "office", items: [["office-bills", "Bills & QuickBooks"], ["office-files", "Files"]] },
];

// ---------- Month for the big screen (December 2026 starts on a Tuesday) ----------
export const monthName = "December 2026";
export const monthStartWeekday = 2; // 0 = Sunday
export const monthDays = 31;
export const monthEvents: Record<number, { unit: Unit; t: string }[]> = {
  1: [{ unit: "store", t: "Store opens" }, { unit: "office", t: "Valpak mails" }],
  2: [{ unit: "tree", t: "Valley Feed, day 1" }],
  3: [{ unit: "tree", t: "Valley Feed, day 2" }, { unit: "ship", t: "Freight to Charlotte" }],
  5: [{ unit: "store", t: "Splitter demo day" }],
  8: [{ unit: "slabs", t: "Mill walnut logs" }],
  10: [{ unit: "office", t: "Container 5 freight due" }],
  12: [{ unit: "store", t: "Container 5 lands" }],
  15: [{ unit: "office", t: "Payroll taxes call" }, { unit: "tree", t: "Greenvale School" }],
  17: [{ unit: "yard", t: "Grinder service" }],
  19: [{ unit: "store", t: "Holiday sale" }],
  22: [{ unit: "ship", t: "Last ship day before Christmas" }],
  29: [{ unit: "slabs", t: "Slab drying check" }],
  31: [{ unit: "office", t: "Year end count" }],
};

// ---------- Tickets for the flow board ----------
export const stages = ["New", "Booked", "Doing", "Done", "Paid"] as const;
export type Stage = (typeof stages)[number];
export type Ticket = { id: string; unit: Unit; title: string; who: string; money: string; stage: Stage; note?: string };

export const tickets: Ticket[] = [
  { id: "t1", unit: "tree", title: "Clear fence line, 300 ft", who: "Valley Feed Co.", money: "$6,400", stage: "New", note: "Quote needs Thomas" },
  { id: "t2", unit: "store", title: "Splitter on payment plan", who: "Carl Dempsey", money: "$4,600", stage: "New", note: "Needs Thomas" },
  { id: "t3", unit: "slabs", title: "Walnut slab W-14", who: "Ann Russo", money: "$1,100 offer", stage: "New" },
  { id: "t4", unit: "tree", title: "Pine on garage", who: "Tom Whitlow", money: "$2,900", stage: "Booked", note: "Tue 8 AM, Crew 1" },
  { id: "t5", unit: "ship", title: "Order #1043, walnut slab", who: "Richmond, VA", money: "$980", stage: "Booked", note: "Needs crate" },
  { id: "t6", unit: "yard", title: "Mulch, 10 yards", who: "Valley Feed Co.", money: "$350", stage: "Booked", note: "Deliver Thu" },
  { id: "t7", unit: "tree", title: "Take down 2 dead oaks", who: "Linda Parks", money: "$3,800", stage: "Doing", note: "Crew 1 on site" },
  { id: "t8", unit: "slabs", title: "Mill walnut log", who: "From Linda Parks job", money: "about $4,000", stage: "Doing" },
  { id: "t9", unit: "ship", title: "Order #1042, wedges", who: "Asheville, NC", money: "$118", stage: "Doing", note: "Label made" },
  { id: "t10", unit: "tree", title: "Raise canopy", who: "Cave Spring Baptist", money: "$2,600", stage: "Done", note: "Bill sent 6 days ago" },
  { id: "t11", unit: "yard", title: "November dumps", who: "Hollow Creek Tree", money: "$480", stage: "Done", note: "45 days late" },
  { id: "t12", unit: "store", title: "Log splitter 37 ton", who: "Dale Price", money: "$4,600", stage: "Paid" },
  { id: "t13", unit: "tree", title: "Grind 2 stumps", who: "Pat Moran", money: "$480", stage: "Paid" },
  { id: "t14", unit: "slabs", title: "Cherry slab C-03", who: "Ben Hale", money: "$520", stage: "Paid" },
];

// ---------- Stock and money ----------
export type Product = { id: string; unit: Unit; name: string; onHand: number; paid: number; freight: number; tariffPct: number; markup: number; daysSitting: number; soldPerWeek: number };
export const products: Product[] = [
  { id: "p1", unit: "store", name: "Log splitter 37 ton", onHand: 41, paid: 1450, freight: 310, tariffPct: 25, markup: 2.0, daysSitting: 210, soldPerWeek: 2 },
  { id: "p2", unit: "store", name: "Wheelbarrow", onHand: 488, paid: 31, freight: 9, tariffPct: 25, markup: 2.2, daysSitting: 540, soldPerWeek: 4 },
  { id: "p3", unit: "store", name: "Asphalt shovel", onHand: 220, paid: 9.5, freight: 2.1, tariffPct: 25, markup: 3.3, daysSitting: 380, soldPerWeek: 14 },
  { id: "p4", unit: "store", name: "Work gloves (pair)", onHand: 12, paid: 3.25, freight: 0.6, tariffPct: 15, markup: 3.0, daysSitting: 60, soldPerWeek: 20 },
  { id: "p5", unit: "store", name: "Climbing rope 150 ft", onHand: 18, paid: 118, freight: 14, tariffPct: 0, markup: 2.3, daysSitting: 90, soldPerWeek: 2 },
  { id: "p6", unit: "slabs", name: "Walnut slab (each)", onHand: 9, paid: 0, freight: 0, tariffPct: 0, markup: 1, daysSitting: 45, soldPerWeek: 1 },
  { id: "p7", unit: "yard", name: "Mulch (yard)", onHand: 900, paid: 0, freight: 0, tariffPct: 0, markup: 1, daysSitting: 20, soldPerWeek: 60 },
];
export const slabValue = 1050; // average price per slab, made up
export const mulchPrice = 35;

// ---------- Inbox ----------
export type Msg = { id: string; from: string; via: "Facebook" | "Text" | "Call" | "Pocket" | "Website" | "Email"; unit: Unit; said: string; did: string; needs?: boolean; time: string };
export const inbox: Msg[] = [
  { id: "m1", from: "Carl Dempsey", via: "Facebook", unit: "store", said: "Can I do the splitter on payments? Like $500 a month?", did: "Payment plans always wait for you. Draft: \"We can do 3 payments with the first one at pickup.\"", needs: true, time: "9:41 AM" },
  { id: "m2", from: "Ann Russo", via: "Website", unit: "slabs", said: "Would you take $1,100 for the 9 ft walnut slab?", did: "You asked $1,350. Draft: \"Best I can do is $1,250, and I'll hold it till Friday.\"", needs: true, time: "9:20 AM" },
  { id: "m3", from: "You, in your Pocket", via: "Pocket", unit: "tree", said: "\"Remind David to quote the Greenvale school job by Wednesday.\"", did: "Made a task for David, due Wed. He got a text.", time: "8:52 AM" },
  { id: "m4", from: "Mike Lyle", via: "Facebook", unit: "store", said: "What size logs will the splitter take?", did: "Answered for you from your answer sheet: up to 25 inches across, 26 inches long.", time: "8:40 AM" },
  { id: "m5", from: "Blue Ridge Limb Co.", via: "Text", unit: "yard", said: "2 trailers coming in around 11", did: "Logged 2 loads to their account. Yard tablet knows they are coming.", time: "8:31 AM" },
  { id: "m6", from: "(540) 555-0188", via: "Call", unit: "tree", said: "Missed call. Voicemail: big oak leaning on the house, can someone look?", did: "Texted back a link to book a free look. Put it on David's list for today.", time: "8:15 AM" },
  { id: "m7", from: "You, in your Pocket", via: "Pocket", unit: "office", said: "\"Kat, call Hollow Creek about the yard bill, it's way late.\"", did: "Made a task for Kat with the $480 they owe.", time: "7:58 AM" },
  { id: "m8", from: "Shop order #1046", via: "Website", unit: "ship", said: "Log splitter, freight to Charlotte, NC", did: "Got 2 freight quotes. Cheapest is $285, picks up Wed.", time: "7:30 AM" },
];
