# 📋 Postmortem Generator

A professional SRE Incident Postmortem Report Generator built with **Next.js 14**.

## ✨ Features

- **11 sections** based on industry-standard postmortem template
- **Dynamic rows** — add/remove entries for Timeline, Metrics, Five Whys, Action Items, Comms Log, and Sign-Offs
- **Export to DOCX** — formatted Word document with tables, headings, and styling
- **Export to PDF** — full A4 PDF with color-coded tables and page numbers
- **No auth, no database** — everything stays in your browser

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (sidebar + form)
│   └── globals.css         # Design system & CSS variables
├── components/
│   ├── FormComponents.tsx  # Shared: Field, TextArea, Select, SectionCard
│   ├── Section1Snapshot.tsx
│   ├── Section2and3.tsx
│   ├── Section4Timeline.tsx
│   ├── Section5Impact.tsx
│   ├── Section6RCA.tsx
│   ├── Section7Resolution.tsx
│   ├── Section8ActionItems.tsx
│   └── Section9to11.tsx
├── lib/
│   ├── defaults.ts         # Default data & ID generator
│   ├── exportDocx.ts       # DOCX export (docx.js)
│   └── exportPdf.ts        # PDF export (jsPDF + autoTable)
└── types/
    └── postmortem.ts       # TypeScript interfaces
```

## 🛠 Tech Stack

| Tool              | Purpose                      |
| ----------------- | ---------------------------- |
| Next.js 14        | React framework (App Router) |
| TypeScript        | Type safety                  |
| Tailwind CSS      | Utility classes              |
| docx              | DOCX generation              |
| jsPDF + autoTable | PDF generation               |
| file-saver        | Browser file download        |
| lucide-react      | Icons                        |
| date-fns          | Date utilities               |

## 📄 Postmortem Sections

1. **Incident Snapshot** — ID, severity, status, team, timeline
2. **Severity Reference Guide** — SEV-1 to SEV-4 reference (read-only)
3. **Executive Summary** — Non-technical overview
4. **Incident Timeline** — Dynamic chronological log
5. **Impact Assessment** — User impact + system metrics table (dynamic)
6. **Root Cause Analysis** — Primary RCA, Five Whys (dynamic), contributing factors
7. **Resolution & Recovery** — Mitigation steps, outcome, long-term fix
8. **Action Items** — Dynamic table with owner, due date, priority, type, status
9. **Lessons Learned** — What went well, improvements, lucky factors, surprises
10. **Communication Log** — Internal notifications (dynamic) + external comms
11. **Sign-Off & Approval** — Approvers table (dynamic)

---

_Maintained by the SRE / DevOps team._
