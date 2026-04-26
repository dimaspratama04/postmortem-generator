import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PostmortemData } from "@/types/postmortem";

const PRIMARY = [31, 41, 55] as [number, number, number]; // slate-800 (header utama)
const SECONDARY = [71, 85, 105] as [number, number, number]; // slate-600 (subheader)
const BORDER = [203, 213, 225] as [number, number, number]; // slate-300
const LIGHT = [248, 250, 252] as [number, number, number]; // slate-50
const ALT_ROW = [241, 245, 249] as [number, number, number]; // slate-100
const WHITE = [255, 255, 255] as [number, number, number];
const TEXT_DARK = [15, 23, 42] as [number, number, number]; // slate-900
const TEXT_MUTED = [100, 116, 139] as [number, number, number]; // slate-500

function addSectionHeader(doc: jsPDF, text: string, y: number): number {
  doc.setFillColor(...PRIMARY);
  doc.rect(14, y, 182, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(text, 16, y + 4.8);
  doc.setTextColor(...TEXT_DARK);
  return y + 9;
}

function addSubHeader(doc: jsPDF, text: string, y: number): number {
  doc.setFillColor(...LIGHT);
  doc.rect(14, y, 182, 6, "F");
  doc.setDrawColor(...BORDER);
  doc.line(14, y + 6, 196, y + 6);
  doc.setTextColor(...SECONDARY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(text, 16, y + 4);
  doc.setTextColor(...TEXT_DARK);
  return y + 8;
}

function checkPageBreak(doc: jsPDF, y: number, needed = 20): number {
  if (y > 270) {
    doc.addPage();
    return 15;
  }
  return y;
}

function addKVTable(doc: jsPDF, rows: [string, string][], startY: number): number {
  autoTable(doc, {
    startY,
    margin: { left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 55, fillColor: LIGHT, fontStyle: "bold", textColor: PRIMARY },
      1: { cellWidth: 127 },
    },
    body: rows,
    styles: { fontSize: 9, cellPadding: 3, textColor: TEXT_DARK },
    alternateRowStyles: { fillColor: ALT_ROW },
    theme: "plain",
  });
  return (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
}

export function exportToPdf(data: PostmortemData): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();

  // ── COVER ───────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...TEXT_DARK);
  doc.text("INCIDENT POSTMORTEM REPORT", pageW / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(100, 116, 139); // muted gray
  doc.text(data.serviceSystem || "[Service / System Name]", pageW / 2, 28, { align: "center" });

  // metadata
  doc.setFontSize(9);
  doc.text(`Incident Date: ${data.incidentDate || "—"}   |   Version: ${data.reportVersion || "—"}`, pageW / 2, 34, { align: "center" });

  // divider line (biar clean kayak preview)
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.line(14, 40, pageW - 14, 40);

  // reset text color
  doc.setTextColor(...TEXT_DARK);

  // start content
  let y = 46;

  // ── SECTION 1: SNAPSHOT ─────────────────────────────────
  y = addSectionHeader(doc, "1. Incident Snapshot", y);
  y = addKVTable(
    doc,
    [
      ["Incident ID", data.incidentId],
      ["Status", data.status],
      ["Severity", data.severity],
      ["Start Time", data.startTime],
      ["End Time", data.endTime],
      ["Total Duration", data.totalDuration],
      ["Affected System(s)", data.affectedSystems],
      ["Affected Users", data.affectedUsers],
      ["Error Budget Impact", data.errorBudgetImpact],
      ["Incident Commander", data.incidentCommander],
      ["Communications Lead", data.communicationsLead],
      ["Scribe", data.scribe],
      ["Prepared By", data.preparedBy],
    ],
    y,
  );

  // ── SECTION 2: SEVERITY GUIDE ───────────────────────────
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, "2. Severity Reference Guide", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14, top: 0 },
    head: [["Level", "Name", "Criteria", "Response"]],
    body: [
      ["SEV-1", "Critical", "Full outage / data loss / security breach", "Immediate all-hands; exec notification"],
      ["SEV-2", "High", "Major feature broken; significant user impact", "On-call + lead notified within 15 min"],
      ["SEV-3", "Medium", "Partial degradation; workaround available", "On-call handles; fix within 24h"],
      ["SEV-4", "Low", "Minor issue; minimal / no user impact", "Ticket created; fix in next sprint"],
    ],
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 22 }, 2: { cellWidth: 80 }, 3: { cellWidth: 62 } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 3: EXECUTIVE SUMMARY ────────────────────────
  y = checkPageBreak(doc, y, 30);
  y = addSectionHeader(doc, "3. Executive Summary", y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const summaryLines = doc.splitTextToSize(data.executiveSummary || "—", 178);
  summaryLines.forEach((line: string) => {
    y = checkPageBreak(doc, y);
    doc.text(line, 16, y);
    y += 5;
  });

  // ── SECTION 4: TIMELINE ─────────────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "4. Incident Timeline", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Time", "Actor", "Event / Action"]],
    body: data.timeline.map((t) => [t.time, t.actor, t.event]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 42 }, 2: { cellWidth: 118 } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 5: IMPACT ───────────────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "5. Impact Assessment", y);
  y = addSubHeader(doc, "5.1 Service & User Impact", y);

  const impactLines = (data.serviceUserImpact || "").split("\n").filter(Boolean);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (impactLines.length > 0) {
    impactLines.forEach((line) => {
      y = checkPageBreak(doc, y);
      const maxWidth = 180;
      const wrapped = doc.splitTextToSize(`• ${line}`, maxWidth);
      doc.text(wrapped, 16, y);
      y += wrapped.length * 5;
    });
  } else {
    doc.text("—", 16, y);
    y += 6;
  }

  y = checkPageBreak(doc, y, 40);
  y = addSubHeader(doc, "5.2 System Metrics", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Dimension", "Before Incident", "During Incident (Peak)"]],
    body: data.metrics.map((m) => [m.dimension, m.before || "—", m.during || "—"]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { fillColor: LIGHT, fontStyle: "bold", cellWidth: 65 } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 6: RCA ──────────────────────────────────────
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, "6. Root Cause Analysis", y);
  y = addSubHeader(doc, "6.1 Primary Root Cause", y);

  doc.setFontSize(9);
  const rcaLines = doc.splitTextToSize(data.primaryRootCause || "—", 178);
  doc.setFillColor(...ALT_ROW);
  rcaLines.forEach((line: string) => {
    y = checkPageBreak(doc, y);
    doc.text(line, 16, y);
    y += 5;
  });

  y = checkPageBreak(doc, y, 40);
  y = addSubHeader(doc, "6.2 Whys Analysis", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["#", "Why?", "Answer"]],
    body: data.whyAnalysis.map((row, i) => [`${i + 1}`, row.why, row.answer || "—"]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    footStyles: { fillColor: LIGHT, textColor: PRIMARY, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 80 } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  y = checkPageBreak(doc, y, 35);
  y = addSubHeader(doc, "6.3 Contributing Factors", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Category", "Description"]],
    body: [
      ["People", data.contributingPeople || "—"],
      ["Process", data.contributingProcess || "—"],
      ["Technology", data.contributingTechnology || "—"],
      ["Environment", data.contributingEnvironment || "—"],
    ],
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 40, fillColor: LIGHT, fontStyle: "bold", textColor: PRIMARY } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 7: RESOLUTION ───────────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "7. Resolution & Recovery", y);
  y = addSubHeader(doc, "7.1 Immediate Mitigation Steps", y);

  const mitSteps = (data.mitigationSteps || "").split("\n").filter(Boolean);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (mitSteps.length > 0) {
    mitSteps.forEach((line) => {
      y = checkPageBreak(doc, y);
      const maxWidth = 180;
      const wrapped = doc.splitTextToSize(`• ${line}`, maxWidth);
      doc.text(wrapped, 16, y);
      y += wrapped.length * 5;
    });
  } else {
    doc.text("—", 16, y);
    y += 6;
  }

  y = checkPageBreak(doc, y, 20);
  y = addSubHeader(doc, "7.2 Recovery Outcome", y);
  const recovLines = doc.splitTextToSize(data.recoveryOutcome || "—", 178);
  doc.setFillColor(...ALT_ROW);
  recovLines.forEach((line: string) => {
    y = checkPageBreak(doc, y);
    doc.text(line, 16, y);
    y += 5;
  });

  y = checkPageBreak(doc, y, 25);
  y = addSubHeader(doc, "7.3 Long-Term Fix", y);
  const ltfLines = (data.longTermFix || "").split("\n").filter(Boolean);
  doc.setFontSize(9);
  if (ltfLines.length > 0) {
    ltfLines.forEach((line) => {
      y = checkPageBreak(doc, y);
      const maxWidth = 180;
      const wrapped = doc.splitTextToSize(`• ${line}`, maxWidth);
      doc.text(wrapped, 16, y);
      y += wrapped.length * 5;
    });
  } else {
    doc.text("—", 16, y);
    y += 6;
  }

  // ── SECTION 8: ACTION ITEMS ─────────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "8. Action Items & Preventive Measures", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["ID", "Action Item", "Owner", "Due Date", "Priority", "Type", "Status"]],
    body: data.actionItems.map((ai) => [ai.actionId, ai.description, ai.owner, ai.dueDate, ai.priority, ai.type, ai.status]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 8 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: {
      0: { cellWidth: 14 },
      1: { cellWidth: 60 },
      2: { cellWidth: 28 },
      3: { cellWidth: 24 },
      4: { cellWidth: 18 },
      5: { cellWidth: 20 },
      6: { cellWidth: 18 },
    },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 9: LESSONS LEARNED ──────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "9. Lessons Learned", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Category", "Details"]],
    body: [
      ["What Went Well", data.whatWentWell || "—"],
      ["What Could Be Improved", data.whatCouldImprove || "—"],
      ["Lucky Factors", data.luckyFactors || "—"],
      ["Surprises", data.surprises || "—"],
    ],
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 50, fillColor: LIGHT, fontStyle: "bold", textColor: PRIMARY } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── SECTION 10: COMMS LOG ───────────────────────────────
  y = checkPageBreak(doc, y, 40);
  y = addSectionHeader(doc, "10. Communication Log", y);
  y = addSubHeader(doc, "10.1 Internal Notifications", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Time", "Channel / Audience", "Message Summary"]],
    body: data.internalComms.map((c) => [c.time, c.channel, c.summary]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 3 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 45 } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  y = checkPageBreak(doc, y, 20);
  y = addSubHeader(doc, "10.2 External / Customer Communication", y);
  const extLines = (data.externalComms || "").split("\n").filter(Boolean);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  if (extLines.length > 0) {
    extLines.forEach((line) => {
      y = checkPageBreak(doc, y);
      const maxWidth = 180;
      const wrapped = doc.splitTextToSize(`• ${line}`, maxWidth);
      doc.text(wrapped, 16, y);
      y += wrapped.length * 5;
    });
  } else {
    doc.text("—", 16, y);
    y += 6;
  }

  // ── SECTION 11: SIGN-OFF ────────────────────────────────
  y = checkPageBreak(doc, y, 50);
  y = addSectionHeader(doc, "11. Sign-Off & Approval", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Role", "Name", "Date", "Sign-off"]],
    body: data.signOffs.map((so) => [so.role, so.name, so.date, so.signoff]),
    headStyles: { fillColor: PRIMARY, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
    styles: { fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: ALT_ROW },
    columnStyles: { 0: { cellWidth: 55, fillColor: LIGHT, fontStyle: "bold", textColor: PRIMARY } },
    theme: "plain",
  });
  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // ── PAGE NUMBERS ────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`CONFIDENTIAL — INTERNAL USE ONLY  |  SRE / DevOps Team  |  Page ${i} of ${pageCount}`, pageW / 2, 290, { align: "center" });
  }

  const filename = `Postmortem_${data.incidentId || "Report"}_${data.incidentDate}.pdf`;
  doc.save(filename);
}
