"use client";

import { Plus, Trash2 } from "lucide-react";
import { PostmortemData, MetricRow } from "@/types/postmortem";
import { TextArea, SectionCard, SubSection } from "./FormComponents";
import { generateId } from "@/lib/defaults";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

export function Section5({ data, onChange }: Props) {
  const addMetric = () => {
    onChange({
      metrics: [...data.metrics, { id: generateId(), dimension: "", before: "", during: "" }],
    });
  };

  const updateMetric = (id: string, field: keyof MetricRow, value: string) => {
    onChange({
      metrics: data.metrics.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  const removeMetric = (id: string) => {
    onChange({ metrics: data.metrics.filter((m) => m.id !== id) });
  };

  return (
    <SectionCard num="05" title="Impact Assessment" id="section-5">
      <SubSection title="5.1 Service & User Impact">
        <TextArea
          label="Impact Description"
          value={data.serviceUserImpact}
          onChange={(v) => onChange({ serviceUserImpact: v })}
          placeholder="• Which services, features, or APIs were affected&#10;• User-facing symptoms (errors, slowness, unavailability)&#10;• Estimated number of affected users / % of traffic&#10;• Whether any SLA / SLO was breached&#10;• Any data loss, corruption, or exposure"
          rows={6}
          hint="Use each line as a bullet point (one per line)"
        />
      </SubSection>

      <SubSection title="5.2 System Metrics">
        <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 12, fontStyle: "italic" }}>Fill in observed values from your monitoring tool (Datadog, Grafana, Cloud Monitoring, etc.)</p>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 36px", gap: 8, padding: "6px 8px", marginBottom: 4 }}>
          {["Metric / Dimension", "Before Incident", "During Incident (Peak)", ""].map((h, i) => (
            <span key={i} className="field-label" style={{ marginBottom: 0 }}>
              {h}
            </span>
          ))}
        </div>

        {data.metrics.map((metric, index) => (
          <div
            key={metric.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 36px",
              gap: 8,
              alignItems: "center",
              padding: 8,
              background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius)",
              marginBottom: 6,
            }}>
            <input className="field-input" value={metric.dimension} onChange={(e) => updateMetric(metric.id, "dimension", e.target.value)} placeholder="e.g. Error Rate" style={{ fontSize: 13, fontWeight: 500 }} />
            <input className="field-input" value={metric.before} onChange={(e) => updateMetric(metric.id, "before", e.target.value)} placeholder="Normal / baseline" style={{ fontSize: 13 }} />
            <input className="field-input" value={metric.during} onChange={(e) => updateMetric(metric.id, "during", e.target.value)} placeholder="Peak / anomalous" style={{ fontSize: 13 }} />
            <button className="btn-danger" onClick={() => removeMetric(metric.id)} style={{ padding: 6, justifyContent: "center" }} title="Remove metric">
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        <button className="btn-add" onClick={addMetric}>
          <Plus size={15} /> Add Metric
        </button>
      </SubSection>
    </SectionCard>
  );
}
