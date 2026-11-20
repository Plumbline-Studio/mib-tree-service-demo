# Home Base for MIB (mib-tree-service-demo)

A clickable, phone-first mockup Plumbline Studio made for Thomas Craddock.
It shows one simple app that runs MIB Tree Service and also pulls the grinding yard,
the MIB Supplies store, the log splitters and the company files into one place.

**Every customer, crew name, number and message in it is made up.** Nothing is sent to anyone.

## What it shows

- **Today**: only the things that need Thomas, plus one number per business.
- **Jobs**: today's crews, the week, quotes waiting, job photos.
- **Messages**: Facebook questions about log splitters with replies already written from
  Thomas's own answer sheet. Easy ones can send on their own. Payment plans and trades always wait for him.
- **Yard**: a phone version of the paper load book, with who owes on account.
- **Store**: splitter stock, low stock, dealers and the opening day list.
- **More**: weekly numbers, 90-day goals, line of sight, Monday huddle, problems to fix, files, connections.

`/frame` shows eight screens side by side at iPhone width (375 px) for review.

## Run it

```
npm install
npm run dev
```

Stack: Next.js, React, TypeScript, Tailwind. Sample data lives in `lib/data.ts`.
