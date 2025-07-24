import { db } from "./db";
import { checklistItems } from "@shared/schema";

export async function seedChecklistItems() {
  try {
    console.log("Checking checklist items...");
    
    // Test database connection first with timeout
    const connectionTest = await Promise.race([
      db.select().from(checklistItems).limit(1),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
    ]);
    
    // Check if checklist items already exist
    const existing = await db.select().from(checklistItems).limit(1);
    if (existing.length > 0) {
      console.log("Checklist items already exist, skipping seed");
      return;
    }

    console.log("Creating COSO checklist items...");

    // COSO checklist items - 17 Official Standards
    const checklistItemsData = [
      // COMPONENTE 1: AMBIENTE DE CONTROL
      { code: "1.1", requirement: "Integridad y valores éticos", verificationQuestion: "¿La institución promueve la integridad, los valores éticos y un ambiente de honestidad, transparencia y cumplimiento?", componentType: "ambiente_control" },
      { code: "1.2", requirement: "Supervisión del sistema de control interno", verificationQuestion: "¿La alta dirección supervisa activamente el diseño, implementación y mantenimiento del sistema de control interno?", componentType: "ambiente_control" },
      { code: "1.3", requirement: "Estructura organizacional", verificationQuestion: "¿La entidad tiene una estructura formalmente definida, coherente con sus objetivos y funciones?", componentType: "ambiente_control" },
      { code: "1.4", requirement: "Políticas y prácticas de recursos humanos", verificationQuestion: "¿La administración promueve la competencia del personal mediante políticas claras de contratación, evaluación, capacitación y sanción?", componentType: "ambiente_control" },
      { code: "1.5", requirement: "Evaluación del ambiente de control", verificationQuestion: "¿La institución evalúa periódicamente si su cultura, estructura y prácticas apoyan el control interno?", componentType: "ambiente_control" },
      
      // COMPONENTE 2: VALORACIÓN Y ADMINISTRACIÓN DE RIESGOS
      { code: "2.1", requirement: "Establecimiento de objetivos institucionales", verificationQuestion: "¿La entidad define objetivos claros y coherentes con su mandato legal y su planificación estratégica?", componentType: "evaluacion_riesgos" },
      { code: "2.2", requirement: "Identificación de eventos de riesgo", verificationQuestion: "¿Se identifican eventos internos y externos que puedan afectar el logro de los objetivos institucionales?", componentType: "evaluacion_riesgos" },
      { code: "2.3", requirement: "Evaluación de riesgos", verificationQuestion: "¿Los riesgos se analizan considerando su probabilidad e impacto?", componentType: "evaluacion_riesgos" },
      { code: "2.4", requirement: "Respuesta a los riesgos", verificationQuestion: "¿La entidad establece respuestas apropiadas para mitigar, aceptar, transferir o evitar los riesgos identificados?", componentType: "evaluacion_riesgos" },
      
      // COMPONENTE 3: ACTIVIDADES DE CONTROL
      { code: "3.1", requirement: "Diseño e implementación de controles", verificationQuestion: "¿Se establecen controles que aseguren la ejecución efectiva y eficiente de las operaciones?", componentType: "actividades_control" },
      { code: "3.2", requirement: "Controles sobre tecnología de la información", verificationQuestion: "¿La entidad implementa controles para proteger la integridad, confidencialidad y disponibilidad de la información?", componentType: "actividades_control" },
      { code: "3.3", requirement: "Documentación de políticas y procedimientos", verificationQuestion: "¿Las actividades y controles clave están documentados y actualizados?", componentType: "actividades_control" },
      
      // COMPONENTE 4: INFORMACIÓN Y COMUNICACIÓN
      { code: "4.1", requirement: "Calidad de la información", verificationQuestion: "¿La información es completa, oportuna, precisa y accesible para quienes la necesiten?", componentType: "informacion_comunicacion" },
      { code: "4.2", requirement: "Comunicación interna", verificationQuestion: "¿Fluye adecuadamente la información entre los distintos niveles jerárquicos y funciones?", componentType: "informacion_comunicacion" },
      { code: "4.3", requirement: "Comunicación externa", verificationQuestion: "¿La entidad asegura la comunicación eficaz con sus partes interesadas externas?", componentType: "informacion_comunicacion" },
      
      // COMPONENTE 5: MONITOREO Y EVALUACIÓN
      { code: "5.1", requirement: "Supervisión continua del control interno", verificationQuestion: "¿Se establecen mecanismos para supervisar el cumplimiento de los controles?", componentType: "supervision" },
      { code: "5.2", requirement: "Evaluaciones independientes y seguimiento a recomendaciones", verificationQuestion: "¿Se realizan auditorías internas o externas y se da seguimiento efectivo a sus recomendaciones?", componentType: "supervision" }
    ];

    for (const item of checklistItemsData) {
      await db.insert(checklistItems).values(item);
    }

    console.log(`Created ${checklistItemsData.length} checklist items successfully!`);
    
  } catch (error) {
    console.error("Error seeding checklist items:", error);
    // Don't throw error, just log it so the app can continue
    console.log("Continuing without seeding data...");
  }
}