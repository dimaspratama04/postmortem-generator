"use client";

import { useState, useCallback } from "react";
import { FileText, Download, FileDown, RotateCcw, ChevronRight, AlertTriangle, Clock, BarChart2, Search, Wrench, ListChecks, BookOpen, MessageSquare, CheckSquare, Shield, Layers } from "lucide-react";
import { PostmortemData } from "@/types/postmortem";
import { getDefaultData } from "@/lib/defaults";
import { Section1 } from "@/components/Section1Snapshot";
import { Section2, Section3 } from "@/components/Section2and3";
import { Section4 } from "@/components/Section4Timeline";
import { Section5 } from "@/components/Section5Impact";
import { Section6 } from "@/components/Section6RCA";
import { Section7 } from "@/components/Section7Resolution";
import { Section8 } from "@/components/Section8ActionItems";
import { Section9, Section10, Section11 } from "@/components/Section9to11";

const navItems = [
  { id: "section-1", num: "01", label: "Snapshot", icon: Shield },
  { id: "section-2", num: "02", label: "Severity Guide", icon: AlertTriangle },
  { id: "section-3", num: "03", label: "Summary", icon: FileText },
  { id: "section-4", num: "04", label: "Timeline", icon: Clock },
  { id: "section-5", num: "05", label: "Impact", icon: BarChart2 },
  { id: "section-6", num: "06", label: "Root Cause", icon: Search },
  { id: "section-7", num: "07", label: "Resolution", icon: Wrench },
  { id: "section-8", num: "08", label: "Action Items", icon: ListChecks },
  { id: "section-9", num: "09", label: "Lessons Learned", icon: BookOpen },
  { id: "section-10", num: "10", label: "Comms Log", icon: MessageSquare },
  { id: "section-11", num: "11", label: "Sign-Off", icon: CheckSquare },
];

export default function HomePage() {
  const [data, setData] = useState<PostmortemData>(getDefaultData);
  const [isExporting, setIsExporting] = useState<"docx" | "pdf" | null>(null);
  const [activeSection, setActiveSection] = useState("section-1");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleChange = useCallback((partial: Partial<PostmortemData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExportDocx = async () => {
    setIsExporting("docx");
    try {
      const { exportToDocx } = await import("@/lib/exportDocx");
      await exportToDocx(data);
    } catch (e) {
      console.error(e);
      alert("Export DOCX failed. Check console for details.");
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting("pdf");
    try {
      const { exportToPdf } = await import("@/lib/exportPdf");
      exportToPdf(data);
    } catch (e) {
      console.error(e);
      alert("Export PDF failed. Check console for details.");
    } finally {
      setIsExporting(null);
    }
  };

  const handleReset = () => {
    setData(getDefaultData());
    setShowResetConfirm(false);
  };

  const severityColors: Record<string, string> = {
    "SEV-1": "#f87171",
    "SEV-2": "#fb923c",
    "SEV-3": "#fbbf24",
    "SEV-4": "#34d399",
  };
  const statusColors: Record<string, string> = {
    RESOLVED: "#34d399",
    ONGOING: "#f87171",
    MONITORING: "#fbbf24",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}>
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: "1px solid var(--color-border)",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
              <Layers size={16} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: "var(--color-text)", lineHeight: 1.2 }}>Postmortem</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-dim)" }}>Generator</div>
            </div>
          </div>
        </div>

        {/* Status summary */}
        {data.incidentId && (
          <div
            style={{
              margin: "12px 10px",
              padding: "10px 12px",
              background: "var(--color-surface2)",
              borderRadius: 8,
              border: "1px solid var(--color-border)",
            }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>{data.incidentId}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  padding: "2px 6px",
                  borderRadius: 99,
                  background: `${severityColors[data.severity]}22`,
                  color: severityColors[data.severity],
                  border: `1px solid ${severityColors[data.severity]}44`,
                }}>
                {data.severity}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  padding: "2px 6px",
                  borderRadius: 99,
                  background: `${statusColors[data.status]}22`,
                  color: statusColors[data.status],
                  border: `1px solid ${statusColors[data.status]}44`,
                }}>
                {data.status}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ padding: "8px 8px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => scrollToSection(item.id)}
                style={{ width: "100%", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: activeSection === item.id ? "var(--color-primary)" : "var(--color-text-dim)",
                    width: 20,
                    flexShrink: 0,
                  }}>
                  {item.num}
                </span>
                <Icon size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                <span style={{ fontSize: 12 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
          <button className="btn-primary" onClick={handleExportDocx} disabled={isExporting !== null} style={{ fontSize: 12, padding: "8px 14px", justifyContent: "center" }}>
            <FileText size={14} />
            {isExporting === "docx" ? "Exporting..." : "Export DOCX"}
          </button>
          <button className="btn-primary" onClick={handleExportPdf} disabled={isExporting !== null} style={{ fontSize: 12, padding: "8px 14px", justifyContent: "center", background: "#7c3aed" }}>
            <FileDown size={14} />
            {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
          </button>
          {showResetConfirm ? (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={handleReset} style={{ flex: 1, padding: "6px 10px", background: "rgba(248,113,113,0.2)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                Confirm Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{ flex: 1, padding: "6px 10px", background: "var(--color-surface2)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={() => setShowResetConfirm(true)} style={{ fontSize: 11, padding: "6px 14px", justifyContent: "center" }}>
              <RotateCcw size={12} /> Reset All
            </button>
          )}
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 80px", maxWidth: 900 }}>
        {/* Top header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}>
            Incident Postmortem Generator
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Fill in the form below. Export to DOCX or PDF when ready. No data is stored — everything stays in your browser.</p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
            }}>
            <button className="btn-primary" onClick={handleExportDocx} disabled={isExporting !== null}>
              <FileText size={16} />
              {isExporting === "docx" ? "Generating DOCX..." : "Download DOCX"}
            </button>
            <button className="btn-primary" onClick={handleExportPdf} disabled={isExporting !== null} style={{ background: "#7c3aed" }}>
              <FileDown size={16} />
              {isExporting === "pdf" ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Section1 data={data} onChange={handleChange} />
          <Section2 data={data} onChange={handleChange} />
          <Section3 data={data} onChange={handleChange} />
          <Section4 data={data} onChange={handleChange} />
          <Section5 data={data} onChange={handleChange} />
          <Section6 data={data} onChange={handleChange} />
          <Section7 data={data} onChange={handleChange} />
          <Section8 data={data} onChange={handleChange} />
          <Section9 data={data} onChange={handleChange} />
          <Section10 data={data} onChange={handleChange} />
          <Section11 data={data} onChange={handleChange} />
        </div>

        {/* Bottom export bar */}
        <div
          style={{
            marginTop: 40,
            padding: "20px 24px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", marginBottom: 2 }}>Ready to export?</div>
            <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Review all sections above, then download your report.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn-primary" onClick={handleExportDocx} disabled={isExporting !== null}>
              <FileText size={16} />
              {isExporting === "docx" ? "Exporting..." : "Export DOCX"}
            </button>
            <button className="btn-primary" onClick={handleExportPdf} disabled={isExporting !== null} style={{ background: "#7c3aed" }}>
              <FileDown size={16} />
              {isExporting === "pdf" ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
