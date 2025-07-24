import { 
  users, institutions, workflows, workflowSteps, evidence, activities, complianceScores, institutionDocuments,
  checklistItems, checklistResponses, alertNotifications, nebusisIntegrations, syncLogs,
  institutionalPlans, trainingRecords, cgrReports,
  type User, type InsertUser, type Institution, type InsertInstitution,
  type Workflow, type InsertWorkflow, type WorkflowStep, type InsertWorkflowStep,
  type Evidence, type InsertEvidence, type Activity, type InsertActivity,
  type ComplianceScore, type InstitutionDocument, type InsertInstitutionDocument,
  type ChecklistItem, type InsertChecklistItem, type ChecklistResponse, type InsertChecklistResponse,
  type AlertNotification, type InsertAlertNotification, type NebusisIntegration, type InsertNebusisIntegration,
  type SyncLog, type InsertSyncLog, type InstitutionalPlan, type InsertInstitutionalPlan,
  type TrainingRecord, type InsertTrainingRecord, type CgrReport, type InsertCgrReport
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Institutions
  getInstitution(id: number): Promise<Institution | undefined>;
  createInstitution(institution: InsertInstitution): Promise<Institution>;
  
  // Workflows
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByInstitution(institutionId: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined>;
  
  // Workflow Steps
  getWorkflowSteps(workflowId: number): Promise<WorkflowStep[]>;
  createWorkflowStep(step: InsertWorkflowStep): Promise<WorkflowStep>;
  updateWorkflowStep(id: number, updates: Partial<WorkflowStep>): Promise<WorkflowStep | undefined>;
  
  // Evidence
  getEvidenceByStep(stepId: number): Promise<Evidence[]>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
  
  // Activities
  getRecentActivities(institutionId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Compliance Scores
  getComplianceScores(institutionId: number): Promise<ComplianceScore[]>;
  updateComplianceScore(institutionId: number, componentType: string, score: number): Promise<ComplianceScore>;
  
  // Dashboard Stats
  getDashboardStats(institutionId: number): Promise<{
    activeWorkflows: number;
    completedWorkflows: number;
    underReview: number;
    overallProgress: number;
  }>;

  // Institution Documents
  getInstitutionDocuments(institutionId: number): Promise<InstitutionDocument[]>;
  createInstitutionDocument(document: InsertInstitutionDocument): Promise<InstitutionDocument>;
  deleteInstitutionDocument(id: number): Promise<boolean>;
  getInstitutionDocumentsByType(institutionId: number, documentType: string): Promise<InstitutionDocument[]>;

  // Checklist Items
  getChecklistItems(): Promise<ChecklistItem[]>;
  getChecklistItemsByComponent(componentType: string): Promise<ChecklistItem[]>;
  createChecklistItem(item: InsertChecklistItem): Promise<ChecklistItem>;

  // Checklist Responses
  getChecklistResponses(workflowId: number): Promise<ChecklistResponse[]>;
  getChecklistResponse(checklistItemId: number, workflowId: number): Promise<ChecklistResponse | undefined>;
  createChecklistResponse(response: InsertChecklistResponse): Promise<ChecklistResponse>;
  updateChecklistResponse(id: number, updates: Partial<ChecklistResponse>): Promise<ChecklistResponse | undefined>;

  // Alert Notifications
  getActiveAlerts(institutionId: number, workflowId?: number): Promise<AlertNotification[]>;
  createAlertNotification(alert: InsertAlertNotification): Promise<AlertNotification>;
  markAlertEmailSent(alertId: number): Promise<void>;
  getUsersByInstitution(institutionId: number): Promise<User[]>;
  getAllInstitutions(): Promise<Institution[]>;

  // NEBUSIS® Management System Wizard Integration
  getNebusisIntegration(institutionId: number): Promise<NebusisIntegration | undefined>;
  createNebusisIntegration(integration: InsertNebusisIntegration): Promise<NebusisIntegration>;
  updateNebusisIntegration(id: number, updates: Partial<NebusisIntegration>): Promise<NebusisIntegration | undefined>;
  deleteNebusisIntegration(id: number): Promise<boolean>;
  getSyncLogs(integrationId: number, limit?: number): Promise<SyncLog[]>;
  createSyncLog(log: InsertSyncLog): Promise<SyncLog>;
  updateSyncLog(id: number, updates: Partial<SyncLog>): Promise<SyncLog | undefined>;

  // Institutional Plans
  getInstitutionalPlans(institutionId: number): Promise<InstitutionalPlan[]>;
  createInstitutionalPlan(plan: InsertInstitutionalPlan): Promise<InstitutionalPlan>;
  updateInstitutionalPlan(id: number, updates: Partial<InstitutionalPlan>): Promise<InstitutionalPlan | undefined>;
  deleteInstitutionalPlan(id: number): Promise<boolean>;

  // Training Records
  getTrainingRecords(institutionId: number): Promise<TrainingRecord[]>;
  createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord>;
  updateTrainingRecord(id: number, updates: Partial<TrainingRecord>): Promise<TrainingRecord | undefined>;
  deleteTrainingRecord(id: number): Promise<boolean>;
  getTrainingStats(institutionId: number): Promise<{
    totalTrainings: number;
    completedTrainings: number;
    inProgressTrainings: number;
    totalHours: number;
    topicDistribution: { [key: string]: number };
  }>;

  // Audit Reports
  getCgrReports(institutionId: number): Promise<CgrReport[]>;
  createCgrReport(report: InsertCgrReport): Promise<CgrReport>;
  updateCgrReport(id: number, updates: Partial<CgrReport>): Promise<CgrReport | undefined>;
  deleteCgrReport(id: number): Promise<boolean>;
  submitCgrReport(id: number): Promise<CgrReport | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private institutions: Map<number, Institution> = new Map();
  private workflows: Map<number, Workflow> = new Map();
  private workflowSteps: Map<number, WorkflowStep> = new Map();
  private evidence: Map<number, Evidence> = new Map();
  private activities: Map<number, Activity> = new Map();
  private complianceScores: Map<number, ComplianceScore> = new Map();
  private institutionDocuments: Map<number, InstitutionDocument> = new Map();
  
  private currentUserId = 1;
  private currentInstitutionId = 1;
  private currentWorkflowId = 1;
  private currentStepId = 1;
  private currentEvidenceId = 1;
  private currentActivityId = 1;
  private currentScoreId = 1;
  private currentDocumentId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo institution
    const institution: Institution = {
      id: this.currentInstitutionId++,
      name: "Ministerio de Hacienda",
      type: "ministry",
      legalBasis: "Ley 10-07",
      sectorRegulations: ["COSO", "COSO 2013"],
      size: "large",
      createdAt: new Date(),
    };
    this.institutions.set(institution.id, institution);

    // Create demo user
    const user: User = {
      id: this.currentUserId++,
      email: "ana.rodriguez@hacienda.gob.do",
      firstName: "Ana",
      lastName: "Rodríguez",
      role: "admin",
      institutionId: institution.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);

    // Create demo workflows
    const workflows: Workflow[] = [
      {
        id: this.currentWorkflowId++,
        name: "Ambiente de Control",
        description: "Implementación de políticas y procedimientos de ambiente de control",
        componentType: "ambiente_control",
        status: "completed",
        progress: 100,
        institutionId: institution.id,
        assignedToId: user.id,
        dueDate: new Date("2024-02-28"),
        completedAt: new Date("2024-02-15"),
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-02-15"),
      },
      {
        id: this.currentWorkflowId++,
        name: "Evaluación de Riesgos",
        description: "Identificación y análisis de riesgos operativos",
        componentType: "evaluacion_riesgos",
        status: "in_progress",
        progress: 75,
        institutionId: institution.id,
        assignedToId: user.id,
        dueDate: new Date("2024-03-15"),
        completedAt: null,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-20"),
      },
      {
        id: this.currentWorkflowId++,
        name: "Actividades de Control",
        description: "Establecimiento de controles operativos",
        componentType: "actividades_control",
        status: "not_started",
        progress: 0,
        institutionId: institution.id,
        assignedToId: null,
        dueDate: new Date("2024-03-30"),
        completedAt: null,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10"),
      },
    ];

    workflows.forEach(workflow => this.workflows.set(workflow.id, workflow));

    // Create demo activities
    const activities: Activity[] = [
      {
        id: this.currentActivityId++,
        type: "workflow_completed",
        description: "completó el flujo de trabajo \"Ambiente de Control\"",
        userId: user.id,
        workflowId: 1,
        institutionId: institution.id,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: this.currentActivityId++,
        type: "evidence_uploaded",
        description: "subió evidencia para \"Evaluación de Riesgos\"",
        userId: user.id,
        workflowId: 2,
        institutionId: institution.id,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      }
    ];

    activities.forEach(activity => this.activities.set(activity.id, activity));

    // Create compliance scores
    const scores: ComplianceScore[] = [
      {
        id: this.currentScoreId++,
        institutionId: institution.id,
        componentType: "ambiente_control",
        score: 100,
        calculatedAt: new Date(),
      },
      {
        id: this.currentScoreId++,
        institutionId: institution.id,
        componentType: "evaluacion_riesgos",
        score: 75,
        calculatedAt: new Date(),
      },
    ];

    scores.forEach(score => this.complianceScores.set(score.id, score));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getInstitution(id: number): Promise<Institution | undefined> {
    return this.institutions.get(id);
  }

  async createInstitution(insertInstitution: InsertInstitution): Promise<Institution> {
    const institution: Institution = {
      ...insertInstitution,
      id: this.currentInstitutionId++,
      createdAt: new Date(),
    };
    this.institutions.set(institution.id, institution);
    return institution;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflowsByInstitution(institutionId: number): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(
      workflow => workflow.institutionId === institutionId
    );
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const workflow: Workflow = {
      ...insertWorkflow,
      id: this.currentWorkflowId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const workflow = this.workflows.get(id);
    if (!workflow) return undefined;
    
    const updated = { ...workflow, ...updates, updatedAt: new Date() };
    this.workflows.set(id, updated);
    return updated;
  }

  async getWorkflowSteps(workflowId: number): Promise<WorkflowStep[]> {
    return Array.from(this.workflowSteps.values())
      .filter(step => step.workflowId === workflowId)
      .sort((a, b) => a.order - b.order);
  }

  async createWorkflowStep(insertStep: InsertWorkflowStep): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      ...insertStep,
      id: this.currentStepId++,
      createdAt: new Date(),
    };
    this.workflowSteps.set(step.id, step);
    return step;
  }

  async updateWorkflowStep(id: number, updates: Partial<WorkflowStep>): Promise<WorkflowStep | undefined> {
    const step = this.workflowSteps.get(id);
    if (!step) return undefined;
    
    const updated = { ...step, ...updates };
    this.workflowSteps.set(id, updated);
    return updated;
  }

  async getEvidenceByStep(stepId: number): Promise<Evidence[]> {
    return Array.from(this.evidence.values()).filter(
      evidence => evidence.workflowStepId === stepId
    );
  }

  async createEvidence(insertEvidence: InsertEvidence): Promise<Evidence> {
    const evidence: Evidence = {
      ...insertEvidence,
      id: this.currentEvidenceId++,
      createdAt: new Date(),
    };
    this.evidence.set(evidence.id, evidence);
    return evidence;
  }

  async getRecentActivities(institutionId: number, limit = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.institutionId === institutionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      ...insertActivity,
      id: this.currentActivityId++,
      createdAt: new Date(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  async getComplianceScores(institutionId: number): Promise<ComplianceScore[]> {
    return Array.from(this.complianceScores.values()).filter(
      score => score.institutionId === institutionId
    );
  }

  async updateComplianceScore(institutionId: number, componentType: string, score: number): Promise<ComplianceScore> {
    const existing = Array.from(this.complianceScores.values()).find(
      s => s.institutionId === institutionId && s.componentType === componentType
    );

    if (existing) {
      const updated = { ...existing, score, calculatedAt: new Date() };
      this.complianceScores.set(existing.id, updated);
      return updated;
    } else {
      const newScore: ComplianceScore = {
        id: this.currentScoreId++,
        institutionId,
        componentType,
        score,
        calculatedAt: new Date(),
      };
      this.complianceScores.set(newScore.id, newScore);
      return newScore;
    }
  }

  async getDashboardStats(institutionId: number): Promise<{
    activeWorkflows: number;
    completedWorkflows: number;
    underReview: number;
    overallProgress: number;
  }> {
    const workflows = await this.getWorkflowsByInstitution(institutionId);
    
    const activeWorkflows = workflows.filter(w => w.status === "in_progress").length;
    const completedWorkflows = workflows.filter(w => w.status === "completed").length;
    const underReview = workflows.filter(w => w.status === "under_review").length;
    
    const totalProgress = workflows.reduce((sum, w) => sum + w.progress, 0);
    const overallProgress = workflows.length > 0 ? Math.round(totalProgress / workflows.length) : 0;

    return {
      activeWorkflows,
      completedWorkflows,
      underReview,
      overallProgress,
    };
  }

  async getInstitutionDocuments(institutionId: number): Promise<InstitutionDocument[]> {
    return Array.from(this.institutionDocuments.values())
      .filter(doc => doc.institutionId === institutionId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createInstitutionDocument(insertDocument: InsertInstitutionDocument): Promise<InstitutionDocument> {
    const document: InstitutionDocument = {
      ...insertDocument,
      id: this.currentDocumentId++,
      createdAt: new Date(),
      analyzedAt: null,
      analysisResult: null,
    };
    this.institutionDocuments.set(document.id, document);
    return document;
  }

  async deleteInstitutionDocument(id: number): Promise<boolean> {
    return this.institutionDocuments.delete(id);
  }

  async getInstitutionDocumentsByType(institutionId: number, documentType: string): Promise<InstitutionDocument[]> {
    return Array.from(this.institutionDocuments.values())
      .filter(doc => doc.institutionId === institutionId && doc.documentType === documentType)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getInstitution(id: number): Promise<Institution | undefined> {
    const [institution] = await db.select().from(institutions).where(eq(institutions.id, id));
    return institution || undefined;
  }

  async createInstitution(insertInstitution: InsertInstitution): Promise<Institution> {
    const [institution] = await db
      .insert(institutions)
      .values(insertInstitution)
      .returning();
    return institution;
  }

  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow || undefined;
  }

  async getWorkflowsByInstitution(institutionId: number): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.institutionId, institutionId));
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values(insertWorkflow)
      .returning();
    return workflow;
  }

  async updateWorkflow(id: number, updates: Partial<Workflow>): Promise<Workflow | undefined> {
    const [workflow] = await db
      .update(workflows)
      .set(updates)
      .where(eq(workflows.id, id))
      .returning();
    return workflow || undefined;
  }

  async getWorkflowSteps(workflowId: number): Promise<WorkflowStep[]> {
    return await db.select().from(workflowSteps).where(eq(workflowSteps.workflowId, workflowId));
  }

  async createWorkflowStep(insertStep: InsertWorkflowStep): Promise<WorkflowStep> {
    const [step] = await db
      .insert(workflowSteps)
      .values(insertStep)
      .returning();
    return step;
  }

  async updateWorkflowStep(id: number, updates: Partial<WorkflowStep>): Promise<WorkflowStep | undefined> {
    const [step] = await db
      .update(workflowSteps)
      .set(updates)
      .where(eq(workflowSteps.id, id))
      .returning();
    return step || undefined;
  }

  async getEvidenceByStep(stepId: number): Promise<Evidence[]> {
    return await db.select().from(evidence).where(eq(evidence.workflowStepId, stepId));
  }

  async createEvidence(insertEvidence: InsertEvidence): Promise<Evidence> {
    const [evidenceRecord] = await db
      .insert(evidence)
      .values(insertEvidence)
      .returning();
    return evidenceRecord;
  }

  async getRecentActivities(institutionId: number, limit = 10): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.institutionId, institutionId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getComplianceScores(institutionId: number): Promise<ComplianceScore[]> {
    return await db.select().from(complianceScores).where(eq(complianceScores.institutionId, institutionId));
  }

  async updateComplianceScore(institutionId: number, componentType: string, score: number): Promise<ComplianceScore> {
    const existing = await db
      .select()
      .from(complianceScores)
      .where(eq(complianceScores.institutionId, institutionId));

    const existingScore = existing.find(s => s.componentType === componentType);

    if (existingScore) {
      const [updated] = await db
        .update(complianceScores)
        .set({ score, calculatedAt: new Date() })
        .where(eq(complianceScores.id, existingScore.id))
        .returning();
      return updated;
    } else {
      const [newScore] = await db
        .insert(complianceScores)
        .values({
          institutionId,
          componentType,
          score,
          calculatedAt: new Date(),
        })
        .returning();
      return newScore;
    }
  }

  async getDashboardStats(institutionId: number): Promise<{
    activeWorkflows: number;
    completedWorkflows: number;
    underReview: number;
    overallProgress: number;
  }> {
    const institutionWorkflows = await this.getWorkflowsByInstitution(institutionId);
    
    const activeWorkflows = institutionWorkflows.filter(w => w.status === "in_progress").length;
    const completedWorkflows = institutionWorkflows.filter(w => w.status === "completed").length;
    const underReview = institutionWorkflows.filter(w => w.status === "under_review").length;
    
    const totalProgress = institutionWorkflows.reduce((sum, w) => sum + (w.progress || 0), 0);
    const overallProgress = institutionWorkflows.length > 0 ? Math.round(totalProgress / institutionWorkflows.length) : 0;

    return {
      activeWorkflows,
      completedWorkflows,
      underReview,
      overallProgress,
    };
  }

  async getInstitutionDocuments(institutionId: number): Promise<InstitutionDocument[]> {
    return await db
      .select()
      .from(institutionDocuments)
      .where(eq(institutionDocuments.institutionId, institutionId))
      .orderBy(desc(institutionDocuments.createdAt));
  }

  async createInstitutionDocument(insertDocument: InsertInstitutionDocument): Promise<InstitutionDocument> {
    const [document] = await db
      .insert(institutionDocuments)
      .values(insertDocument)
      .returning();
    return document;
  }

  async deleteInstitutionDocument(id: number): Promise<boolean> {
    const result = await db.delete(institutionDocuments).where(eq(institutionDocuments.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getInstitutionDocumentsByType(institutionId: number, documentType: string): Promise<InstitutionDocument[]> {
    return await db
      .select()
      .from(institutionDocuments)
      .where(eq(institutionDocuments.institutionId, institutionId));
  }

  // Checklist Items
  async getChecklistItems(): Promise<ChecklistItem[]> {
    return await db.select().from(checklistItems);
  }

  async getChecklistItemsByComponent(componentType: string): Promise<ChecklistItem[]> {
    return await db
      .select()
      .from(checklistItems)
      .where(eq(checklistItems.componentType, componentType));
  }

  async createChecklistItem(insertItem: InsertChecklistItem): Promise<ChecklistItem> {
    const [item] = await db
      .insert(checklistItems)
      .values(insertItem)
      .returning();
    return item;
  }

  // Checklist Responses
  async getChecklistResponses(workflowId: number): Promise<ChecklistResponse[]> {
    return await db
      .select()
      .from(checklistResponses)
      .where(eq(checklistResponses.workflowId, workflowId));
  }

  async getChecklistResponse(checklistItemId: number, workflowId: number): Promise<ChecklistResponse | undefined> {
    const responses = await db
      .select()
      .from(checklistResponses)
      .where(and(
        eq(checklistResponses.checklistItemId, checklistItemId),
        eq(checklistResponses.workflowId, workflowId)
      ));
    return responses[0] || undefined;
  }

  async createChecklistResponse(insertResponse: InsertChecklistResponse): Promise<ChecklistResponse> {
    const [response] = await db
      .insert(checklistResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async updateChecklistResponse(id: number, updates: Partial<ChecklistResponse>): Promise<ChecklistResponse | undefined> {
    const [updated] = await db
      .update(checklistResponses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(checklistResponses.id, id))
      .returning();
    return updated || undefined;
  }

  // Alert Notifications
  async getActiveAlerts(institutionId: number, workflowId?: number): Promise<AlertNotification[]> {
    let whereConditions = and(
      eq(alertNotifications.institutionId, institutionId),
      eq(alertNotifications.isActive, true)
    );
    
    if (workflowId) {
      whereConditions = and(
        whereConditions,
        eq(alertNotifications.workflowId, workflowId)
      );
    }
    
    return await db
      .select()
      .from(alertNotifications)
      .where(whereConditions);
  }

  async createAlertNotification(insertAlert: InsertAlertNotification): Promise<AlertNotification> {
    const [alert] = await db
      .insert(alertNotifications)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async markAlertEmailSent(alertId: number): Promise<void> {
    await db
      .update(alertNotifications)
      .set({ 
        emailSent: true, 
        emailSentAt: new Date() 
      })
      .where(eq(alertNotifications.id, alertId));
  }

  async getUsersByInstitution(institutionId: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.institutionId, institutionId));
  }

  async getAllInstitutions(): Promise<Institution[]> {
    return await db.select().from(institutions);
  }

  // Nebusis® ControlCore Integration
  async getNebusisIntegration(institutionId: number): Promise<NebusisIntegration | undefined> {
    const results = await db
      .select()
      .from(nebusisIntegrations)
      .where(eq(nebusisIntegrations.institutionId, institutionId))
      .limit(1);
    return results[0];
  }

  async createNebusisIntegration(insertIntegration: InsertNebusisIntegration): Promise<NebusisIntegration> {
    const [integration] = await db
      .insert(nebusisIntegrations)
      .values(insertIntegration)
      .returning();
    return integration;
  }

  async updateNebusisIntegration(id: number, updates: Partial<NebusisIntegration>): Promise<NebusisIntegration | undefined> {
    const [integration] = await db
      .update(nebusisIntegrations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(nebusisIntegrations.id, id))
      .returning();
    return integration;
  }

  async deleteNebusisIntegration(id: number): Promise<boolean> {
    const result = await db
      .delete(nebusisIntegrations)
      .where(eq(nebusisIntegrations.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getSyncLogs(integrationId: number, limit = 20): Promise<SyncLog[]> {
    return await db
      .select()
      .from(syncLogs)
      .where(eq(syncLogs.integrationId, integrationId))
      .orderBy(desc(syncLogs.startedAt))
      .limit(limit);
  }

  async createSyncLog(insertLog: InsertSyncLog): Promise<SyncLog> {
    const [log] = await db
      .insert(syncLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async updateSyncLog(id: number, updates: Partial<SyncLog>): Promise<SyncLog | undefined> {
    const [log] = await db
      .update(syncLogs)
      .set(updates)
      .where(eq(syncLogs.id, id))
      .returning();
    return log;
  }

  // Institutional Plans
  async getInstitutionalPlans(institutionId: number): Promise<InstitutionalPlan[]> {
    return await db
      .select()
      .from(institutionalPlans)
      .where(eq(institutionalPlans.institutionId, institutionId))
      .orderBy(desc(institutionalPlans.createdAt));
  }

  async createInstitutionalPlan(plan: InsertInstitutionalPlan): Promise<InstitutionalPlan> {
    const [newPlan] = await db
      .insert(institutionalPlans)
      .values(plan)
      .returning();
    return newPlan;
  }

  async updateInstitutionalPlan(id: number, updates: Partial<InstitutionalPlan>): Promise<InstitutionalPlan | undefined> {
    const [updatedPlan] = await db
      .update(institutionalPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(institutionalPlans.id, id))
      .returning();
    return updatedPlan;
  }

  async deleteInstitutionalPlan(id: number): Promise<boolean> {
    const result = await db
      .delete(institutionalPlans)
      .where(eq(institutionalPlans.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Training Records
  async getTrainingRecords(institutionId: number): Promise<TrainingRecord[]> {
    return await db
      .select()
      .from(trainingRecords)
      .where(eq(trainingRecords.institutionId, institutionId))
      .orderBy(desc(trainingRecords.createdAt));
  }

  async createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord> {
    const [newRecord] = await db
      .insert(trainingRecords)
      .values(record)
      .returning();
    return newRecord;
  }

  async updateTrainingRecord(id: number, updates: Partial<TrainingRecord>): Promise<TrainingRecord | undefined> {
    const [updatedRecord] = await db
      .update(trainingRecords)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingRecords.id, id))
      .returning();
    return updatedRecord;
  }

  async deleteTrainingRecord(id: number): Promise<boolean> {
    const result = await db
      .delete(trainingRecords)
      .where(eq(trainingRecords.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getTrainingStats(institutionId: number): Promise<{
    totalTrainings: number;
    completedTrainings: number;
    inProgressTrainings: number;
    totalHours: number;
    topicDistribution: { [key: string]: number };
  }> {
    const records = await this.getTrainingRecords(institutionId);
    
    const totalTrainings = records.length;
    const completedTrainings = records.filter(r => r.status === "completed").length;
    const inProgressTrainings = records.filter(r => r.status === "in_progress").length;
    const totalHours = records.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    const topicDistribution: { [key: string]: number } = {};
    records.forEach(record => {
      topicDistribution[record.trainingTopic] = (topicDistribution[record.trainingTopic] || 0) + 1;
    });

    return {
      totalTrainings,
      completedTrainings,
      inProgressTrainings,
      totalHours,
      topicDistribution
    };
  }

  // Audit Reports
  async getCgrReports(institutionId: number): Promise<CgrReport[]> {
    return await db
      .select()
      .from(cgrReports)
      .where(eq(cgrReports.institutionId, institutionId))
      .orderBy(desc(cgrReports.createdAt));
  }

  async createCgrReport(report: InsertCgrReport): Promise<CgrReport> {
    const [newReport] = await db
      .insert(cgrReports)
      .values(report)
      .returning();
    return newReport;
  }

  async updateCgrReport(id: number, updates: Partial<CgrReport>): Promise<CgrReport | undefined> {
    const [updatedReport] = await db
      .update(cgrReports)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(cgrReports.id, id))
      .returning();
    return updatedReport;
  }

  async deleteCgrReport(id: number): Promise<boolean> {
    const result = await db
      .delete(cgrReports)
      .where(eq(cgrReports.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async submitCgrReport(id: number): Promise<CgrReport | undefined> {
    const [report] = await db
      .update(cgrReports)
      .set({ 
        status: "submitted", 
        submittedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(cgrReports.id, id))
      .returning();
    return report;
  }
}

export const storage = new DatabaseStorage();
