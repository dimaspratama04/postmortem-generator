'use client';

import { PostmortemData, Severity, Status } from '@/types/postmortem';
import { Field, SelectField, SectionCard } from './FormComponents';

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

const statusOptions = [
  { value: 'RESOLVED', label: 'RESOLVED' },
  { value: 'ONGOING', label: 'ONGOING' },
  { value: 'MONITORING', label: 'MONITORING' },
];

const severityOptions = [
  { value: 'SEV-1', label: 'SEV-1 — Critical' },
  { value: 'SEV-2', label: 'SEV-2 — High' },
  { value: 'SEV-3', label: 'SEV-3 — Medium' },
  { value: 'SEV-4', label: 'SEV-4 — Low' },
];

export function Section1({ data, onChange }: Props) {
  return (
    <SectionCard num="01" title="Incident Snapshot" id="section-1">
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Service / System Name" value={data.serviceSystem} onChange={v => onChange({ serviceSystem: v })} placeholder="e.g. Payment API" required />
        <Field label="Incident Date" value={data.incidentDate} onChange={v => onChange({ incidentDate: v })} type="date" required />
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Incident ID" value={data.incidentId} onChange={v => onChange({ incidentId: v })} placeholder="INC-2024-0101-001" />
        <Field label="Report Version" value={data.reportVersion} onChange={v => onChange({ reportVersion: v })} placeholder="v1.0" />
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <SelectField label="Status" value={data.status} onChange={v => onChange({ status: v as Status })} options={statusOptions} />
        <SelectField label="Severity" value={data.severity} onChange={v => onChange({ severity: v as Severity })} options={severityOptions} />
      </div>
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <Field label="Start Time" value={data.startTime} onChange={v => onChange({ startTime: v })} placeholder="2024-01-01 14:00 WIB" />
        <Field label="End Time" value={data.endTime} onChange={v => onChange({ endTime: v })} placeholder="2024-01-01 16:30 WIB" />
        <Field label="Total Duration" value={data.totalDuration} onChange={v => onChange({ totalDuration: v })} placeholder="2 hours 30 minutes" />
      </div>
      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Field label="Affected System(s)" value={data.affectedSystems} onChange={v => onChange({ affectedSystems: v })} placeholder="Payment API, Database, Region AP-SE" />
        <Field label="Affected Users" value={data.affectedUsers} onChange={v => onChange({ affectedUsers: v })} placeholder="~5,000 users / 30% of traffic" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Field label="Error Budget Impact" value={data.errorBudgetImpact} onChange={v => onChange({ errorBudgetImpact: v })} placeholder="12% consumed out of monthly budget" />
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, marginTop: 4 }}>
        <p className="field-label" style={{ marginBottom: 14 }}>Incident Team</p>
        <div className="grid-2" style={{ marginBottom: 12 }}>
          <Field label="Incident Commander" value={data.incidentCommander} onChange={v => onChange({ incidentCommander: v })} placeholder="Full Name" />
          <Field label="Communications Lead" value={data.communicationsLead} onChange={v => onChange({ communicationsLead: v })} placeholder="Full Name" />
        </div>
        <div className="grid-2">
          <Field label="Scribe" value={data.scribe} onChange={v => onChange({ scribe: v })} placeholder="Full Name" />
          <Field label="Prepared By" value={data.preparedBy} onChange={v => onChange({ preparedBy: v })} placeholder="Name / Team" />
        </div>
      </div>
    </SectionCard>
  );
}