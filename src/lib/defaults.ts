import { PostmortemData } from "@/types/postmortem";
import { format } from "date-fns";

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getDefaultData(): PostmortemData {
  const today = format(new Date(), "yyyy-MM-dd");
  const now = format(new Date(), "HH:mm");

  return {
    serviceSystem: "",
    incidentDate: today,
    reportVersion: "v1.0",

    incidentId: `INC-${format(new Date(), "yyyy-MMdd")}-001`,
    status: "RESOLVED",
    severity: "SEV-2",
    startTime: "",
    endTime: "",
    totalDuration: "",
    affectedSystems: "",
    affectedUsers: "",
    errorBudgetImpact: "",
    incidentCommander: "",
    communicationsLead: "",
    scribe: "",
    preparedBy: "",

    executiveSummary: "",

    timeline: [
      { id: generateId(), time: "", actor: "Monitoring / Alert", event: "Alert fires." },
      { id: generateId(), time: "", actor: "On-Call Engineer", event: "Incident acknowledged. Initial investigation begins." },
      { id: generateId(), time: "", actor: "SRE / Dev Team", event: "Root cause hypothesis formed." },
      { id: generateId(), time: "", actor: "SRE / Dev Team", event: "Mitigation applied." },
      { id: generateId(), time: "", actor: "Incident Commander", event: "Incident declared resolved." },
    ],

    serviceUserImpact: "",
    metrics: [
      { id: generateId(), dimension: "Error Rate", before: "", during: "" },
      { id: generateId(), dimension: "Latency (p99)", before: "", during: "" },
      { id: generateId(), dimension: "Throughput (RPS)", before: "", during: "" },
      { id: generateId(), dimension: "CPU Utilization", before: "", during: "" },
      { id: generateId(), dimension: "Memory Utilization", before: "", during: "" },
      { id: generateId(), dimension: "Active Connections", before: "", during: "" },
    ],

    primaryRootCause: "",
    whyAnalysis: [
      { id: generateId(), why: "Why did this happen?", answer: "" },
      { id: generateId(), why: "Why did that happen?", answer: "" },
      { id: generateId(), why: "Why did that happen?", answer: "" },
    ],
    rootCauseStatement: "",
    contributingPeople: "",
    contributingProcess: "",
    contributingTechnology: "",
    contributingEnvironment: "",

    mitigationSteps: "",
    recoveryOutcome: "",
    longTermFix: "",

    actionItems: [
      { id: generateId(), actionId: "AI-001", description: "", owner: "", dueDate: "", priority: "HIGH", type: "Prevent", status: "Open" },
      { id: generateId(), actionId: "AI-002", description: "", owner: "", dueDate: "", priority: "HIGH", type: "Detect", status: "Open" },
      { id: generateId(), actionId: "AI-003", description: "", owner: "", dueDate: "", priority: "MEDIUM", type: "Mitigate", status: "Open" },
    ],

    whatWentWell: "",
    whatCouldImprove: "",
    luckyFactors: "",
    surprises: "",

    internalComms: [{ id: generateId(), time: "", channel: "", summary: "" }],
    externalComms: "",

    signOffs: [
      { id: generateId(), role: "Incident Commander", name: "", date: today, signoff: "" },
      { id: generateId(), role: "SRE / DevOps Lead", name: "", date: today, signoff: "" },
      { id: generateId(), role: "Engineering Manager", name: "", date: today, signoff: "" },
    ],
  };
}
