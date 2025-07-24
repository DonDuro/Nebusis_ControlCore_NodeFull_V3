export interface WorkflowStep {
  id: string;
  sequenceNumber: number;
  whatToDo: string;
  whoDoesIt: string;
  requiredResources: string[];
  evidenceGenerated: string;
  completed?: boolean;
  completedBy?: string;
  completedDate?: Date;
  notes?: string;
}

export interface COSOWorkflow {
  id: string;
  code: string;
  name: string;
  componentType: string;
  description: string;
  inputs: string[];
  steps: WorkflowStep[];
  outputs: string[];
  estimatedDuration: string;
  responsibleRole: string;
  priority: "alta" | "media" | "baja";
  frequency: string;
  relatedDocuments: string[];
}

export const cosoWorkflows: COSOWorkflow[] = [
  // 1. AMBIENTE DE CONTROL
  {
    id: "wf-1-1",
    code: "1.1",
    name: "Evaluación periódica del cumplimiento ético",
    componentType: "ambiente_control",
    description: "Proceso para establecer y evaluar el cumplimiento de normas de conducta y valores éticos institucionales",
    inputs: [
      "Normas de conducta institucionales vigentes",
      "Historial de reportes éticos anteriores",
      "Marco legal ético aplicable",
      "Registro de personal activo"
    ],
    steps: [
      {
        id: "step-1-1-1",
        sequenceNumber: 1,
        whatToDo: "Planificar la evaluación ética institucional",
        whoDoesIt: "Oficial de Cumplimiento Ético",
        requiredResources: ["Calendario institucional", "Base de datos de personal", "Plantilla de plan de evaluación"],
        evidenceGenerated: "Plan de evaluación ética aprobado con cronograma"
      },
      {
        id: "step-1-1-2",
        sequenceNumber: 2,
        whatToDo: "Revisar y actualizar el código de ética institucional",
        whoDoesIt: "Comité de Ética",
        requiredResources: ["Código de ética vigente", "Marco normativo actualizado", "Consultas legales"],
        evidenceGenerated: "Código de ética revisado y actualizado"
      },
      {
        id: "step-1-1-3",
        sequenceNumber: 3,
        whatToDo: "Diseñar instrumentos de evaluación ética",
        whoDoesIt: "Equipo de Recursos Humanos",
        requiredResources: ["Metodologías de evaluación", "Herramientas de encuesta", "Criterios de medición"],
        evidenceGenerated: "Cuestionarios y matrices de evaluación ética"
      },
      {
        id: "step-1-1-4",
        sequenceNumber: 4,
        whatToDo: "Aplicar evaluación a todo el personal",
        whoDoesIt: "Supervisores de área",
        requiredResources: ["Instrumentos de evaluación", "Plataforma digital", "Tiempo asignado"],
        evidenceGenerated: "Resultados de evaluación ética por empleado"
      },
      {
        id: "step-1-1-5",
        sequenceNumber: 5,
        whatToDo: "Analizar resultados y identificar brechas",
        whoDoesIt: "Analista de Cumplimiento",
        requiredResources: ["Datos de evaluación", "Software de análisis", "Estándares de referencia"],
        evidenceGenerated: "Informe de análisis de cumplimiento ético"
      },
      {
        id: "step-1-1-6",
        sequenceNumber: 6,
        whatToDo: "Desarrollar plan de mejora ética",
        whoDoesIt: "Oficial de Cumplimiento Ético",
        requiredResources: ["Análisis de brechas", "Recursos presupuestarios", "Metodologías de capacitación"],
        evidenceGenerated: "Plan de mejora ética con acciones específicas"
      }
    ],
    outputs: [
      "Recomendaciones de mejora ética institucional",
      "Plan de capacitación en valores",
      "Indicadores de cumplimiento ético actualizados"
    ],
    estimatedDuration: "45 días",
    responsibleRole: "Oficial de Cumplimiento Ético",
    priority: "alta",
    frequency: "Anual",
    relatedDocuments: ["Código de Ética", "Manual de Conducta", "Ley 10-07"]
  },

  {
    id: "wf-1-2",
    code: "1.2",
    name: "Supervisión del sistema de control interno",
    componentType: "ambiente_control",
    description: "Proceso de supervisión continua del diseño y funcionamiento del sistema de control interno",
    inputs: [
      "Documentación del SCI actual",
      "Resultados de evaluaciones anteriores",
      "Cambios organizacionales recientes",
      "Nuevos riesgos identificados"
    ],
    steps: [
      {
        id: "step-1-2-1",
        sequenceNumber: 1,
        whatToDo: "Establecer comité de supervisión del SCI",
        whoDoesIt: "Máxima Autoridad Ejecutiva",
        requiredResources: ["Organigrama institucional", "Perfiles de competencia", "Acta de designación"],
        evidenceGenerated: "Resolución de conformación del comité de supervisión"
      },
      {
        id: "step-1-2-2",
        sequenceNumber: 2,
        whatToDo: "Definir metodología de supervisión",
        whoDoesIt: "Comité de Supervisión SCI",
        requiredResources: ["Marcos metodológicos COSO", "Mejores prácticas", "Herramientas de evaluación"],
        evidenceGenerated: "Manual de supervisión del SCI"
      },
      {
        id: "step-1-2-3",
        sequenceNumber: 3,
        whatToDo: "Realizar supervisión periódica de controles",
        whoDoesIt: "Supervisores de proceso",
        requiredResources: ["Check-lists de supervisión", "Acceso a sistemas", "Tiempo asignado"],
        evidenceGenerated: "Reportes de supervisión por proceso"
      },
      {
        id: "step-1-2-4",
        sequenceNumber: 4,
        whatToDo: "Consolidar hallazgos de supervisión",
        whoDoesIt: "Coordinador de Control Interno",
        requiredResources: ["Reportes individuales", "Software de consolidación", "Criterios de priorización"],
        evidenceGenerated: "Informe consolidado de supervisión del SCI"
      },
      {
        id: "step-1-2-5",
        sequenceNumber: 5,
        whatToDo: "Presentar resultados a la alta dirección",
        whoDoesIt: "Coordinador de Control Interno",
        requiredResources: ["Informe consolidado", "Sala de reuniones", "Presentación ejecutiva"],
        evidenceGenerated: "Acta de presentación a alta dirección"
      }
    ],
    outputs: [
      "Sistema de supervisión continua implementado",
      "Reportes periódicos de efectividad del SCI",
      "Recomendaciones de mejora del control interno"
    ],
    estimatedDuration: "30 días",
    responsibleRole: "Coordinador de Control Interno",
    priority: "alta",
    frequency: "Trimestral",
    relatedDocuments: ["Manual de Control Interno", "COSO Framework", "Guías de Auditoría"]
  },

  // 2. EVALUACIÓN DE RIESGOS
  {
    id: "wf-2-1",
    code: "2.1",
    name: "Establecimiento y documentación de objetivos institucionales",
    componentType: "evaluacion_riesgos",
    description: "Proceso para definir, documentar y comunicar los objetivos institucionales de manera clara y medible",
    inputs: [
      "Plan estratégico institucional",
      "Marco legal y normativo",
      "Recursos presupuestarios asignados",
      "Análisis del entorno institucional"
    ],
    steps: [
      {
        id: "step-2-1-1",
        sequenceNumber: 1,
        whatToDo: "Revisar marco estratégico institucional",
        whoDoesIt: "Equipo de Planificación Estratégica",
        requiredResources: ["Plan estratégico vigente", "Normativas aplicables", "Estudios de contexto"],
        evidenceGenerated: "Análisis del marco estratégico actualizado"
      },
      {
        id: "step-2-1-2",
        sequenceNumber: 2,
        whatToDo: "Definir objetivos institucionales SMART",
        whoDoesIt: "Alta Dirección",
        requiredResources: ["Metodología SMART", "Talleres de planificación", "Facilitador externo"],
        evidenceGenerated: "Matriz de objetivos institucionales SMART"
      },
      {
        id: "step-2-1-3",
        sequenceNumber: 3,
        whatToDo: "Validar coherencia con misión y visión",
        whoDoesIt: "Comité Directivo",
        requiredResources: ["Misión y visión institucional", "Matriz de objetivos", "Criterios de validación"],
        evidenceGenerated: "Certificación de coherencia estratégica"
      },
      {
        id: "step-2-1-4",
        sequenceNumber: 4,
        whatToDo: "Documentar objetivos en sistema oficial",
        whoDoesIt: "Secretaría de Planificación",
        requiredResources: ["Sistema de gestión documental", "Plantillas oficiales", "Firma digital"],
        evidenceGenerated: "Documento oficial de objetivos institucionales"
      },
      {
        id: "step-2-1-5",
        sequenceNumber: 5,
        whatToDo: "Comunicar objetivos a toda la organización",
        whoDoesIt: "Unidad de Comunicaciones",
        requiredResources: ["Canales de comunicación", "Material gráfico", "Plataformas digitales"],
        evidenceGenerated: "Plan de comunicación ejecutado con evidencias de difusión"
      }
    ],
    outputs: [
      "Objetivos institucionales claramente documentados",
      "Sistema de comunicación de objetivos implementado",
      "Base para la identificación y evaluación de riesgos"
    ],
    estimatedDuration: "60 días",
    responsibleRole: "Director de Planificación",
    priority: "alta",
    frequency: "Anual",
    relatedDocuments: ["Plan Estratégico", "Marco Normativo", "COSO II"]
  },

  {
    id: "wf-2-2",
    code: "2.2",
    name: "Identificación sistemática de eventos y riesgos",
    componentType: "evaluacion_riesgos",
    description: "Proceso para identificar eventos internos y externos que puedan impedir el logro de objetivos institucionales",
    inputs: [
      "Objetivos institucionales documentados",
      "Análisis del entorno interno y externo",
      "Historial de eventos de riesgo",
      "Consultas a expertos y stakeholders"
    ],
    steps: [
      {
        id: "step-2-2-1",
        sequenceNumber: 1,
        whatToDo: "Formar equipo multidisciplinario de identificación de riesgos",
        whoDoesIt: "Coordinador de Gestión de Riesgos",
        requiredResources: ["Personal especializado", "Matriz de competencias", "Términos de referencia"],
        evidenceGenerated: "Conformación oficial del equipo de gestión de riesgos"
      },
      {
        id: "step-2-2-2",
        sequenceNumber: 2,
        whatToDo: "Aplicar técnicas de identificación de riesgos",
        whoDoesIt: "Equipo de Gestión de Riesgos",
        requiredResources: ["Metodologías de identificación", "Talleres de lluvia de ideas", "Entrevistas estructuradas"],
        evidenceGenerated: "Inventario preliminar de riesgos identificados"
      },
      {
        id: "step-2-2-3",
        sequenceNumber: 3,
        whatToDo: "Categorizar riesgos por tipo y origen",
        whoDoesIt: "Analista de Riesgos",
        requiredResources: ["Taxonomía de riesgos", "Software de categorización", "Criterios de clasificación"],
        evidenceGenerated: "Matriz de riesgos categorizada"
      },
      {
        id: "step-2-2-4",
        sequenceNumber: 4,
        whatToDo: "Validar riesgos con responsables de proceso",
        whoDoesIt: "Responsables de Proceso",
        requiredResources: ["Matriz de riesgos", "Sesiones de validación", "Cuestionarios específicos"],
        evidenceGenerated: "Riesgos validados por área de responsabilidad"
      },
      {
        id: "step-2-2-5",
        sequenceNumber: 5,
        whatToDo: "Consolidar registro maestro de riesgos",
        whoDoesIt: "Coordinador de Gestión de Riesgos",
        requiredResources: ["Sistema de gestión de riesgos", "Base de datos centralizada", "Procedimientos de actualización"],
        evidenceGenerated: "Registro maestro de riesgos institucionales"
      }
    ],
    outputs: [
      "Inventario completo de riesgos institucionales",
      "Sistema de categorización de riesgos implementado",
      "Base para evaluación y tratamiento de riesgos"
    ],
    estimatedDuration: "45 días",
    responsibleRole: "Coordinador de Gestión de Riesgos",
    priority: "alta",
    frequency: "Semestral",
    relatedDocuments: ["Manual de Gestión de Riesgos", "COSO II", "ISO 31000"]
  },

  // 3. ACTIVIDADES DE CONTROL
  {
    id: "wf-3-1",
    code: "3.1",
    name: "Diseño e implementación de controles para riesgos clave",
    componentType: "actividades_control",
    description: "Proceso para establecer controles específicos que mitiguen los riesgos clave identificados",
    inputs: [
      "Registro de riesgos evaluados y priorizados",
      "Análisis costo-beneficio de controles",
      "Recursos disponibles para implementación",
      "Marco de control interno institucional"
    ],
    steps: [
      {
        id: "step-3-1-1",
        sequenceNumber: 1,
        whatToDo: "Priorizar riesgos que requieren controles específicos",
        whoDoesIt: "Comité de Riesgos",
        requiredResources: ["Matriz de riesgos evaluada", "Criterios de priorización", "Metodología de ranking"],
        evidenceGenerated: "Lista priorizada de riesgos para control"
      },
      {
        id: "step-3-1-2",
        sequenceNumber: 2,
        whatToDo: "Diseñar controles específicos para cada riesgo prioritario",
        whoDoesIt: "Especialistas en Control Interno",
        requiredResources: ["Catálogo de controles", "Mejores prácticas", "Herramientas de diseño"],
        evidenceGenerated: "Especificaciones técnicas de controles diseñados"
      },
      {
        id: "step-3-1-3",
        sequenceNumber: 3,
        whatToDo: "Definir responsables y frecuencia de controles",
        whoDoesIt: "Jefes de Área",
        requiredResources: ["Organigrama funcional", "Descripción de puestos", "Calendario de operaciones"],
        evidenceGenerated: "Matriz de responsabilidades de control"
      },
      {
        id: "step-3-1-4",
        sequenceNumber: 4,
        whatToDo: "Implementar controles en procesos operativos",
        whoDoesIt: "Responsables de Control",
        requiredResources: ["Procedimientos actualizados", "Herramientas de control", "Capacitación específica"],
        evidenceGenerated: "Controles implementados y funcionando"
      },
      {
        id: "step-3-1-5",
        sequenceNumber: 5,
        whatToDo: "Establecer sistema de monitoreo de controles",
        whoDoesIt: "Unidad de Auditoría Interna",
        requiredResources: ["Indicadores de efectividad", "Sistema de alertas", "Reportes automatizados"],
        evidenceGenerated: "Sistema de monitoreo de controles operativo"
      }
    ],
    outputs: [
      "Controles específicos implementados para riesgos clave",
      "Sistema de monitoreo de efectividad de controles",
      "Reducción medible del nivel de riesgo institucional"
    ],
    estimatedDuration: "90 días",
    responsibleRole: "Coordinador de Actividades de Control",
    priority: "alta",
    frequency: "Anual",
    relatedDocuments: ["Manual de Control Interno", "COSO III", "Procedimientos Operativos"]
  },

  // 4. INFORMACIÓN Y COMUNICACIÓN
  {
    id: "wf-4-1",
    code: "4.1",
    name: "Evaluación de calidad y suficiencia de información institucional",
    componentType: "informacion_comunicacion",
    description: "Proceso para asegurar que la información institucional sea adecuada, confiable y oportuna",
    inputs: [
      "Sistemas de información actuales",
      "Necesidades de información identificadas",
      "Estándares de calidad de datos",
      "Usuarios internos y externos de información"
    ],
    steps: [
      {
        id: "step-4-1-1",
        sequenceNumber: 1,
        whatToDo: "Mapear flujos de información institucional",
        whoDoesIt: "Analista de Sistemas de Información",
        requiredResources: ["Diagramas de proceso", "Entrevistas a usuarios", "Herramientas de mapeo"],
        evidenceGenerated: "Mapa de flujos de información institucional"
      },
      {
        id: "step-4-1-2",
        sequenceNumber: 2,
        whatToDo: "Evaluar calidad de datos en sistemas críticos",
        whoDoesIt: "Especialista en Calidad de Datos",
        requiredResources: ["Herramientas de análisis de datos", "Criterios de calidad", "Muestras representativas"],
        evidenceGenerated: "Informe de evaluación de calidad de datos"
      },
      {
        id: "step-4-1-3",
        sequenceNumber: 3,
        whatToDo: "Identificar brechas de información",
        whoDoesIt: "Comité de Información",
        requiredResources: ["Análisis de necesidades", "Inventario de información", "Metodología de análisis de brechas"],
        evidenceGenerated: "Análisis de brechas de información"
      },
      {
        id: "step-4-1-4",
        sequenceNumber: 4,
        whatToDo: "Diseñar plan de mejora de información",
        whoDoesIt: "Coordinador de Tecnología",
        requiredResources: ["Análisis de brechas", "Recursos tecnológicos", "Presupuesto asignado"],
        evidenceGenerated: "Plan de mejora de sistemas de información"
      },
      {
        id: "step-4-1-5",
        sequenceNumber: 5,
        whatToDo: "Implementar mejoras y validar resultados",
        whoDoesIt: "Equipo de Implementación TI",
        requiredResources: ["Plan de mejora", "Herramientas de desarrollo", "Protocolo de validación"],
        evidenceGenerated: "Sistemas de información mejorados y validados"
      }
    ],
    outputs: [
      "Información institucional de calidad certificada",
      "Sistemas de información optimizados",
      "Usuarios satisfechos con la información disponible"
    ],
    estimatedDuration: "120 días",
    responsibleRole: "Coordinador de Información",
    priority: "media",
    frequency: "Anual",
    relatedDocuments: ["Política de Gestión de Información", "COSO IV", "Estándares ISO"]
  },

  // 5. MONITOREO Y EVALUACIÓN
  {
    id: "wf-5-1",
    code: "5.1",
    name: "Supervisión continua de la efectividad de controles",
    componentType: "supervision",
    description: "Proceso de monitoreo permanente para confirmar la vigencia y efectividad de los controles implementados",
    inputs: [
      "Controles implementados y documentados",
      "Indicadores de efectividad definidos",
      "Sistema de reporte de incidencias",
      "Cronograma de supervisión establecido"
    ],
    steps: [
      {
        id: "step-5-1-1",
        sequenceNumber: 1,
        whatToDo: "Establecer programa de supervisión continua",
        whoDoesIt: "Coordinador de Supervisión",
        requiredResources: ["Metodología de supervisión", "Cronograma anual", "Recursos humanos asignados"],
        evidenceGenerated: "Programa anual de supervisión aprobado"
      },
      {
        id: "step-5-1-2",
        sequenceNumber: 2,
        whatToDo: "Realizar supervisión periódica de controles clave",
        whoDoesIt: "Supervisores de Control",
        requiredResources: ["Check-lists de supervisión", "Acceso a sistemas", "Herramientas de evaluación"],
        evidenceGenerated: "Reportes de supervisión por control evaluado"
      },
      {
        id: "step-5-1-3",
        sequenceNumber: 3,
        whatToDo: "Analizar tendencias y patrones de efectividad",
        whoDoesIt: "Analista de Control Interno",
        requiredResources: ["Datos históricos", "Software de análisis", "Indicadores de tendencia"],
        evidenceGenerated: "Análisis de tendencias de efectividad de controles"
      },
      {
        id: "step-5-1-4",
        sequenceNumber: 4,
        whatToDo: "Identificar controles deficientes o obsoletos",
        whoDoesIt: "Comité de Evaluación",
        requiredResources: ["Criterios de evaluación", "Estándares de referencia", "Metodología de evaluación"],
        evidenceGenerated: "Lista de controles que requieren ajuste o eliminación"
      },
      {
        id: "step-5-1-5",
        sequenceNumber: 5,
        whatToDo: "Generar recomendaciones de mejora continua",
        whoDoesIt: "Coordinador de Supervisión",
        requiredResources: ["Análisis consolidado", "Mejores prácticas", "Consulta a expertos"],
        evidenceGenerated: "Informe de recomendaciones de mejora del SCI"
      }
    ],
    outputs: [
      "Sistema de supervisión continua operativo",
      "Controles optimizados y efectivos",
      "Mejora continua del sistema de control interno"
    ],
    estimatedDuration: "Continuo",
    responsibleRole: "Coordinador de Supervisión",
    priority: "alta",
    frequency: "Continua",
    relatedDocuments: ["Manual de Supervisión", "COSO V", "Procedimientos de Auditoría"]
  }
];

export function getWorkflowsByComponent(componentType: string): COSOWorkflow[] {
  return cosoWorkflows.filter(workflow => workflow.componentType === componentType);
}

export function getWorkflowById(id: string): COSOWorkflow | undefined {
  return cosoWorkflows.find(workflow => workflow.id === id);
}

export function getWorkflowByCode(code: string): COSOWorkflow | undefined {
  return cosoWorkflows.find(workflow => workflow.code === code);
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  institutionId: number;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  status: "not_started" | "in_progress" | "completed" | "cancelled";
  currentStepId?: string;
  completedSteps: string[];
  assignedTo: string;
  notes?: string;
  progress: number;
}

export interface StepExecution {
  id: string;
  stepId: string;
  workflowExecutionId: string;
  completed: boolean;
  completedBy?: string;
  completedDate?: Date;
  evidenceFiles: string[];
  notes?: string;
  approvedBy?: string;
  approvalDate?: Date;
}