import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign } from "docx";
import { saveAs } from "file-saver";
import { PostmortemData } from "@/types/postmortem";

const CONTENT_WIDTH = 9360; // US Letter - 1" margins each side

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const headerShade = { fill: "1e1b4b", type: ShadingType.CLEAR };
const altShade = { fill: "f0f4ff", type: ShadingType.CLEAR };
const cellMargins = { top: 100, bottom: 100, left: 150, right: 150 };

function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: headerShade,
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })],
      }),
    ],
  });
}

function dataCell(text: string, width: number, shade = false): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shade ? altShade : { fill: "FFFFFF", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text: text || "—", size: 20 })] })],
  });
}

function labelCell(text: string, width: number): TableCell {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "e0eaff", type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })] })],
  });
}

function sectionHeading(text: string, level = HeadingLevel.HEADING_1): Paragraph {
  return new Paragraph({
    heading: level,
    children: [new TextRun({ text, bold: true })],
    spacing: { before: 300, after: 150 },
  });
}

function bodyParagraph(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: text || "—", size: 20 })],
    spacing: { after: 100 },
  });
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 20 })],
  });
}

export async function exportToDocx(data: PostmortemData): Promise<void> {
  const children: (Paragraph | Table)[] = [];

  // ── TITLE ──────────────────────────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [new TextRun({ text: "INCIDENT POSTMORTEM REPORT", bold: true, size: 36, color: "1e1b4b" })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: data.serviceSystem || "[Service / System Name]", size: 24, italics: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Incident Date: ${data.incidentDate}   |   Report Version: ${data.reportVersion}`, size: 20 })],
    }),
  );

  // ── SECTION 1: INCIDENT SNAPSHOT ──────────────────────
  children.push(sectionHeading("1. Incident Snapshot"));

  const snapshotRows = [
    ["Incident ID", data.incidentId],
    ["Status", data.status],
    ["Severity", data.severity],
    ["Start Time", data.startTime],
    ["End Time", data.endTime],
    ["Total Duration", data.totalDuration],
    ["Affected System(s)", data.affectedSystems],
    ["Affected Users", data.affectedUsers],
    ["Error Budget Impact", data.errorBudgetImpact],
    ["Incident Commander", data.incidentCommander],
    ["Communications Lead", data.communicationsLead],
    ["Scribe", data.scribe],
    ["Prepared By", data.preparedBy],
  ];

  const col1 = 2800;
  const col2 = CONTENT_WIDTH - col1;

  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [col1, col2],
      rows: snapshotRows.map(
        ([label, value], i) =>
          new TableRow({
            children: [labelCell(label, col1), dataCell(value, col2, i % 2 === 0)],
          }),
      ),
    }),
  );

  // ── SECTION 2: SEVERITY REFERENCE ──────────────────────
  children.push(sectionHeading("2. Severity Reference Guide"));

  const sevCols = [1440, 1440, 3600, 2880];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: sevCols,
      rows: [
        new TableRow({
          children: ["Level", "Name", "Criteria", "Response"].map((h, i) => headerCell(h, sevCols[i])),
        }),
        ...(
          [
            ["SEV-1", "Critical", "Full outage / data loss / security breach", "Immediate all-hands; exec notification"],
            ["SEV-2", "High", "Major feature broken; significant user impact", "On-call + lead notified within 15 min"],
            ["SEV-3", "Medium", "Partial degradation; workaround available", "On-call handles; fix within 24h"],
            ["SEV-4", "Low", "Minor issue; minimal / no user impact", "Ticket created; fix in next sprint"],
          ] as string[][]
        ).map((row, i) => new TableRow({ children: row.map((v, j) => dataCell(v, sevCols[j], i % 2 === 0)) })),
      ],
    }),
  );

  // ── SECTION 3: EXECUTIVE SUMMARY ──────────────────────
  children.push(sectionHeading("3. Executive Summary"));
  children.push(bodyParagraph(data.executiveSummary));

  // ── SECTION 4: TIMELINE ────────────────────────────────
  children.push(sectionHeading("4. Incident Timeline"));

  const timeCols = [1440, 2160, 5760];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: timeCols,
      rows: [
        new TableRow({ children: ["Time", "Actor", "Event / Action"].map((h, i) => headerCell(h, timeCols[i])) }),
        ...data.timeline.map(
          (entry, i) =>
            new TableRow({
              children: [dataCell(entry.time, timeCols[0], i % 2 === 0), dataCell(entry.actor, timeCols[1], i % 2 === 0), dataCell(entry.event, timeCols[2], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  // ── SECTION 5: IMPACT ─────────────────────────────────
  children.push(sectionHeading("5. Impact Assessment"));
  children.push(sectionHeading("5.1 Service & User Impact", HeadingLevel.HEADING_2));

  const impactLines = data.serviceUserImpact.split("\n").filter(Boolean);
  if (impactLines.length > 0) {
    impactLines.forEach((line) => children.push(bulletParagraph(line)));
  } else {
    children.push(bodyParagraph("—"));
  }

  children.push(sectionHeading("5.2 System Metrics", HeadingLevel.HEADING_2));

  const metricCols = [3600, 2880, 2880];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: metricCols,
      rows: [
        new TableRow({ children: ["Dimension", "Before Incident", "During Incident (Peak)"].map((h, i) => headerCell(h, metricCols[i])) }),
        ...data.metrics.map(
          (m, i) =>
            new TableRow({
              children: [labelCell(m.dimension, metricCols[0]), dataCell(m.before, metricCols[1], i % 2 === 0), dataCell(m.during, metricCols[2], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  // ── SECTION 6: RCA ────────────────────────────────────
  children.push(sectionHeading("6. Root Cause Analysis"));
  children.push(sectionHeading("6.1 Primary Root Cause", HeadingLevel.HEADING_2));
  children.push(bodyParagraph(data.primaryRootCause));

  children.push(sectionHeading("6.2 Five Whys Analysis", HeadingLevel.HEADING_2));
  const fiveCols = [720, 4320, 4320];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: fiveCols,
      rows: [
        new TableRow({ children: ["#", "Why?", "Answer"].map((h, i) => headerCell(h, fiveCols[i])) }),
        ...data.fiveWhys.map(
          (row, i) =>
            new TableRow({
              children: [dataCell(`${i + 1}`, fiveCols[0], i % 2 === 0), dataCell(row.why, fiveCols[1], i % 2 === 0), dataCell(row.answer, fiveCols[2], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  children.push(sectionHeading("6.3 Contributing Factors", HeadingLevel.HEADING_2));
  const contribCols = [2000, CONTENT_WIDTH - 2000];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: contribCols,
      rows: [
        new TableRow({ children: ["Category", "Description"].map((h, i) => headerCell(h, contribCols[i])) }),
        ...[
          ["People", data.contributingPeople],
          ["Process", data.contributingProcess],
          ["Technology", data.contributingTechnology],
          ["Environment", data.contributingEnvironment],
        ].map(
          ([label, value], i) =>
            new TableRow({
              children: [labelCell(label, contribCols[0]), dataCell(value, contribCols[1], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  // ── SECTION 7: RESOLUTION ─────────────────────────────
  children.push(sectionHeading("7. Resolution & Recovery"));
  children.push(sectionHeading("7.1 Immediate Mitigation Steps", HeadingLevel.HEADING_2));
  const mitSteps = data.mitigationSteps.split("\n").filter(Boolean);
  if (mitSteps.length > 0) {
    mitSteps.forEach((step) => children.push(bulletParagraph(step)));
  } else {
    children.push(bodyParagraph("—"));
  }

  children.push(sectionHeading("7.2 Recovery Outcome", HeadingLevel.HEADING_2));
  children.push(bodyParagraph(data.recoveryOutcome));

  children.push(sectionHeading("7.3 Long-Term Fix", HeadingLevel.HEADING_2));
  const ltfLines = data.longTermFix.split("\n").filter(Boolean);
  if (ltfLines.length > 0) {
    ltfLines.forEach((line) => children.push(bulletParagraph(line)));
  } else {
    children.push(bodyParagraph("—"));
  }

  // ── SECTION 8: ACTION ITEMS ───────────────────────────
  children.push(sectionHeading("8. Action Items & Preventive Measures"));
  const aiCols = [720, 720, 2880, 1440, 1080, 1080, 720, 720];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: aiCols,
      rows: [
        new TableRow({ children: ["#", "ID", "Action Item", "Owner", "Due Date", "Priority", "Type", "Status"].map((h, i) => headerCell(h, aiCols[i])) }),
        ...data.actionItems.map(
          (ai, i) =>
            new TableRow({
              children: [
                dataCell(`${i + 1}`, aiCols[0], i % 2 === 0),
                dataCell(ai.actionId, aiCols[1], i % 2 === 0),
                dataCell(ai.description, aiCols[2], i % 2 === 0),
                dataCell(ai.owner, aiCols[3], i % 2 === 0),
                dataCell(ai.dueDate, aiCols[4], i % 2 === 0),
                dataCell(ai.priority, aiCols[5], i % 2 === 0),
                dataCell(ai.type, aiCols[6], i % 2 === 0),
                dataCell(ai.status, aiCols[7], i % 2 === 0),
              ],
            }),
        ),
      ],
    }),
  );

  // ── SECTION 9: LESSONS LEARNED ────────────────────────
  children.push(sectionHeading("9. Lessons Learned"));
  const llCols = [2200, CONTENT_WIDTH - 2200];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: llCols,
      rows: [
        new TableRow({ children: ["Category", "Details"].map((h, i) => headerCell(h, llCols[i])) }),
        ...(
          [
            ["What Went Well", data.whatWentWell],
            ["What Could Be Improved", data.whatCouldImprove],
            ["Lucky Factors", data.luckyFactors],
            ["Surprises", data.surprises],
          ] as [string, string][]
        ).map(([label, value], i) => new TableRow({ children: [labelCell(label, llCols[0]), dataCell(value, llCols[1], i % 2 === 0)] })),
      ],
    }),
  );

  // ── SECTION 10: COMMUNICATION LOG ────────────────────
  children.push(sectionHeading("10. Communication Log"));
  children.push(sectionHeading("10.1 Internal Notifications", HeadingLevel.HEADING_2));
  const commCols = [1200, 2400, 5760];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: commCols,
      rows: [
        new TableRow({ children: ["Time", "Channel / Audience", "Message Summary"].map((h, i) => headerCell(h, commCols[i])) }),
        ...data.internalComms.map(
          (c, i) =>
            new TableRow({
              children: [dataCell(c.time, commCols[0], i % 2 === 0), dataCell(c.channel, commCols[1], i % 2 === 0), dataCell(c.summary, commCols[2], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  children.push(sectionHeading("10.2 External / Customer Communication", HeadingLevel.HEADING_2));
  const extLines = data.externalComms.split("\n").filter(Boolean);
  if (extLines.length > 0) {
    extLines.forEach((line) => children.push(bulletParagraph(line)));
  } else {
    children.push(bodyParagraph("—"));
  }

  // ── SECTION 11: SIGN-OFF ──────────────────────────────
  children.push(sectionHeading("11. Sign-Off & Approval"));
  const soCols = [2400, 2400, 2160, 2400];
  children.push(
    new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: soCols,
      rows: [
        new TableRow({ children: ["Role", "Name", "Date", "Sign-off"].map((h, i) => headerCell(h, soCols[i])) }),
        ...data.signOffs.map(
          (so, i) =>
            new TableRow({
              children: [labelCell(so.role, soCols[0]), dataCell(so.name, soCols[1], i % 2 === 0), dataCell(so.date, soCols[2], i % 2 === 0), dataCell(so.signoff, soCols[3], i % 2 === 0)],
            }),
        ),
      ],
    }),
  );

  // Footer note
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [new TextRun({ text: "CONFIDENTIAL — INTERNAL USE ONLY  |  SRE / DevOps Team", size: 16, color: "888888", italics: true })],
    }),
  );

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, font: "Calibri", color: "1e1b4b" },
          paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 24, bold: true, font: "Calibri", color: "4338ca" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const filename = `Postmortem_${data.incidentId || "Report"}_${data.incidentDate}.docx`;
  saveAs(blob, filename);
}
