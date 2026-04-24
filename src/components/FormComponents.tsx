"use client";

import React from "react";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export function Field({ label, value, onChange, placeholder, type = "text", required }: FieldProps) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span style={{ color: "var(--color-danger)" }}> *</span>}
      </label>
      <input type={type} className="field-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}

export function TextArea({ label, value, onChange, placeholder, rows = 4, hint }: TextAreaProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {hint && <p style={{ fontSize: 12, color: "var(--color-text-dim)", marginBottom: 6, fontStyle: "italic" }}>{hint}</p>}
      <textarea className="field-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ minHeight: rows * 24 }} />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select className="field-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SectionCardProps {
  num: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export function SectionCard({ num, title, children, id }: SectionCardProps) {
  return (
    <div className="section-card animate-in" id={id}>
      <div className="section-header">
        <span className="section-header-num">{num}</span>
        <span className="section-header-title">{title}</span>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SubSection({ title, children }: SubSectionProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--color-accent)",
          fontFamily: "var(--font-display)",
          marginBottom: 12,
          paddingBottom: 6,
          borderBottom: "1px solid var(--color-border)",
        }}>
        {title}
      </div>
      {children}
    </div>
  );
}
