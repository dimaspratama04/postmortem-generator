'use client';

import { PostmortemData } from '@/types/postmortem';
import { TextArea, SectionCard } from './FormComponents';

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

export function Section2({ }: Props) {
  const levels = [
    { level: 'SEV-1', name: 'Critical', color: '#f87171', bg: 'rgba(239,68,68,0.1)', criteria: 'Full outage / data loss / security breach', response: 'Immediate all-hands; exec notification' },
    { level: 'SEV-2', name: 'High', color: '#fb923c', bg: 'rgba(249,115,22,0.1)', criteria: 'Major feature broken; significant user impact', response: 'On-call + lead notified within 15 min' },
    { level: 'SEV-3', name: 'Medium', color: '#fbbf24', bg: 'rgba(234,179,8,0.1)', criteria: 'Partial degradation; workaround available', response: 'On-call handles; fix within 24h' },
    { level: 'SEV-4', name: 'Low', color: '#34d399', bg: 'rgba(34,197,94,0.1)', criteria: 'Minor issue; minimal / no user impact', response: 'Ticket created; fix in next sprint' },
  ];

  return (
    <SectionCard num="02" title="Severity Reference Guide" id="section-2">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--color-surface2)' }}>
              {['Level', 'Name', 'Criteria', 'Response'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levels.map(l => (
              <tr key={l.level} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <span className="badge" style={{ background: l.bg, color: l.color, border: `1px solid ${l.color}40` }}>{l.level}</span>
                </td>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: l.color }}>{l.name}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{l.criteria}</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{l.response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 10, fontStyle: 'italic' }}>
        This table is for reference only. Severity was selected in Section 1.
      </p>
    </SectionCard>
  );
}

export function Section3({ data, onChange }: Props) {
  return (
    <SectionCard num="03" title="Executive Summary" id="section-3">
      <TextArea
        label="Summary"
        value={data.executiveSummary}
        onChange={v => onChange({ executiveSummary: v })}
        placeholder="On [date] at [time], [system/service] experienced [describe issue]. The incident lasted approximately [duration] and impacted [users/services]. The root cause was identified as [brief root cause]. The issue was resolved by [action taken]."
        rows={5}
        hint="2–4 sentences. Written for a non-technical audience. Cover: what happened, when, how long, impact, and resolution. No jargon."
      />
    </SectionCard>
  );
}