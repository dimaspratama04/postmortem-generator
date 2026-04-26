"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { PostmortemData, TimelineEntry } from "@/types/postmortem";
import { SectionCard } from "./FormComponents";
import { generateId } from "@/lib/defaults";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

export function Section4({ data, onChange }: Props) {
  const addRow = () => {
    onChange({
      timeline: [...data.timeline, { id: generateId(), time: "", actor: "", event: "" }],
    });
  };

  const updateRow = (id: string, field: keyof TimelineEntry, value: string) => {
    onChange({
      timeline: data.timeline.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    });
  };

  const removeRow = (id: string) => {
    onChange({ timeline: data.timeline.filter((row) => row.id !== id) });
  };

  return (
    <SectionCard num="04" title="Incident Timeline" id="section-4">
      <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 16, fontStyle: "italic" }}>List all key events chronologically. Include alert trigger, investigation steps, mitigation actions, and resolution.</p>

      {/* Table header */}
      <div className="md:flex md:justify-between" style={{ gap: 8, padding: "6px 8px", marginBottom: 4 }}>
        {["Time", "Actor", "Event / Action", ""].map((h, i) => (
          <span key={i} className="field-label" style={{ marginBottom: 0 }}>
            {h}
          </span>
        ))}
      </div>

      {data.timeline.map((entry, index) => (
        <div
          className="md:flex md:justify-between "
          key={entry.id}
          style={{
            // display: "grid",
            gridTemplateColumns: "100px 180px 1fr 36px",
            gap: 8,
            alignItems: "center",
            padding: "8px",
            background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            marginBottom: 6,
          }}>
          <input className="field-input" value={entry.time} onChange={(e) => updateRow(entry.id, "time", e.target.value)} placeholder="HH:MM" style={{ fontSize: 13 }} />
          <input className="field-input" value={entry.actor} onChange={(e) => updateRow(entry.id, "actor", e.target.value)} placeholder="Actor / Team" style={{ fontSize: 13 }} />
          <input className="field-input" value={entry.event} onChange={(e) => updateRow(entry.id, "event", e.target.value)} placeholder="Describe the event or action taken..." style={{ fontSize: 13 }} />
          <button className="btn-danger" onClick={() => removeRow(entry.id)} disabled={data.timeline.length <= 1} style={{ padding: "6px", justifyContent: "center", opacity: data.timeline.length <= 1 ? 0.3 : 1 }} title="Remove row">
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <button className="btn-add" onClick={addRow}>
        <Plus size={15} /> Add Timeline Entry
      </button>
    </SectionCard>
  );
}
