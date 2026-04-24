"use client";

import { Plus, Trash2 } from "lucide-react";
import { PostmortemData, whyAnalysisRow } from "@/types/postmortem";
import { Field, TextArea, SectionCard, SubSection } from "./FormComponents";
import { generateId } from "@/lib/defaults";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

export function Section6({ data, onChange }: Props) {
  const addWhy = () => {
    onChange({
      whyAnalysis: [...data.whyAnalysis, { id: generateId(), why: "Why did that happen?", answer: "" }],
    });
  };

  const updateWhy = (id: string, field: keyof whyAnalysisRow, value: string) => {
    onChange({
      whyAnalysis: data.whyAnalysis.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    });
  };

  const removeWhy = (id: string) => {
    if (data.whyAnalysis.length <= 2) return;
    onChange({ whyAnalysis: data.whyAnalysis.filter((w) => w.id !== id) });
  };

  return (
    <SectionCard num="06" title="Root Cause Analysis" id="section-6">
      <SubSection title="6.1 Primary Root Cause">
        <TextArea
          label="Root Cause Statement"
          value={data.primaryRootCause}
          onChange={(v) => onChange({ primaryRootCause: v })}
          placeholder='One clear, concise statement. e.g. "A missing database index on tbl_orders.user_id caused a full table scan when order volume exceeded 1M rows, exhausting the connection pool."'
          rows={3}
        />
      </SubSection>

      <SubSection title="6.2 Whys Analysis">
        <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 12, fontStyle: "italic" }}>Iteratively ask 'Why?' to drill down to the systemic root cause, not just the proximate trigger.</p>

        {data.whyAnalysis.map((row, index) => (
          <div
            key={row.id}
            style={{
              padding: 14,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              marginBottom: 8,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(99,102,241,0.2)",
                  color: "var(--color-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  flexShrink: 0,
                }}>
                {index + 1}
              </span>
              <input className="field-input" value={row.why} onChange={(e) => updateWhy(row.id, "why", e.target.value)} placeholder="Why did this happen?" style={{ fontSize: 13, fontWeight: 500, flex: 1 }} />
              <button className="btn-danger" onClick={() => removeWhy(row.id)} disabled={data.whyAnalysis.length <= 2} style={{ padding: 5, justifyContent: "center", opacity: data.whyAnalysis.length <= 2 ? 0.3 : 1 }}>
                <Trash2 size={13} />
              </button>
            </div>
            <div style={{ paddingLeft: 34 }}>
              <textarea className="field-input" value={row.answer} onChange={(e) => updateWhy(row.id, "answer", e.target.value)} placeholder="Because..." rows={2} style={{ fontSize: 13 }} />
            </div>
          </div>
        ))}

        <button className="btn-add" onClick={addWhy}>
          <Plus size={15} /> Add Why
        </button>
      </SubSection>

      <SubSection title="6.3 Contributing Factors">
        <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 16, fontStyle: "italic" }}>Identify factors that made the system vulnerable — these are often the real leverage points for prevention.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { key: "contributingPeople", label: "People", placeholder: "Human error, knowledge gap, on-call fatigue, unclear ownership" },
            { key: "contributingProcess", label: "Process", placeholder: "Missing review gate, inadequate runbook, no change freeze policy" },
            { key: "contributingTechnology", label: "Technology", placeholder: "Lack of guardrails, missing alerts, no rate limiting, config drift" },
            { key: "contributingEnvironment", label: "Environment", placeholder: "Third-party dependency, infra limits, cloud provider issue" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 12, alignItems: "start" }}>
              <div
                style={{
                  padding: "8px 12px",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  lineHeight: "34px",
                }}>
                {label}
              </div>
              <textarea className="field-input" onChange={(e) => onChange({ [key]: e.target.value })} placeholder={placeholder} rows={2} style={{ fontSize: 13 }} />
            </div>
          ))}
        </div>
      </SubSection>
    </SectionCard>
  );
}
