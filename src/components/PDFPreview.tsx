"use client";

import React from "react";
import { PostmortemData } from "@/types/postmortem";

interface Props {
  data: PostmortemData;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const empty = (v: string) => !v || v.trim() === "";

function val(v: string) {
  return empty(v) ? <span style={{ color: "#94a3b8", fontStyle: "italic" }}>—</span> : <>{v}</>;
}

const sevColors: Record<string, { bg: string; color: string; border: string }> = {
  "SEV-1": { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  "SEV-2": { bg: "#fff7ed", color: "#c2410c", border: "#fdba74" },
  "SEV-3": { bg: "#fefce8", color: "#a16207", border: "#fde047" },
  "SEV-4": { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
};

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  RESOLVED: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
  ONGOING: { bg: "#fef2f2", color: "#b91c1c", border: "#fca5a5" },
  MONITORING: { bg: "#fefce8", color: "#a16207", border: "#fde047" },
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
    background: "#ffffff",
    color: "#0f172a",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: 10,
    lineHeight: 1.5,
    padding: "40px 48px",
    minHeight: "297mm",
    width: "210mm",
    margin: "0 auto",
    boxSizing: "border-box" as const,
  },
  sectionHeader: {
    background: "#1e1b4b",
    color: "#fff",
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 0,
    borderRadius: "4px 4px 0 0",
  },
  subHeader: {
    background: "#4338ca",
    color: "#fff",
    padding: "5px 10px",
    fontSize: 10,
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 0,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 9,
    marginBottom: 0,
  },
  th: {
    background: "#1e1b4b",
    color: "#fff",
    padding: "5px 8px",
    textAlign: "left" as const,
    fontWeight: 700,
    fontSize: 9,
    border: "1px solid #312e81",
  },
  tdLabel: {
    background: "#e0eaff",
    color: "#1e1b4b",
    padding: "5px 8px",
    fontWeight: 700,
    fontSize: 9,
    border: "1px solid #c7d7ff",
    width: "30%",
    verticalAlign: "top" as const,
  },
  td: {
    padding: "5px 8px",
    border: "1px solid #e2e8f0",
    fontSize: 9,
    verticalAlign: "top" as const,
  },
  tdAlt: {
    padding: "5px 8px",
    border: "1px solid #e2e8f0",
    fontSize: 9,
    background: "#f0f4ff",
    verticalAlign: "top" as const,
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
  const sevColor = sevColors[data.severity] ?? sevColors["SEV-2"];
  const stColor = statusColors[data.status] ?? statusColors["RESOLVED"];

  return (
    <div style={styles.page}>
      {/* ── COVER ─────────────────────────────────────────── */}
      <div
        style={{
          background: "#1e1b4b",
          color: "#fff",
          padding: "24px 20px",
          borderRadius: 6,
          marginBottom: 20,
          textAlign: "center",
        }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>INCIDENT POSTMORTEM REPORT</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>{data.serviceSystem || <span style={{ opacity: 0.5 }}>[Service / System Name]</span>}</div>
        <div style={{ fontSize: 9, opacity: 0.6 }}>
          Incident Date: {data.incidentDate || "—"} &nbsp;|&nbsp; Version: {data.reportVersion || "—"}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: sevColor.bg, color: sevColor.color, border: `1px solid ${sevColor.border}` }}>{data.severity}</span>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: stColor.bg, color: stColor.color, border: `1px solid ${stColor.border}` }}>{data.status}</span>
        </div>
      </div>

      {/* ── SECTION 1: SNAPSHOT ───────────────────────────── */}
      <SectionHeader num="01" title="Incident Snapshot" />
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
      <SectionHeader num="02" title="Severity Reference Guide" />
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
      <SectionHeader num="03" title="Executive Summary" />
      <div style={{ padding: "8px 10px", background: "#f0f4ff", border: "1px solid #e0eaff", marginBottom: 0 }}>
        <Prose text={data.executiveSummary} />
      </div>

      {/* ── SECTION 4: TIMELINE ───────────────────────────── */}
      <SectionHeader num="04" title="Incident Timeline" />
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
      <SectionHeader num="05" title="Impact Assessment" />
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
      <SectionHeader num="06" title="Root Cause Analysis" />
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
      <SectionHeader num="07" title="Resolution & Recovery" />
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
      <SectionHeader num="08" title="Action Items & Preventive Measures" />
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
      <SectionHeader num="09" title="Lessons Learned" />
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
