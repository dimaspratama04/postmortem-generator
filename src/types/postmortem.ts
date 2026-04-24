export type Severity = "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";
export type Status = "RESOLVED" | "ONGOING" | "MONITORING";
export type ActionPriority = "HIGH" | "MEDIUM" | "LOW";
export type ActionType = "Prevent" | "Detect" | "Mitigate" | "Process" | "Monitor";
export type ActionStatus = "Open" | "In Progress" | "Done" | "Cancelled";

export interface TimelineEntry {
  id: string;
  time: string;
  actor: string;
  event: string;
}

export interface MetricRow {
  id: string;
  dimension: string;
  before: string;
  during: string;
}

export interface whyAnalysisRow {
  id: string;
  why: string;
  answer: string;
}

export interface ActionItem {
  id: string;
  actionId: string;
  description: string;
  owner: string;
  dueDate: string;
  priority: ActionPriority;
  type: ActionType;
  status: ActionStatus;
}

export interface CommLog {
  id: string;
  time: string;
  channel: string;
  summary: string;
}

export interface SignOff {
  id: string;
  role: string;
  name: string;
  date: string;
  signoff: string;
}

export interface PostmortemData {
  // Header
  serviceSystem: string;
  incidentDate: string;
  reportVersion: string;

  // Section 1: Incident Snapshot
  incidentId: string;
  status: Status;
  severity: Severity;
  startTime: string;
  endTime: string;
  totalDuration: string;
  affectedSystems: string;
  affectedUsers: string;
  errorBudgetImpact: string;
  incidentCommander: string;
  communicationsLead: string;
  scribe: string;
  preparedBy: string;

  // Section 3: Executive Summary
  executiveSummary: string;

  // Section 4: Timeline
  timeline: TimelineEntry[];

  // Section 5: Impact Assessment
  serviceUserImpact: string;
  metrics: MetricRow[];

  // Section 6: RCA
  primaryRootCause: string;
  whyAnalysis: whyAnalysisRow[];
  rootCauseStatement: string;
  contributingPeople: string;
  contributingProcess: string;
  contributingTechnology: string;
  contributingEnvironment: string;

  // Section 7: Resolution
  mitigationSteps: string;
  recoveryOutcome: string;
  longTermFix: string;

  // Section 8: Action Items
  actionItems: ActionItem[];

  // Section 9: Lessons Learned
  whatWentWell: string;
  whatCouldImprove: string;
  luckyFactors: string;
  surprises: string;

  // Section 10: Communication Log
  internalComms: CommLog[];
  externalComms: string;

  // Section 11: Sign-Off
  signOffs: SignOff[];
}
