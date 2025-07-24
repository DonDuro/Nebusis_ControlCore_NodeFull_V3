import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertWorkflowSchema, insertWorkflowStepSchema, insertEvidenceSchema, insertInstitutionDocumentSchema, insertChecklistResponseSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import express from "express";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static assets
  app.use('/api/assets', express.static(path.resolve(process.cwd(), 'attached_assets')));

  // Demo login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Demo credentials validation
      const validCredentials = [
        { email: "ana.rodriguez@hacienda.gob.do", password: "nobaci2024" },
        { email: "aquezada@qsiglobalventures.com", password: "demo2024" },
        { email: "calvarado@nebusis.com", password: "admin2024" },
        { email: "dzambrano@nebusis.com", password: "admin2024" },
        { email: "ymontoya@qsiglobalventures.com", password: "video2024" }
      ];
      
      const isValid = validCredentials.some(cred => 
        cred.email === email && cred.password === password
      );
      
      if (!isValid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      // For demo, create user response based on email
      const getUserData = (email: string) => {
        switch (email) {
          case "ana.rodriguez@hacienda.gob.do":
            return { id: 1, name: "Ana Rodriguez", role: "admin", institutionId: 1 };
          case "aquezada@qsiglobalventures.com":
            return { id: 2, name: "A. Quezada", role: "admin", institutionId: 1 };
          case "calvarado@nebusis.com":
            return { id: 3, name: "Celso Alvarado - Nebusis President", role: "admin", institutionId: 1 };
          case "dzambrano@nebusis.com":
            return { id: 4, name: "David Zambrano - Nebusis CTO", role: "admin", institutionId: 1 };
          case "ymontoya@qsiglobalventures.com":
            return { id: 5, name: "Yerardy Montoya - QSI Global Ventures", role: "admin", institutionId: 1 };
          default:
            return { id: 1, name: "Usuario Admin", role: "admin", institutionId: 1 };
        }
      };
      
      const userData = getUserData(email);
      const user = {
        ...userData,
        email: email
      };
      
      // Generate a session token
      const sessionToken = Math.random().toString(36).substring(7) + Date.now();
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      (app as any).activeSessions.set(sessionToken, { email, timestamp: Date.now() });
      
      res.json({ user, sessionToken });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // User profile endpoints
  app.get("/api/user/profile", async (req, res) => {
    try {
      const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
      
      // Check if session is active
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      const session = (app as any).activeSessions.get(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // Return user profile data based on email
      const getUserProfile = (email: string) => {
        switch (email) {
          case "ana.rodriguez@hacienda.gob.do":
            return { 
              id: 1, 
              name: "Ana Rodriguez", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "Ana",
              lastName: "Rodriguez"
            };
          case "aquezada@qsiglobalventures.com":
            return { 
              id: 2, 
              name: "A. Quezada", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "Antonia",
              lastName: "Quezada"
            };
          case "calvarado@nebusis.com":
            return { 
              id: 3, 
              name: "Celso Alvarado - Nebusis President", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "Celso",
              lastName: "Alvarado"
            };
          case "dzambrano@nebusis.com":
            return { 
              id: 4, 
              name: "David Zambrano - Nebusis CTO", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "David",
              lastName: "Zambrano"
            };
          case "ymontoya@qsiglobalventures.com":
            return { 
              id: 5, 
              name: "Yerardy Montoya - QSI Global Ventures", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "Yerardy",
              lastName: "Montoya"
            };
          default:
            return { 
              id: 1, 
              name: "Usuario Admin", 
              email: email,
              role: "admin", 
              institutionId: 1,
              firstName: "Usuario",
              lastName: "Admin"
            };
        }
      };
      
      const profile = getUserProfile(session.email);
      res.json(profile);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.patch("/api/user/profile", async (req, res) => {
    try {
      const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
      
      // Check if session is active
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      const session = (app as any).activeSessions.get(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // For demo purposes, just return success
      const { firstName, lastName } = req.body;
      
      res.json({ 
        message: "Perfil actualizado exitosamente",
        profile: {
          firstName,
          lastName,
          email: session.email
        }
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/user/profile/photo", async (req, res) => {
    try {
      const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
      
      // Check if session is active
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      const session = (app as any).activeSessions.get(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // For demo purposes, just return success
      res.json({ 
        message: "Foto de perfil actualizada exitosamente",
        photoUrl: "/api/assets/default-profile.jpg"
      });
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", async (req, res) => {
    try {
      const { sessionToken } = req.body;
      
      // Remove session from active sessions
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      (app as any).activeSessions.delete(sessionToken);
      
      res.json({ message: "Sesión cerrada exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Password reset request
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      // In a real app, you would send an email here
      // For demo purposes, we'll just simulate success
      console.log(`Password reset requested for: ${email}`);
      
      res.json({ 
        message: "Password reset link sent", 
        email: email 
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Error sending reset email" });
    }
  });

  // Change password
  app.put("/api/users/:id/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = parseInt(req.params.id);
      
      // In a real app, you would verify the current password and update it
      // For demo purposes, we'll simulate success
      console.log(`Password change requested for user ${userId}`);
      
      res.json({ 
        message: "Password changed successfully",
        userId: userId 
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Error changing password" });
    }
  });

  // Update user notification preferences
  app.put("/api/users/:id/notifications", async (req, res) => {
    try {
      const { emailNotifications } = req.body;
      const userId = parseInt(req.params.id);
      
      // In a real app, you would update user preferences in database
      console.log(`Notification preferences updated for user ${userId}: ${emailNotifications}`);
      
      res.json({ 
        message: "Preferences updated",
        userId: userId,
        emailNotifications: emailNotifications
      });
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ message: "Error updating preferences" });
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    try {
      const sessionToken = req.headers['authorization']?.replace('Bearer ', '');
      
      // Check if session is active
      (app as any).activeSessions = (app as any).activeSessions || new Map();
      const session = (app as any).activeSessions.get(sessionToken);
      
      if (!session) {
        return res.status(401).json({ message: "No autenticado" });
      }
      
      // For demo, return user response based on email
      const getUserData = (email: string) => {
        switch (email) {
          case "ana.rodriguez@hacienda.gob.do":
            return { id: 1, name: "Ana Rodriguez", firstName: "Ana", lastName: "Rodriguez", role: "admin", institutionId: 1, emailNotifications: true };
          case "aquezada@qsiglobalventures.com":
            return { id: 2, name: "A. Quezada", firstName: "Antonia", lastName: "Quezada", role: "admin", institutionId: 1, emailNotifications: true };
          case "calvarado@nebusis.com":
            return { id: 3, name: "Celso Alvarado - Nebusis President", firstName: "Celso", lastName: "Alvarado", role: "admin", institutionId: 1, emailNotifications: true };
          case "dzambrano@nebusis.com":
            return { id: 4, name: "David Zambrano - Nebusis CTO", firstName: "David", lastName: "Zambrano", role: "admin", institutionId: 1, emailNotifications: true };
          case "ymontoya@qsiglobalventures.com":
            return { id: 5, name: "Yerardy Montoya - QSI Global Ventures", firstName: "Yerardy", lastName: "Montoya", role: "admin", institutionId: 1, emailNotifications: true };
          default:
            return { id: 1, name: "Usuario Admin", firstName: "Usuario", lastName: "Admin", role: "admin", institutionId: 1, emailNotifications: true };
        }
      };
      
      const userData = getUserData(session.email);
      const user = {
        ...userData,
        email: session.email
      };
      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get institution
  app.get("/api/institutions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const institution = await storage.getInstitution(id);
      if (!institution) {
        return res.status(404).json({ message: "Institución no encontrada" });
      }
      res.json(institution);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get workflows
  app.get("/api/workflows", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }
      
      const workflows = await storage.getWorkflowsByInstitution(institutionId);
      res.json(workflows);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Create workflow
  app.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      
      // Create activity
      await storage.createActivity({
        type: "workflow_created",
        description: `creó el flujo de trabajo "${workflow.name}"`,
        userId: workflow.assignedToId || 1,
        workflowId: workflow.id,
        institutionId: workflow.institutionId,
      });
      
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Update workflow
  app.patch("/api/workflows/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const workflow = await storage.updateWorkflow(id, updates);
      if (!workflow) {
        return res.status(404).json({ message: "Flujo de trabajo no encontrado" });
      }
      
      // Create activity if status changed
      if (updates.status) {
        let activityType = "workflow_updated";
        let description = `actualizó el flujo de trabajo "${workflow.name}"`;
        
        if (updates.status === "completed") {
          activityType = "workflow_completed";
          description = `completó el flujo de trabajo "${workflow.name}"`;
        }
        
        await storage.createActivity({
          type: activityType,
          description,
          userId: workflow.assignedToId || 1,
          workflowId: workflow.id,
          institutionId: workflow.institutionId,
        });
      }
      
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get workflow steps
  app.get("/api/workflows/:id/steps", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const steps = await storage.getWorkflowSteps(workflowId);
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Create workflow step
  app.post("/api/workflows/:id/steps", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.id);
      const stepData = { ...req.body, workflowId };
      const validatedData = insertWorkflowStepSchema.parse(stepData);
      
      const step = await storage.createWorkflowStep(validatedData);
      res.status(201).json(step);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }
      
      const stats = await storage.getDashboardStats(institutionId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }
      
      const activities = await storage.getRecentActivities(institutionId, limit);
      
      // Enrich activities with user data
      const enrichedActivities = await Promise.all(
        activities.map(async (activity) => {
          const user = await storage.getUser(activity.userId);
          return {
            ...activity,
            user: user ? `${user.firstName} ${user.lastName}` : "Usuario desconocido"
          };
        })
      );
      
      res.json(enrichedActivities);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Get compliance scores
  app.get("/api/compliance-scores", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }
      
      const scores = await storage.getComplianceScores(institutionId);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Document management endpoints
  app.get("/api/documents", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }
      
      const documents = await storage.getInstitutionDocuments(institutionId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Simulate file upload (in real implementation, use multer middleware)
  app.post("/api/documents/upload", async (req, res) => {
    try {
      const { institutionId, fileName, documentType, description, fileSize, mimeType } = req.body;
      
      if (!institutionId || !fileName || !documentType) {
        return res.status(400).json({ message: "Datos requeridos faltantes" });
      }

      const documentData = {
        institutionId: parseInt(institutionId),
        fileName: `doc_${Date.now()}_${fileName}`,
        originalName: fileName,
        filePath: `/uploads/${institutionId}/${fileName}`,
        fileSize: fileSize || 0,
        mimeType: mimeType || "application/octet-stream",
        documentType,
        description: description || null,
        uploadedById: 1, // Current user
      };

      const document = await storage.createInstitutionDocument(documentData);
      
      // Create activity
      await storage.createActivity({
        type: "document_uploaded",
        description: `subió el documento "${fileName}" (${documentType})`,
        userId: 1,
        workflowId: null,
        institutionId: parseInt(institutionId),
      });

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteInstitutionDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Documento no encontrado" });
      }
      
      res.json({ message: "Documento eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // AI Chatbot endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Simple AI response simulation based on keywords
      let response = "Gracias por tu pregunta sobre COSO. ";
      
      if (message.toLowerCase().includes("ambiente de control")) {
        response += "El Ambiente de Control establece el tono de la organización e influye en la conciencia de control de su personal. Es la base de todos los demás componentes del control interno.";
      } else if (message.toLowerCase().includes("evaluación de riesgos")) {
        response += "La Evaluación de Riesgos identifica y analiza los riesgos relevantes para el logro de los objetivos, formando una base para determinar cómo deben administrarse los riesgos.";
      } else if (message.toLowerCase().includes("actividades de control")) {
        response += "Las Actividades de Control son las políticas y procedimientos que ayudan a asegurar que se ejecuten las directrices de la administración.";
      } else if (message.toLowerCase().includes("información y comunicación")) {
        response += "La Información y Comunicación sistemas identifican, capturan y comunican información pertinente en forma y tiempo que permitan cumplir a cada empleado con sus responsabilidades.";
      } else if (message.toLowerCase().includes("supervisión")) {
        response += "La Supervisión es un proceso que evalúa la calidad del funcionamiento del control interno en el tiempo y permite al sistema reaccionar dinámicamente.";
      } else {
        response += "Puedo ayudarte con información sobre los 5 componentes de COSO basados en COSO 2013: Ambiente de Control, Evaluación de Riesgos, Actividades de Control, Información y Comunicación, y Supervisión.";
      }
      
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Checklist verification endpoints
  app.get("/api/checklist/items", async (req, res) => {
    try {
      const componentType = req.query.componentType as string;
      
      if (componentType) {
        const items = await storage.getChecklistItemsByComponent(componentType);
        res.json(items);
      } else {
        const items = await storage.getChecklistItems();
        res.json(items);
      }
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.get("/api/checklist/responses/:workflowId", async (req, res) => {
    try {
      const workflowId = parseInt(req.params.workflowId);
      if (!workflowId) {
        return res.status(400).json({ message: "ID de flujo de trabajo requerido" });
      }
      
      const responses = await storage.getChecklistResponses(workflowId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.post("/api/checklist/responses", async (req, res) => {
    try {
      const validatedData = insertChecklistResponseSchema.parse(req.body);
      const response = await storage.createChecklistResponse(validatedData);
      
      // Create activity
      await storage.createActivity({
        type: "checklist_response",
        description: `respondió a la verificación: ${validatedData.response}`,
        userId: 1, // Current user
        workflowId: validatedData.workflowId,
        institutionId: 1, // Current institution
      });
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  app.put("/api/checklist/responses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const response = await storage.updateChecklistResponse(id, updates);
      if (!response) {
        return res.status(404).json({ message: "Respuesta no encontrada" });
      }
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  });

  // Institution logo upload endpoint
  app.post("/api/institutions/:id/logo", async (req, res) => {
    try {
      const institutionId = parseInt(req.params.id);
      const { fileName } = req.body;
      
      if (!fileName) {
        return res.status(400).json({ message: "Nombre de archivo requerido" });
      }

      // Update institution with logo URL
      const logoUrl = `/api/assets/${fileName}`;
      const institution = await storage.getInstitution(institutionId);
      
      if (!institution) {
        return res.status(404).json({ message: "Institución no encontrada" });
      }

      // For now, we'll simulate updating the logo URL
      // In a real implementation, you'd update the database
      res.json({ 
        message: "Logo actualizado exitosamente",
        logoUrl: logoUrl
      });
    } catch (error) {
      res.status(500).json({ message: "Error actualizando logo de institución" });
    }
  });

  // Reports generation endpoints
  app.get("/api/reports/compliance", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const institution = await storage.getInstitution(institutionId);
      const workflows = await storage.getWorkflowsByInstitution(institutionId);
      const complianceScores = await storage.getComplianceScores(institutionId);
      const dashboardStats = await storage.getDashboardStats(institutionId);

      const report = {
        reportType: 'compliance',
        generatedAt: new Date(),
        institution: {
          id: institution?.id,
          name: institution?.name,
          type: institution?.type
        },
        summary: {
          overallCompliance: complianceScores.length > 0 
            ? Math.round(complianceScores.reduce((sum, score) => sum + score.score, 0) / complianceScores.length)
            : 0,
          totalWorkflows: workflows.length,
          completedWorkflows: dashboardStats.completedWorkflows,
          activeWorkflows: dashboardStats.activeWorkflows,
          underReview: dashboardStats.underReview
        },
        componentCompliance: complianceScores.map(score => ({
          component: score.componentType,
          score: score.score,
          calculatedAt: score.calculatedAt
        })),
        workflows: workflows.map(workflow => ({
          id: workflow.id,
          name: workflow.name,
          component: workflow.componentType,
          status: workflow.status,
          progress: workflow.progress,
          dueDate: workflow.dueDate,
          completedAt: workflow.completedAt
        }))
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error generando informe de cumplimiento" });
    }
  });

  app.get("/api/reports/progress", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const workflows = await storage.getWorkflowsByInstitution(institutionId);
      const activities = await storage.getRecentActivities(institutionId, 50);

      const report = {
        reportType: 'progress',
        generatedAt: new Date(),
        workflows: workflows.map(workflow => ({
          id: workflow.id,
          name: workflow.name,
          component: workflow.componentType,
          status: workflow.status,
          progress: workflow.progress,
          assignedTo: workflow.assignedToId,
          startDate: workflow.createdAt,
          dueDate: workflow.dueDate,
          completedAt: workflow.completedAt,
          estimatedCompletion: workflow.dueDate ? new Date(workflow.dueDate.getTime() + (1000 * 60 * 60 * 24 * 7)) : null
        })),
        recentActivities: activities.map(activity => ({
          type: activity.type,
          description: activity.description,
          createdAt: activity.createdAt,
          userId: activity.userId,
          workflowId: activity.workflowId
        }))
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error generando informe de progreso" });
    }
  });

  app.get("/api/reports/performance", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const workflows = await storage.getWorkflowsByInstitution(institutionId);
      const activities = await storage.getRecentActivities(institutionId, 100);

      const completedWorkflows = workflows.filter(w => w.status === 'completed');
      const averageCompletionTime = completedWorkflows.length > 0 
        ? completedWorkflows.reduce((sum, w) => {
            if (w.completedAt && w.createdAt) {
              return sum + (w.completedAt.getTime() - w.createdAt.getTime());
            }
            return sum;
          }, 0) / completedWorkflows.length
        : 0;

      const report = {
        reportType: 'performance',
        generatedAt: new Date(),
        metrics: {
          totalWorkflows: workflows.length,
          completedWorkflows: completedWorkflows.length,
          averageCompletionDays: Math.round(averageCompletionTime / (1000 * 60 * 60 * 24)),
          onTimeCompletion: completedWorkflows.filter(w => 
            w.dueDate && w.completedAt && w.completedAt <= w.dueDate
          ).length,
          delayedCompletion: completedWorkflows.filter(w => 
            w.dueDate && w.completedAt && w.completedAt > w.dueDate
          ).length
        },
        componentPerformance: ['ambiente_control', 'evaluacion_riesgos', 'actividades_control', 'informacion_comunicacion', 'supervision'].map(component => {
          const componentWorkflows = workflows.filter(w => w.componentType === component);
          const componentCompleted = componentWorkflows.filter(w => w.status === 'completed');
          
          return {
            component,
            totalWorkflows: componentWorkflows.length,
            completedWorkflows: componentCompleted.length,
            completionRate: componentWorkflows.length > 0 
              ? Math.round((componentCompleted.length / componentWorkflows.length) * 100)
              : 0
          };
        }),
        activityTrends: activities.slice(0, 30).map(activity => ({
          date: activity.createdAt,
          type: activity.type,
          count: 1
        }))
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error generando informe de rendimiento" });
    }
  });

  app.get("/api/reports/risk", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const workflows = await storage.getWorkflowsByInstitution(institutionId);
      const complianceScores = await storage.getComplianceScores(institutionId);

      const riskWorkflows = workflows.filter(w => w.componentType === 'evaluacion_riesgos');
      const lowComplianceComponents = complianceScores.filter(score => score.score < 70);
      const overdue = workflows.filter(w => 
        w.dueDate && new Date() > w.dueDate && w.status !== 'completed'
      );

      const report = {
        reportType: 'risk',
        generatedAt: new Date(),
        riskAssessment: {
          highRiskAreas: lowComplianceComponents.map(comp => ({
            component: comp.componentType,
            score: comp.score,
            riskLevel: comp.score < 50 ? 'alto' : 'medio'
          })),
          overdueWorkflows: overdue.map(workflow => ({
            id: workflow.id,
            name: workflow.name,
            component: workflow.componentType,
            dueDate: workflow.dueDate,
            daysOverdue: workflow.dueDate 
              ? Math.floor((new Date().getTime() - workflow.dueDate.getTime()) / (1000 * 60 * 60 * 24))
              : 0
          })),
          riskMitigation: riskWorkflows.map(workflow => ({
            id: workflow.id,
            name: workflow.name,
            status: workflow.status,
            progress: workflow.progress,
            implementationStatus: workflow.status === 'completed' ? 'implementado' 
              : workflow.status === 'in_progress' ? 'en_progreso' 
              : 'pendiente'
          }))
        },
        recommendations: [
          "Priorizar flujos de trabajo con cumplimiento menor al 70%",
          "Implementar controles adicionales en áreas de alto riesgo",
          "Establecer seguimiento quincenal para flujos atrasados",
          "Revisar y actualizar evaluaciones de riesgo trimestralmente"
        ]
      };

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error generando informe de riesgos" });
    }
  });

  // Alert Notifications endpoints
  app.get("/api/alerts", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const workflowId = req.query.workflowId ? parseInt(req.query.workflowId as string) : undefined;
      const alerts = await storage.getActiveAlerts(institutionId, workflowId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo alertas" });
    }
  });

  app.post("/api/alerts/check", async (req, res) => {
    try {
      const institutionId = parseInt(req.body.institutionId);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      // Import alert service and run check
      const { alertService } = await import("./alert-service");
      await alertService.checkAndSendAlerts(institutionId);
      
      res.json({ message: "Chequeo de alertas completado" });
    } catch (error) {
      res.status(500).json({ message: "Error ejecutando chequeo de alertas" });
    }
  });

  app.post("/api/alerts/send-test", async (req, res) => {
    try {
      const { recipientEmail, recipientName } = req.body;
      
      if (!recipientEmail || !recipientName) {
        return res.status(400).json({ message: "Email y nombre del destinatario requeridos" });
      }

      // Import email service and send test alert
      const { sendAlertEmail } = await import("./email-service");
      
      const testEmailData = {
        alertTitle: "Prueba del Sistema de Alertas COSO",
        alertDescription: "Esta es una prueba del sistema de notificaciones por correo electrónico. El sistema está funcionando correctamente.",
        institutionName: "Ministerio Modelo",
        priority: "media" as const,
        actionRequired: "Esta es una prueba, no se requiere acción"
      };

      const recipients = [{
        email: recipientEmail,
        name: recipientName,
        role: "user"
      }];

      const emailSent = await sendAlertEmail(recipients, testEmailData);
      
      if (emailSent) {
        res.json({ message: "Email de prueba enviado exitosamente" });
      } else {
        res.status(500).json({ message: "Error enviando email de prueba" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error en envío de email de prueba" });
    }
  });

  // User notification preferences
  app.put("/api/users/:id/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { emailNotifications } = req.body;
      
      // For now, we'll simulate updating user preferences
      // In a real implementation, you'd update the database
      res.json({ 
        message: "Preferencias de notificación actualizadas",
        emailNotifications: emailNotifications
      });
    } catch (error) {
      res.status(500).json({ message: "Error actualizando preferencias de notificación" });
    }
  });

  // Institutional Plans endpoints
  app.get("/api/institutional-plans", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const plans = await storage.getInstitutionalPlans(institutionId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo planes institucionales" });
    }
  });

  app.post("/api/institutional-plans", async (req, res) => {
    try {
      const { institutionId, planType, planName, validFrom, validTo } = req.body;
      
      if (!institutionId || !planType || !planName) {
        return res.status(400).json({ message: "Datos requeridos faltantes" });
      }

      const planData = {
        institutionId: parseInt(institutionId),
        planType,
        planName,
        fileName: `plan_${Date.now()}.pdf`,
        filePath: `/uploads/plans/${institutionId}/${planType}_${Date.now()}.pdf`,
        fileSize: 1024000, // Mock file size
        mimeType: "application/pdf",
        uploadedById: 1,
        validFrom: validFrom ? new Date(validFrom) : null,
        validTo: validTo ? new Date(validTo) : null,
      };

      const plan = await storage.createInstitutionalPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error creando plan institucional" });
    }
  });

  // Training Records endpoints
  app.get("/api/training-records", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const records = await storage.getTrainingRecords(institutionId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo registros de capacitación" });
    }
  });

  app.post("/api/training-records", async (req, res) => {
    try {
      const { institutionId, userId, trainingTitle, trainingType, trainingTopic, provider, duration, completionDate, status } = req.body;
      
      if (!institutionId || !userId || !trainingTitle || !trainingType || !trainingTopic) {
        return res.status(400).json({ message: "Datos requeridos faltantes" });
      }

      const recordData = {
        institutionId: parseInt(institutionId),
        userId: parseInt(userId),
        trainingTitle,
        trainingType,
        trainingTopic,
        provider: provider || null,
        duration: duration ? parseInt(duration) : null,
        completionDate: completionDate ? new Date(completionDate) : null,
        status: status || "completed",
        certificateFileName: `cert_${Date.now()}.pdf`,
        certificateFilePath: `/uploads/certificates/${institutionId}/${userId}_${Date.now()}.pdf`,
        certificateFileSize: 512000,
        certificateMimeType: "application/pdf",
      };

      const record = await storage.createTrainingRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ message: "Error creando registro de capacitación" });
    }
  });

  app.get("/api/training-stats", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const stats = await storage.getTrainingStats(institutionId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo estadísticas de capacitación" });
    }
  });

  // Audit Reports endpoints
  app.get("/api/cgr-reports", async (req, res) => {
    try {
      const institutionId = parseInt(req.query.institutionId as string);
      if (!institutionId) {
        return res.status(400).json({ message: "ID de institución requerido" });
      }

      const reports = await storage.getCgrReports(institutionId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo informes de auditoría" });
    }
  });

  app.post("/api/cgr-reports", async (req, res) => {
    try {
      const { institutionId, reportType, reportPeriod, reportData } = req.body;
      
      if (!institutionId || !reportType || !reportPeriod) {
        return res.status(400).json({ message: "Datos requeridos faltantes" });
      }

      const mockReportData = {
        componentes: {
          ambiente_control: { score: 85, status: "implementado" },
          evaluacion_riesgos: { score: 78, status: "en_progreso" },
          actividades_control: { score: 92, status: "implementado" },
          informacion_comunicacion: { score: 75, status: "en_progreso" },
          supervision: { score: 88, status: "implementado" }
        },
        resumen_ejecutivo: "Resumen del cumplimiento COSO para el período " + reportPeriod,
        recomendaciones: [
          "Fortalecer controles en información y comunicación",
          "Completar evaluación de riesgos pendiente",
          "Implementar seguimiento trimestral"
        ]
      };

      const reportDataObj = {
        institutionId: parseInt(institutionId),
        reportType,
        reportPeriod,
        reportData: reportData || mockReportData,
        generatedById: 1,
        status: "draft",
      };

      const report = await storage.createCgrReport(reportDataObj);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Error creando informe de auditoría" });
    }
  });

  app.post("/api/cgr-reports/:id/submit", async (req, res) => {
    try {
      const reportId = parseInt(req.params.id);
      const report = await storage.submitCgrReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Informe no encontrado" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Error enviando informe de auditoría" });
    }
  });

  app.get("/api/cgr-templates", async (req, res) => {
    try {
      const templates = [
        {
          type: "cumplimiento",
          name: "Informe de Cumplimiento COSO",
          description: "Informe trimestral sobre el cumplimiento de las normas básicas de control interno",
          fields: ["ambiente_control", "evaluacion_riesgos", "actividades_control", "informacion_comunicacion", "supervision"],
          frequency: "trimestral"
        },
        {
          type: "autoevaluacion",
          name: "Autoevaluación del Sistema de Control Interno",
          description: "Evaluación anual del sistema de control interno institucional",
          fields: ["fortalezas", "debilidades", "plan_mejoras", "recursos_necesarios"],
          frequency: "anual"
        },
        {
          type: "seguimiento",
          name: "Seguimiento de Recomendaciones",
          description: "Informe de seguimiento a recomendaciones de auditoría interna y externa",
          fields: ["recomendaciones_pendientes", "recomendaciones_implementadas", "cronograma_implementacion"],
          frequency: "semestral"
        }
      ];
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error obteniendo plantillas de auditoría" });
    }
  });

  // Stripe payment route for basic tier purchase
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", metadata = {} } = req.body;
      
      // Validate amount (minimum $0.50 for Stripe)
      if (!amount || amount < 0.5) {
        return res.status(400).json({ 
          message: "Amount must be at least $0.50" 
        });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency,
        metadata: {
          product: "Nebusis ControlCore Basic Implementation",
          tier: "basic",
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
