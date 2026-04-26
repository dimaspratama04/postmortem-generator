"use client";

import React from "react";
import { PostmortemData } from "@/types/postmortem";

interface Props {
  data: PostmortemData;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const empty = (v: string) => !v || v.trim() === "";
const COLORS = {
  bg: "#ffffff",
  text: "#111827", // gray-900
  muted: "#6b7280", // gray-500
  border: "#e5e7eb", // gray-200
  header: "#111827", // dark header (clean corporate)
  subHeader: "#374151", // gray-700
  tableHeader: "#1f2937", // gray-800
  altRow: "#f9fafb", // gray-50
  labelBg: "#f3f4f6", // gray-100
};
function val(v: string) {
  return empty(v) ? <span style={{ color: "#94a3b8", fontStyle: "italic" }}>—</span> : <>{v}</>;
}

const sevColors: Record<string, { bg: string; color: string; border: string }> = {
  "SEV-1": { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  "SEV-2": { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" },
  "SEV-3": { bg: "#fefce8", color: "#a16207", border: "#fde047" },
  "SEV-4": { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
};

const priorityColors: Record<string, string> = {
  HIGH: "#dc2626",
  MEDIUM: "#d97706",
  LOW: "#16a34a",
};

const statusColorsAI: Record<string, string> = {
  Open: "#4f46e5",
  "In Progress": "#ea580c",
  Done: "#16a34a",
  Cancelled: "#64748b",
};

// ── Sub-components ──────────────────────────────────────────────────────────

const styles = {
  page: {
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 10,
    lineHeight: 1.5,
    padding: "40px 48px",
    minHeight: "297mm",
    width: "210mm",
    margin: "0 auto",
  },

  sectionHeader: {
    background: COLORS.header,
    color: "#fff",
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 700,
    marginTop: 20,
    borderRadius: "4px 4px 0 0",
  },

  subHeader: {
    background: COLORS.subHeader,
    color: "#fff",
    padding: "6px 12px",
    fontSize: 10,
    fontWeight: 600,
    marginTop: 12,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 9,
  },

  th: {
    background: COLORS.tableHeader,
    color: "#fff",
    padding: "6px 8px",
    textAlign: "left" as const,
    fontWeight: 600,
    fontSize: 9,
    border: `1px solid ${COLORS.border}`,
  },

  tdLabel: {
    background: COLORS.labelBg,
    color: COLORS.text,
    padding: "6px 8px",
    fontWeight: 600,
    border: `1px solid ${COLORS.border}`,
    width: "30%",
  },

  td: {
    padding: "6px 8px",
    border: `1px solid ${COLORS.border}`,
  },

  tdAlt: {
    padding: "6px 8px",
    border: `1px solid ${COLORS.border}`,
    background: COLORS.altRow,
  },
};

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={styles.sectionHeader}>
      <span style={{ opacity: 0.6, marginRight: 8, fontSize: 9 }}>{num}</span>
      {title}
    </div>
  );
}

function SubHeader({ title }: { title: string }) {
  return <div style={styles.subHeader}>{title}</div>;
}

function KVRow({ label, value, alt }: { label: string; value: string; alt?: boolean }) {
  return (
    <tr>
      <td style={styles.tdLabel}>{label}</td>
      <td style={alt ? styles.tdAlt : styles.td}>{val(value)}</td>
    </tr>
  );
}

function BulletLines({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  if (!lines.length) return <p style={{ fontSize: 9, color: "#94a3b8", fontStyle: "italic", margin: "6px 0" }}>—</p>;
  return (
    <ul style={{ margin: "6px 0", paddingLeft: 16 }}>
      {lines.map((l, i) => (
        <li key={i} style={{ fontSize: 9, marginBottom: 2 }}>
          {l.replace(/^[•\-*]\s*/, "")}
        </li>
      ))}
    </ul>
  );
}

function Prose({ text }: { text: string }) {
  if (!text?.trim()) return <p style={{ fontSize: 9, color: "#94a3b8", fontStyle: "italic", margin: "6px 0" }}>—</p>;
  return <p style={{ fontSize: 9, margin: "6px 0", lineHeight: 1.6 }}>{text}</p>;
}

// ── Main Preview ────────────────────────────────────────────────────────────

export function PdfPreview({ data }: Props) {
  return (
    <div style={styles.page}>
      {/* ── COVER ─────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: `2px solid ${COLORS.border}`,
          paddingBottom: 16,
          marginBottom: 20,
          textAlign: "center",
        }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>INCIDENT POSTMORTEM REPORT</div>

        <div style={{ fontSize: 13, color: COLORS.muted }}>{data.serviceSystem || "[Service / System Name]"}</div>

        <div style={{ fontSize: 9, color: COLORS.muted }}>
          Incident Date: {data.incidentDate || "—"} | Version: {data.reportVersion || "—"}
        </div>
      </div>

      {/* ── SECTION 1: SNAPSHOT ───────────────────────────── */}
      <SectionHeader num="1" title="Incident Snapshot" />
      <table style={styles.table}>
        <tbody>
          {[
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
          ].map(([label, value], i) => (
            <KVRow key={label} label={label} value={value} alt={i % 2 === 0} />
          ))}
        </tbody>
      </table>

      {/* ── SECTION 2: SEVERITY GUIDE ─────────────────────── */}
      <SectionHeader num="2" title="Severity Reference Guide" />
      <table style={styles.table}>
        <thead>
          <tr>
            {["Level", "Name", "Criteria", "Response"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["SEV-1", "Critical", "Full outage / data loss / security breach", "Immediate all-hands; exec notification"],
            ["SEV-2", "High", "Major feature broken; significant user impact", "On-call + lead notified within 15 min"],
            ["SEV-3", "Medium", "Partial degradation; workaround available", "On-call handles; fix within 24h"],
            ["SEV-4", "Low", "Minor issue; minimal / no user impact", "Ticket created; fix in next sprint"],
          ].map(([level, name, criteria, response], i) => (
            <tr key={level}>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>
                <span style={{ fontWeight: 700, color: sevColors[level]?.color ?? "#000", fontSize: 9 }}>{level}</span>
              </td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{name}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{criteria}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{response}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 3: EXECUTIVE SUMMARY ─────────────────── */}
      <SectionHeader num="3" title="Executive Summary" />
      <div style={{ padding: "8px 10px", background: "#f0f4ff", border: "1px solid #e0eaff", marginBottom: 0 }}>
        <Prose text={data.executiveSummary} />
      </div>

      {/* ── SECTION 4: TIMELINE ───────────────────────────── */}
      <SectionHeader num="4" title="Incident Timeline" />
      <table style={styles.table}>
        <thead>
          <tr>
            {["Time", "Actor", "Event / Action"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.timeline.map((entry, i) => (
            <tr key={entry.id}>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), width: "12%", fontWeight: 600, fontFamily: "monospace" }}>{val(entry.time)}</td>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), width: "22%" }}>{val(entry.actor)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(entry.event)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 5: IMPACT ─────────────────────────────── */}
      <SectionHeader num="5" title="Impact Assessment" />
      <SubHeader title="5.1 Service & User Impact" />
      <div style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderTop: "none" }}>
        <BulletLines text={data.serviceUserImpact} />
      </div>
      <SubHeader title="5.2 System Metrics" />
      <table style={styles.table}>
        <thead>
          <tr>
            {["Dimension", "Before Incident", "During Incident (Peak)"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.metrics.map((m, i) => (
            <tr key={m.id}>
              <td style={styles.tdLabel}>{val(m.dimension)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(m.before)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(m.during)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 6: RCA ────────────────────────────────── */}
      <SectionHeader num="6" title="Root Cause Analysis" />
      <SubHeader title="6.1 Primary Root Cause" />
      <div style={{ padding: "8px 10px", background: "#f0f4ff", border: "1px solid #e0eaff", borderTop: "none" }}>
        <Prose text={data.primaryRootCause} />
      </div>
      <SubHeader title="6.2 Five Whys Analysis" />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "5%" }}>#</th>
            <th style={{ ...styles.th, width: "40%" }}>Why?</th>
            <th style={styles.th}>Answer</th>
          </tr>
        </thead>
        <tbody>
          {data.whyAnalysis.map((row, i) => (
            <tr key={row.id}>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), textAlign: "center", fontWeight: 700 }}>{i + 1}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(row.why)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(row.answer)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SubHeader title="6.3 Contributing Factors" />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "22%" }}>Category</th>
            <th style={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["People", data.contributingPeople],
            ["Process", data.contributingProcess],
            ["Technology", data.contributingTechnology],
            ["Environment", data.contributingEnvironment],
          ].map(([label, value], i) => (
            <tr key={label}>
              <td style={styles.tdLabel}>{label}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 7: RESOLUTION ─────────────────────────── */}
      <SectionHeader num="7" title="Resolution & Recovery" />
      <SubHeader title="7.1 Immediate Mitigation Steps" />
      <div style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderTop: "none" }}>
        <BulletLines text={data.mitigationSteps} />
      </div>
      <SubHeader title="7.2 Recovery Outcome" />
      <div style={{ padding: "8px 10px", background: "#f0f4ff", border: "1px solid #e0eaff", borderTop: "none" }}>
        <Prose text={data.recoveryOutcome} />
      </div>
      <SubHeader title="7.3 Long-Term Fix" />
      <div style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderTop: "none" }}>
        <BulletLines text={data.longTermFix} />
      </div>

      {/* ── SECTION 8: ACTION ITEMS ───────────────────────── */}
      <SectionHeader num="8" title="Action Items & Preventive Measures" />
      <table style={styles.table}>
        <thead>
          <tr>
            {["ID", "Action Item", "Owner", "Due Date", "Priority", "Type", "Status"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.actionItems.map((ai, i) => (
            <tr key={ai.id}>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), fontFamily: "monospace", fontWeight: 600, fontSize: 8 }}>{ai.actionId}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(ai.description)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(ai.owner)}</td>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), whiteSpace: "nowrap" as const }}>{val(ai.dueDate)}</td>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), fontWeight: 700, color: priorityColors[ai.priority] }}>{ai.priority}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{ai.type}</td>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), fontWeight: 600, color: statusColorsAI[ai.status] }}>{ai.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 9: LESSONS LEARNED ────────────────────── */}
      <SectionHeader num="9" title="Lessons Learned" />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "25%" }}>Category</th>
            <th style={styles.th}>Details</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["✅ What Went Well", data.whatWentWell],
            ["🔧 What Could Be Improved", data.whatCouldImprove],
            ["🍀 Lucky Factors", data.luckyFactors],
            ["⚡ Surprises", data.surprises],
          ].map(([label, value], i) => (
            <tr key={label}>
              <td style={styles.tdLabel}>{label}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SECTION 10: COMMS LOG ─────────────────────────── */}
      <SectionHeader num="10" title="Communication Log" />
      <SubHeader title="10.1 Internal Notifications" />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: "12%" }}>Time</th>
            <th style={{ ...styles.th, width: "26%" }}>Channel / Audience</th>
            <th style={styles.th}>Message Summary</th>
          </tr>
        </thead>
        <tbody>
          {data.internalComms.map((c, i) => (
            <tr key={c.id}>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), fontFamily: "monospace" }}>{val(c.time)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(c.channel)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(c.summary)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SubHeader title="10.2 External / Customer Communication" />
      <div style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderTop: "none" }}>
        <BulletLines text={data.externalComms} />
      </div>

      {/* ── SECTION 11: SIGN-OFF ──────────────────────────── */}
      <SectionHeader num="11" title="Sign-Off & Approval" />
      <table style={styles.table}>
        <thead>
          <tr>
            {["Role", "Name", "Date", "Sign-off"].map((h) => (
              <th key={h} style={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.signOffs.map((so, i) => (
            <tr key={so.id}>
              <td style={styles.tdLabel}>{val(so.role)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(so.name)}</td>
              <td style={{ ...(i % 2 === 0 ? styles.tdAlt : styles.td), whiteSpace: "nowrap" as const }}>{val(so.date)}</td>
              <td style={i % 2 === 0 ? styles.tdAlt : styles.td}>{val(so.signoff)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 10,
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
          fontSize: 8,
          color: "#94a3b8",
          fontStyle: "italic",
        }}>
        CONFIDENTIAL — INTERNAL USE ONLY &nbsp;|&nbsp; SRE / DevOps Team
      </div>
    </div>
  );
}
