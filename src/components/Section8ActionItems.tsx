"use client";

import { Plus, Trash2 } from "lucide-react";
import { PostmortemData, ActionItem, ActionPriority, ActionType, ActionStatus } from "@/types/postmortem";
import { SectionCard } from "./FormComponents";
import { generateId } from "@/lib/defaults";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

const priorityColors: Record<ActionPriority, string> = {
  HIGH: "#f87171",
  MEDIUM: "#fbbf24",
  LOW: "#34d399",
};

const statusColors: Record<ActionStatus, string> = {
  Open: "#6366f1",
  "In Progress": "#f97316",
  Done: "#34d399",
  Cancelled: "#94a3b8",
};

const typeOptions: ActionType[] = ["Prevent", "Detect", "Mitigate", "Process", "Monitor"];
const priorityOptions: ActionPriority[] = ["HIGH", "MEDIUM", "LOW"];
const statusOptions: ActionStatus[] = ["Open", "In Progress", "Done", "Cancelled"];

export function Section8({ data, onChange }: Props) {
  const addItem = () => {
    const nextNum = data.actionItems.length + 1;
    onChange({
      actionItems: [
        ...data.actionItems,
        {
          id: generateId(),
          actionId: `AI-${String(nextNum).padStart(3, "0")}`,
          description: "",
          owner: "",
          dueDate: "",
          priority: "MEDIUM",
          type: "Prevent",
          status: "Open",
        },
      ],
    });
  };

  const updateItem = (id: string, field: keyof ActionItem, value: string) => {
    onChange({
      actionItems: data.actionItems.map((ai) => (ai.id === id ? { ...ai, [field]: value } : ai)),
    });
  };

  const removeItem = (id: string) => {
    onChange({ actionItems: data.actionItems.filter((ai) => ai.id !== id) });
  };

  return (
    <SectionCard num="08" title="Action Items & Preventive Measures" id="section-8">
      <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 16, fontStyle: "italic" }}>
        Types: <strong style={{ color: "var(--color-text-muted)" }}>Prevent</strong> (stop recurrence) · <strong style={{ color: "var(--color-text-muted)" }}>Detect</strong> (improve alerting) ·{" "}
        <strong style={{ color: "var(--color-text-muted)" }}>Mitigate</strong> (reduce blast radius) · <strong style={{ color: "var(--color-text-muted)" }}>Process</strong> (fix team behavior) ·{" "}
        <strong style={{ color: "var(--color-text-muted)" }}>Monitor</strong> (add observability)
      </p>

      {data.actionItems.map((ai, index) => (
        <div
          key={ai.id}
          style={{
            padding: 14,
            background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            marginBottom: 8,
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            {/* ID */}
            <input className="field-input" value={ai.actionId} onChange={(e) => updateItem(ai.id, "actionId", e.target.value)} style={{ width: 80, fontSize: 13, fontFamily: "var(--font-mono)", flexShrink: 0 }} />
            {/* Description */}
            <input className="field-input" value={ai.description} onChange={(e) => updateItem(ai.id, "description", e.target.value)} placeholder="Describe the action clearly and measurably..." style={{ fontSize: 13, flex: 1 }} />
            <button className="btn-danger" onClick={() => removeItem(ai.id)} style={{ padding: 6, justifyContent: "center", flexShrink: 0 }}>
              <Trash2 size={13} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 110px 130px 120px", gap: 8, paddingLeft: 88 }}>
            {/* Owner */}
            <input className="field-input" value={ai.owner} onChange={(e) => updateItem(ai.id, "owner", e.target.value)} placeholder="Owner / Team" style={{ fontSize: 12 }} />
            {/* Due Date */}
            <input type="date" className="field-input" value={ai.dueDate} onChange={(e) => updateItem(ai.id, "dueDate", e.target.value)} style={{ fontSize: 12 }} />
            {/* Priority */}
            <select className="field-input" value={ai.priority} onChange={(e) => updateItem(ai.id, "priority", e.target.value)} style={{ fontSize: 12, color: priorityColors[ai.priority as ActionPriority] }}>
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {/* Type */}
            <select className="field-input" value={ai.type} onChange={(e) => updateItem(ai.id, "type", e.target.value)} style={{ fontSize: 12 }}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {/* Status */}
            <select className="field-input" value={ai.status} onChange={(e) => updateItem(ai.id, "status", e.target.value)} style={{ fontSize: 12, color: statusColors[ai.status as ActionStatus] }}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addItem}>
        <Plus size={15} /> Add Action Item
      </button>
    </SectionCard>
  );
}
