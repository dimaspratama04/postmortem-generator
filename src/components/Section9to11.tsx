"use client";

import { Plus, Trash2 } from "lucide-react";
import { PostmortemData, CommLog, SignOff } from "@/types/postmortem";
import { Field, TextArea, SectionCard, SubSection } from "./FormComponents";
import { generateId } from "@/lib/defaults";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

// ── SECTION 9: Lessons Learned ─────────────────────────
export function Section9({ data, onChange }: Props) {
  const lessons = [
    { key: "whatWentWell", label: "✅ What Went Well", placeholder: "Things that worked — detection speed, team response, tooling, documentation..." },
    { key: "whatCouldImprove", label: "🔧 What Could Be Improved", placeholder: "Gaps in process, tooling, or knowledge exposed by this incident..." },
    { key: "luckyFactors", label: "🍀 Lucky Factors", placeholder: "Things that prevented it from being worse..." },
    { key: "surprises", label: "⚡ Surprises", placeholder: "Anything unexpected discovered during the incident..." },
  ];

  return (
    <SectionCard num="09" title="Lessons Learned" id="section-9">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {lessons.map(({ key, label, placeholder }) => (
          <TextArea key={key} label={label} value={(data as Record<string, string>)[key]} onChange={(v) => onChange({ [key]: v })} placeholder={placeholder} rows={3} />
        ))}
      </div>
    </SectionCard>
  );
}

// ── SECTION 10: Communication Log ──────────────────────
export function Section10({ data, onChange }: Props) {
  const addComm = () => {
    onChange({
      internalComms: [...data.internalComms, { id: generateId(), time: "", channel: "", summary: "" }],
    });
  };

  const updateComm = (id: string, field: keyof CommLog, value: string) => {
    onChange({
      internalComms: data.internalComms.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    });
  };

  const removeComm = (id: string) => {
    onChange({ internalComms: data.internalComms.filter((c) => c.id !== id) });
  };

  return (
    <SectionCard num="10" title="Communication Log" id="section-10">
      <SubSection title="10.1 Internal Notifications">
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "100px 200px 1fr 36px", gap: 8, padding: "4px 8px", marginBottom: 4 }}>
          {["Time", "Channel / Audience", "Message Summary", ""].map((h, i) => (
            <span key={i} className="field-label" style={{ marginBottom: 0 }}>
              {h}
            </span>
          ))}
        </div>

        {data.internalComms.map((comm, index) => (
          <div
            key={comm.id}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 200px 1fr 36px",
              gap: 8,
              alignItems: "center",
              padding: 8,
              background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              marginBottom: 6,
            }}>
            <input className="field-input" value={comm.time} onChange={(e) => updateComm(comm.id, "time", e.target.value)} placeholder="HH:MM" style={{ fontSize: 13 }} />
            <input className="field-input" value={comm.channel} onChange={(e) => updateComm(comm.id, "channel", e.target.value)} placeholder="Slack / Email / Call" style={{ fontSize: 13 }} />
            <input className="field-input" value={comm.summary} onChange={(e) => updateComm(comm.id, "summary", e.target.value)} placeholder="Brief summary of what was communicated..." style={{ fontSize: 13 }} />
            <button className="btn-danger" onClick={() => removeComm(comm.id)} disabled={data.internalComms.length <= 1} style={{ padding: 6, justifyContent: "center", opacity: data.internalComms.length <= 1 ? 0.3 : 1 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button className="btn-add" onClick={addComm}>
          <Plus size={15} /> Add Communication Entry
        </button>
      </SubSection>

      <SubSection title="10.2 External / Customer Communication">
        <TextArea
          label="External Communication Details"
          value={data.externalComms}
          onChange={(v) => onChange({ externalComms: v })}
          placeholder="• Was a public status page updated? When?&#10;• Were customers notified directly? By what channel?&#10;• Was a public post-incident report published? Link:"
          rows={4}
          hint="One item per line."
        />
      </SubSection>
    </SectionCard>
  );
}

// ── SECTION 11: Sign-Off ────────────────────────────────
export function Section11({ data, onChange }: Props) {
  const addSignOff = () => {
    onChange({
      signOffs: [...data.signOffs, { id: generateId(), role: "", name: "", date: "", signoff: "" }],
    });
  };

  const updateSignOff = (id: string, field: keyof SignOff, value: string) => {
    onChange({
      signOffs: data.signOffs.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  const removeSignOff = (id: string) => {
    if (data.signOffs.length <= 1) return;
    onChange({ signOffs: data.signOffs.filter((s) => s.id !== id) });
  };

  return (
    <SectionCard num="11" title="Sign-Off & Approval" id="section-11">
      <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 16, fontStyle: "italic" }}>This document must be reviewed and approved within 5 business days of incident resolution.</p>

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 130px 130px 36px", gap: 8, padding: "4px 8px", marginBottom: 4 }}>
        {["Role", "Name", "Date", "Sign-off", ""].map((h, i) => (
          <span key={i} className="field-label" style={{ marginBottom: 0 }}>
            {h}
          </span>
        ))}
      </div>

      {data.signOffs.map((so, index) => (
        <div
          key={so.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 130px 130px 36px",
            gap: 8,
            alignItems: "center",
            padding: 8,
            background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            marginBottom: 6,
          }}>
          <input className="field-input" value={so.role} onChange={(e) => updateSignOff(so.id, "role", e.target.value)} placeholder="e.g. Incident Commander" style={{ fontSize: 13, fontWeight: 500 }} />
          <input className="field-input" value={so.name} onChange={(e) => updateSignOff(so.id, "name", e.target.value)} placeholder="Full Name" style={{ fontSize: 13 }} />
          <input type="date" className="field-input" value={so.date} onChange={(e) => updateSignOff(so.id, "date", e.target.value)} style={{ fontSize: 13 }} />
          <input className="field-input" value={so.signoff} onChange={(e) => updateSignOff(so.id, "signoff", e.target.value)} placeholder="Approved" style={{ fontSize: 13 }} />
          <button className="btn-danger" onClick={() => removeSignOff(so.id)} disabled={data.signOffs.length <= 1} style={{ padding: 6, justifyContent: "center", opacity: data.signOffs.length <= 1 ? 0.3 : 1 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button className="btn-add" onClick={addSignOff}>
        <Plus size={15} /> Add Approver
      </button>
    </SectionCard>
  );
}
