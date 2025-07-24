import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("user"), // admin, supervisor, user
  supervisorId: integer("supervisor_id"), // reference to supervisor user
  institutionId: integer("institution_id"),
  emailNotifications: boolean("email_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // ministry, direction, department
  legalBasis: text("legal_basis"), // law, decree, ordinance
  sectorRegulations: text("sector_regulations").array(),
  size: text("size").notNull(), // large, medium, small
  logoUrl: text("logo_url"), // URL or path to institution logo
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  componentType: text("component_type").notNull(), // ambiente_control, evaluacion_riesgos, actividades_control, informacion_comunicacion, supervision
  status: text("status").notNull().default("not_started"), // not_started, in_progress, under_review, completed, observed
  progress: integer("progress").default(0), // 0-100
  institutionId: integer("institution_id").notNull(),
  assignedToId: integer("assigned_to_id"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workflowSteps = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  assignedToId: integer("assigned_to_id"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  workflowStepId: integer("workflow_step_id").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedById: integer("uploaded_by_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // workflow_completed, evidence_uploaded, user_assigned, etc.
  description: text("description").notNull(),
  userId: integer("user_id").notNull(),
  workflowId: integer("workflow_id"),
  institutionId: integer("institution_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceScores = pgTable("compliance_scores", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull(),
  componentType: text("component_type").notNull(),
  score: integer("score").notNull(), // 0-100
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const institutionDocuments = pgTable("institution_documents", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  documentType: text("document_type").notNull(), // creation_law, regulations, organigramma, policies, control_reports, etc.
  description: text("description"),
  uploadedById: integer("uploaded_by_id").notNull(),
  analyzedAt: timestamp("analyzed_at"),
  analysisResult: jsonb("analysis_result"), // AI analysis results
  createdAt: timestamp("created_at").defaultNow(),
});

export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g., "1.1", "2.3"
  requirement: text("requirement").notNull(),
  verificationQuestion: text("verification_question").notNull(),
  componentType: text("component_type").notNull(), // ambiente_control, evaluacion_riesgos, etc.
  standardNumber: integer("standard_number").default(1), // 1-17 for the 17 COSO standards
  createdAt: timestamp("created_at").defaultNow(),
});

export const checklistResponses = pgTable("checklist_responses", {
  id: serial("id").primaryKey(),
  checklistItemId: integer("checklist_item_id").notNull(),
  workflowId: integer("workflow_id").notNull(),
  institutionId: integer("institution_id").notNull(),
  response: text("response"), // user's text response
  status: text("status").notNull().default("pending"), // pending, compliant, non_compliant, partial
  linkedDocumentIds: integer("linked_document_ids").array().default([]),
  linkedEvidenceIds: integer("linked_evidence_ids").array().default([]),
  respondedById: integer("responded_by_id"),
  respondedAt: timestamp("responded_at"),
  reviewedById: integer("reviewed_by_id"),
  reviewedAt: timestamp("reviewed_at"),
  reviewComments: text("review_comments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const alertNotifications = pgTable("alert_notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // deadline_approaching, overdue, review_required, high_priority
  priority: text("priority").notNull().default("media"), // alta, media, baja
  institutionId: integer("institution_id").notNull(),
  workflowId: integer("workflow_id"),
  assignedToId: integer("assigned_to_id"),
  dueDate: timestamp("due_date"),
  isActive: boolean("is_active").default(true),
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nebusisIntegrations = pgTable("nebusis_integrations", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull(),
  integrationName: text("integration_name").notNull().default("NEBUSIS® Management System Wizard"),
  apiEndpoint: text("api_endpoint").notNull(),
  apiKey: text("api_key").notNull(),
  organizationId: text("organization_id").notNull(), // Organization ID in the external system
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  syncStatus: text("sync_status").default("pending"), // pending, syncing, completed, error
  syncSettings: jsonb("sync_settings").default({
    syncDocuments: true,
    syncPersonnel: true,
    syncOrganizationalStructure: true,
    syncPolicies: true,
    syncProcesses: false,
    autoSync: false,
    syncFrequency: "manual" // manual, daily, weekly
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const syncLogs = pgTable("sync_logs", {
  id: serial("id").primaryKey(),
  integrationId: integer("integration_id").notNull(),
  syncType: text("sync_type").notNull(), // documents, personnel, organizational_structure, policies
  direction: text("direction").notNull(), // import, export, bidirectional
  status: text("status").notNull(), // started, in_progress, completed, failed
  recordsProcessed: integer("records_processed").default(0),
  recordsSucceeded: integer("records_succeeded").default(0),
  recordsFailed: integer("records_failed").default(0),
  errorMessage: text("error_message"),
  syncDetails: jsonb("sync_details"), // Detailed log of what was synced
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// New table for institutional plans (PEI/POA)
export const institutionalPlans = pgTable("institutional_plans", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull(),
  planType: text("plan_type").notNull(), // "PEI" or "POA"
  planName: text("plan_name").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  uploadedById: integer("uploaded_by_id").notNull(),
  status: text("status").notNull().default("active"), // active, archived, draft
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New table for training records
export const trainingRecords = pgTable("training_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  institutionId: integer("institution_id").notNull(),
  trainingTitle: text("training_title").notNull(),
  trainingType: text("training_type").notNull(), // "curso", "taller", "seminario", "certificacion"
  trainingTopic: text("training_topic").notNull(), // "control_interno", "auditoria", "riesgos", "compliance"
  provider: text("provider"), // Training provider/institution
  duration: integer("duration"), // Duration in hours
  completionDate: timestamp("completion_date"),
  certificateFileName: text("certificate_file_name"),
  certificateFilePath: text("certificate_file_path"),
  certificateFileSize: integer("certificate_file_size"),
  certificateMimeType: text("certificate_mime_type"),
  status: text("status").notNull().default("completed"), // completed, in_progress, planned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// New table for audit reporting
export const cgrReports = pgTable("cgr_reports", {
  id: serial("id").primaryKey(),
  institutionId: integer("institution_id").notNull(),
  reportType: text("report_type").notNull(), // "cumplimiento", "autoevaluacion", "seguimiento"
  reportPeriod: text("report_period").notNull(), // "2024-Q1", "2024-Annual", etc.
  reportData: jsonb("report_data").notNull(),
  generatedById: integer("generated_by_id").notNull(),
  status: text("status").notNull().default("draft"), // draft, submitted, approved
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInstitutionSchema = createInsertSchema(institutions).omit({
  id: true,
  createdAt: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkflowStepSchema = createInsertSchema(workflowSteps).omit({
  id: true,
  createdAt: true,
});

export const insertEvidenceSchema = createInsertSchema(evidence).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertInstitutionDocumentSchema = createInsertSchema(institutionDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
  createdAt: true,
});

export const insertChecklistResponseSchema = createInsertSchema(checklistResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertNotificationSchema = createInsertSchema(alertNotifications).omit({
  id: true,
  createdAt: true,
});

export const insertNebusisIntegrationSchema = createInsertSchema(nebusisIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSyncLogSchema = createInsertSchema(syncLogs).omit({
  id: true,
  startedAt: true,
});

export const insertInstitutionalPlanSchema = createInsertSchema(institutionalPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingRecordSchema = createInsertSchema(trainingRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCgrReportSchema = createInsertSchema(cgrReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = z.infer<typeof insertInstitutionSchema>;
export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = z.infer<typeof insertWorkflowStepSchema>;
export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type ComplianceScore = typeof complianceScores.$inferSelect;
export type InstitutionDocument = typeof institutionDocuments.$inferSelect;
export type InsertInstitutionDocument = z.infer<typeof insertInstitutionDocumentSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistResponse = typeof checklistResponses.$inferSelect;
export type InsertChecklistResponse = z.infer<typeof insertChecklistResponseSchema>;
export type AlertNotification = typeof alertNotifications.$inferSelect;
export type InsertAlertNotification = z.infer<typeof insertAlertNotificationSchema>;
export type NebusisIntegration = typeof nebusisIntegrations.$inferSelect;
export type InsertNebusisIntegration = z.infer<typeof insertNebusisIntegrationSchema>;
export type SyncLog = typeof syncLogs.$inferSelect;
export type InsertSyncLog = z.infer<typeof insertSyncLogSchema>;
export type InstitutionalPlan = typeof institutionalPlans.$inferSelect;
export type InsertInstitutionalPlan = z.infer<typeof insertInstitutionalPlanSchema>;
export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type InsertTrainingRecord = z.infer<typeof insertTrainingRecordSchema>;
export type CgrReport = typeof cgrReports.$inferSelect;
export type InsertCgrReport = z.infer<typeof insertCgrReportSchema>;
