"use client";

import { PostmortemData } from "@/types/postmortem";
import { TextArea, SectionCard, SubSection } from "./FormComponents";

interface Props {
  data: PostmortemData;
  onChange: (data: Partial<PostmortemData>) => void;
}

export function Section7({ data, onChange }: Props) {
  return (
    <SectionCard num="07" title="Resolution & Recovery" id="section-7">
      <SubSection title="7.1 Immediate Mitigation Steps">
        <TextArea
          label="Steps Taken"
          value={data.mitigationSteps}
          onChange={(v) => onChange({ mitigationSteps: v })}
          placeholder="Step 1 — Action taken and tool/command used&#10;Step 2 — Action taken and tool/command used&#10;Step 3 — Action taken and tool/command used"
          rows={5}
          hint="One step per line. Include specific commands, tools, or configs changed."
        />
      </SubSection>

      <SubSection title="7.2 Recovery Outcome">
        <TextArea
          label="Recovery Description"
          value={data.recoveryOutcome}
          onChange={(v) => onChange({ recoveryOutcome: v })}
          placeholder="Describe the final state: when the system returned to normal, what metrics confirmed recovery, and whether any follow-up monitoring was put in place. State clearly: no data loss / [quantify data impact]."
          rows={4}
        />
      </SubSection>

      <SubSection title="7.3 Long-Term Fix">
        <TextArea
          label="Permanent Fix & Architectural Changes"
          value={data.longTermFix}
          onChange={(v) => onChange({ longTermFix: v })}
          placeholder="• Describe the permanent fix or architectural change to prevent recurrence&#10;• Expected completion date and owner"
          rows={4}
          hint="One item per line."
        />
      </SubSection>
    </SectionCard>
  );
}
