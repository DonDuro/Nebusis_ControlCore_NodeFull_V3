import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import SidebarSimple from "@/components/layout/SidebarSimple";
import FloatingChatbot from "@/components/common/FloatingChatbot";
import AIToolsModal from "@/components/common/AIToolsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InstitutionDocument } from "@shared/schema";
import { AlertTriangle, FileText, Download, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/i18n";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Document types will be generated from translation keys
const getDocumentTypes = (t: any) => ({
  creation_law: { name: t('documents.types.creationLaw'), icon: "fa-gavel", color: "bg-blue-100 text-blue-800" },
  regulations: { name: t('documents.types.regulations'), icon: "fa-book", color: "bg-gray-100 text-gray-800" },
  sector_regulations: { name: t('documents.types.sectorRegulations'), icon: "fa-industry", color: "bg-gray-100 text-gray-800" },
  organigram: { name: t('documents.types.organigram'), icon: "fa-sitemap", color: "bg-blue-100 text-blue-800" },
  control_reports: { name: t('documents.types.controlReports'), icon: "fa-chart-line", color: "bg-blue-100 text-blue-800" },
  instructions: { name: t('documents.types.instructions'), icon: "fa-file-text", color: "bg-purple-100 text-purple-800" },
  policies: { name: t('documents.types.policies'), icon: "fa-clipboard-list", color: "bg-gray-100 text-gray-800" },
  procedures: { name: t('documents.types.procedures'), icon: "fa-list-ol", color: "bg-green-100 text-green-800" },
  other_documents: { name: t('documents.types.otherDocuments'), icon: "fa-file", color: "bg-gray-100 text-gray-800" },
});

// COSO Requirements Data
const nobaciRequirements = {
  ambiente_control: [
    "Código de Ética institucional",
    "Manual de funciones y responsabilidades",
    "Estructura organizacional definida",
    "Políticas de recursos humanos",
    "Comité de Ética establecido",
    "Procedimientos disciplinarios",
    "Manual de competencias laborales"
  ],
  evaluacion_riesgos: [
    "Metodología de identificación de riesgos",
    "Matriz de riesgos institucional",
    "Procedimientos de evaluación de riesgos",
    "Plan de tratamiento de riesgos",
    "Indicadores de riesgo",
    "Procedimientos de monitoreo de riesgos"
  ],
  actividades_control: [
    "Manual de procedimientos operativos",
    "Controles de autorización",
    "Políticas de segregación de funciones",
    "Controles de acceso físico y lógico",
    "Procedimientos de documentación",
    "Controles de supervisión"
  ],
  informacion_comunicacion: [
    "Política de gestión de información",
    "Procedimientos de comunicación interna",
    "Sistema de reportes institucionales",
    "Canales de comunicación ciudadana",
    "Política de transparencia",
    "Procedimientos de archivo y custodia"
  ],
  supervision: [
    "Plan de auditoría interna",
    "Procedimientos de seguimiento",
    "Sistema de indicadores de gestión",
    "Procedimientos de evaluación continua",
    "Plan de mejoramiento institucional",
    "Sistema de quejas y sugerencias"
  ]
};

export default function Documents() {
  const { t } = useTranslation();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isPolicyGeneratorOpen, setIsPolicyGeneratorOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [policyOptions, setPolicyOptions] = useState({
    generatePolicy: false,
    generateProcedure: false
  });
  const [uploadForm, setUploadForm] = useState({
    fileName: "",
    documentType: "",
    description: "",
    file: null as File | null,
  });
  const [logoForm, setLogoForm] = useState({
    fileName: "",
  });
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const documentTypes = getDocumentTypes(t);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: institution } = useQuery({
    queryKey: ["/api/institutions/1"],
    enabled: !!user,
  });

  const { data: workflows } = useQuery({
    queryKey: ["/api/workflows", { institutionId: 1 }],
    enabled: !!user,
  });

  const { data: complianceScores } = useQuery({
    queryKey: ["/api/compliance-scores", { institutionId: 1 }],
    enabled: !!user,
  });

  const { data: documents = [] } = useQuery<InstitutionDocument[]>({
    queryKey: ["/api/documents", { institutionId: 1 }],
    enabled: !!user,
  });

  // Check for scroll intent when component mounts
  useEffect(() => {
    // Check if we should scroll to analysis section
    const shouldScrollToAnalysis = sessionStorage.getItem('scrollToAnalysis');
    if (shouldScrollToAnalysis === 'true') {
      sessionStorage.removeItem('scrollToAnalysis');
      setTimeout(() => {
        const element = document.getElementById('analysis');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  const uploadMutation = useMutation({
    mutationFn: async (documentData: any) => {
      return apiRequest("POST", "/api/documents/upload", documentData);
    },
    onSuccess: () => {
      toast({
        title: t('documents.documentUploaded'),
        description: t('documents.documentUploadedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setIsUploadModalOpen(false);
      setUploadForm({ fileName: "", documentType: "", description: "", file: null });
    },
    onError: () => {
      toast({
        title: t('documents.error'),
        description: t('documents.errorUpload'),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      toast({
        title: t('documents.documentDeleted'),
        description: t('documents.documentDeletedSuccess'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: () => {
      toast({
        title: t('documents.error'),
        description: t('documents.errorDelete'),
        variant: "destructive",
      });
    },
  });

  const logoUploadMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/institutions/${institution?.id}/logo`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/institutions/1"] });
      setIsLogoModalOpen(false);
      setLogoForm({ fileName: "" });
      toast({
        title: t('documents.logoUpdated'),
        description: t('documents.logoUpdatedSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('documents.error'),
        description: t('documents.errorLogo'),
        variant: "destructive",
      });
    },
  });

  const analyzeDocumentsMutation = useMutation({
    mutationFn: async () => {
      // Create mock analysis with translated content
      const getComponentName = (component: string) => {
        switch (component) {
          case "ambiente_control": return t('coso.components.controlEnvironment');
          case "evaluacion_riesgos": return t('coso.components.riskAssessment');
          case "actividades_control": return t('coso.components.controlActivities');
          case "informacion_comunicacion": return t('coso.components.informationCommunication');
          case "supervision": return t('coso.components.monitoring');
          default: return component;
        }
      };

      const getMissingRequirements = (component: string) => {
        switch (component) {
          case "ambiente_control":
            return [
              t('lang') === 'es' ? "Código de Ética institucional" : "Institutional Code of Ethics",
              t('lang') === 'es' ? "Comité de Ética establecido" : "Established Ethics Committee", 
              t('lang') === 'es' ? "Manual de competencias laborales" : "Job Competency Manual"
            ];
          case "evaluacion_riesgos":
            return [
              t('lang') === 'es' ? "Metodología de identificación de riesgos" : "Risk Identification Methodology",
              t('lang') === 'es' ? "Matriz de riesgos institucional" : "Institutional Risk Matrix",
              t('lang') === 'es' ? "Indicadores de riesgo" : "Risk Indicators"
            ];
          case "actividades_control":
            return [
              t('lang') === 'es' ? "Políticas de segregación de funciones" : "Segregation of Duties Policies",
              t('lang') === 'es' ? "Controles de acceso físico y lógico" : "Physical and Logical Access Controls"
            ];
          case "informacion_comunicacion":
            return [
              t('lang') === 'es' ? "Política de gestión de información" : "Information Management Policy",
              t('lang') === 'es' ? "Canales de comunicación ciudadana" : "Citizen Communication Channels",
              t('lang') === 'es' ? "Política de transparencia" : "Transparency Policy"
            ];
          case "supervision":
            return [
              t('lang') === 'es' ? "Plan de auditoría interna" : "Internal Audit Plan",
              t('lang') === 'es' ? "Sistema de indicadores de gestión" : "Management Indicators System",
              t('lang') === 'es' ? "Plan de mejoramiento institucional" : "Institutional Improvement Plan"
            ];
          default:
            return [];
        }
      };

      const mockAnalysis = {
        totalRequirements: 32,
        coveredRequirements: 18,
        missingRequirements: [
          {
            component: "ambiente_control",
            componentName: getComponentName("ambiente_control"),
            missing: getMissingRequirements("ambiente_control")
          },
          {
            component: "evaluacion_riesgos", 
            componentName: getComponentName("evaluacion_riesgos"),
            missing: getMissingRequirements("evaluacion_riesgos")
          },
          {
            component: "actividades_control",
            componentName: getComponentName("actividades_control"), 
            missing: getMissingRequirements("actividades_control")
          },
          {
            component: "informacion_comunicacion",
            componentName: getComponentName("informacion_comunicacion"),
            missing: getMissingRequirements("informacion_comunicacion")
          },
          {
            component: "supervision",
            componentName: getComponentName("supervision"),
            missing: getMissingRequirements("supervision")
          }
        ],
        coveragePercentage: 56
      };
      
      return new Promise(resolve => {
        setTimeout(() => resolve(mockAnalysis), 2000);
      });
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      setIsAnalysisModalOpen(true);
      toast({
        title: t('documents.analysisCompleted'),
        description: t('documents.analysisCompletedSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('documents.error'),
        description: t('documents.errorAnalysis'),
        variant: "destructive",
      });
    },
  });

  const generatePolicyMutation = useMutation({
    mutationFn: async ({ requirement, options }: { requirement: string, options: { generatePolicy: boolean, generateProcedure: boolean } }) => {
      // Simulate policy/procedure generation
      const mockGeneration = {
        requirement,
        policy: options.generatePolicy ? `POLÍTICA: ${requirement}\n\n1. OBJETIVO\nEstablecer las directrices y lineamientos para la implementación de ${requirement.toLowerCase()} en la institución.\n\n2. ALCANCE\nEsta política aplica a todos los servidores públicos de la institución.\n\n3. RESPONSABILIDADES\n- Dirección General: Aprobar y comunicar la política\n- Recursos Humanos: Implementar y dar seguimiento\n- Servidores públicos: Cumplir con las disposiciones\n\n4. DISPOSICIONES GENERALES\n4.1 La institución se compromete a mantener altos estándares de ${requirement.toLowerCase()}\n4.2 Se realizarán revisiones periódicas de esta política\n4.3 El incumplimiento será sancionado conforme a la normativa vigente` : null,
        procedure: options.generateProcedure ? `PROCEDIMIENTO: ${requirement}\n\nPASO 1: PREPARACIÓN\n- Revisar la documentación existente\n- Identificar los recursos necesarios\n- Definir responsables\n\nPASO 2: IMPLEMENTACIÓN\n- Ejecutar las actividades planificadas\n- Documentar todos los procesos\n- Comunicar a las partes interesadas\n\nPASO 3: SEGUIMIENTO\n- Monitorear el cumplimiento\n- Realizar evaluaciones periódicas\n- Implementar mejoras continuas\n\nPASO 4: REVISIÓN\n- Evaluar la efectividad\n- Actualizar según sea necesario\n- Reportar resultados a la dirección` : null
      };
      
      return new Promise(resolve => {
        setTimeout(() => resolve(mockGeneration), 1500);
      });
    },
    onSuccess: (data) => {
      // Create downloadable content
      let content = "";
      if (data.policy) content += data.policy + "\n\n";
      if (data.procedure) content += data.procedure;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.requirement.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsPolicyGeneratorOpen(false);
      setPolicyOptions({ generatePolicy: false, generateProcedure: false });
      setSelectedRequirement(null);
      
      toast({
        title: t('documents.documentGenerated'),
        description: t('documents.documentGeneratedSuccess'),
      });
    },
    onError: () => {
      toast({
        title: t('documents.error'),
        description: t('documents.errorGenerate'),
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        file: file,
        fileName: file.name
      }));
    }
  };

  const handleUpload = () => {
    if (!uploadForm.file || !uploadForm.documentType) {
      toast({
        title: t('documents.error'),
        description: t('documents.errorRequired'),
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      institutionId: 1,
      fileName: uploadForm.file.name,
      originalName: uploadForm.file.name,
      documentType: uploadForm.documentType,
      description: uploadForm.description,
      fileSize: uploadForm.file.size,
      mimeType: uploadForm.file.type,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return t('documents.noDate') || "No date";
    // Use current language for date formatting
    const locale = t('lang') === 'es' ? 'es-ES' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || !institution) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dr-blue mx-auto"></div>
          <p className="mt-4 text-dr-neutral">{t('documents.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nebusis-bg">
      <Header 
        user={user} 
        institution={institution} 
        onMobileMenuToggle={() => setSidebarOpen(true)}
      />
      
      <div className="flex h-screen pt-16">
        <SidebarSimple 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto lg:ml-0">
          <div className="p-4 sm:p-6 max-w-full">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-nebusis-slate">{t('documents.institutionalDocuments')}</h1>
                  <p className="text-nebusis-muted mt-1">{t('documents.contextualDocuments')}</p>
                </div>
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                  <DialogTrigger asChild>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="bg-nebusis-blue text-white hover:bg-nebusis-blue/90 text-sm w-full sm:w-auto">
                            <i className="fas fa-upload mr-2"></i>
{t('documents.upload')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('documents.uploadToPersonalize')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>{t('documents.uploadInstitutional')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-nebusis-slate">{t('documents.selectFile')} *</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.rtf"
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-dr-blue file:text-white hover:file:bg-dr-blue/90"
                          />
                        </div>
                        {uploadForm.file && (
                          <p className="text-xs text-gray-500 mt-1">
                            {t('documents.selectedFile')}: {uploadForm.file.name} ({formatFileSize(uploadForm.file.size)})
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-nebusis-slate">{t('documents.type')} *</label>
                        <Select value={uploadForm.documentType} onValueChange={(value) => setUploadForm(prev => ({ ...prev, documentType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('documents.selectType')} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(documentTypes).map(([key, type]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center space-x-2">
                                  <i className={`fas ${type.icon}`}></i>
                                  <span>{type.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-nebusis-slate">{t('documents.description')}</label>
                        <Textarea
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder={t('documents.optionalDescription')}
                          rows={3}
                        />
                      </div>
                      <Button 
                        onClick={handleUpload}
                        disabled={uploadMutation.isPending}
                        className="w-full bg-nebusis-blue text-white hover:bg-nebusis-blue/90"
                      >
{uploadMutation.isPending ? t('documents.uploading') : t('documents.upload')}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mb-6 bg-nebusis-blue rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-white mt-1"></i>
                <div>
                  <h3 className="font-bold text-white mb-1">{t('documents.smartPersonalization')}</h3>
                  <p className="text-sm text-white">
                    {t('documents.personalizeText')}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(documentTypes).map(([key, type]) => {
                const categoryDocs = documents?.filter((doc: InstitutionDocument) => doc.documentType === key) || [];
                
                return (
                  <Card key={key} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <i className={`fas ${type.icon} text-dr-blue`}></i>
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                        </div>
                        <Badge variant="secondary">{categoryDocs.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {categoryDocs.length === 0 ? (
                        <p className="text-sm text-dr-neutral">{t('documents.noDocumentsUploadedYet')}</p>
                      ) : (
                        <div className="space-y-2">
                          {categoryDocs.slice(0, 2).map((doc: InstitutionDocument) => (
                            <div key={doc.id} className="text-sm">
                              <p className="font-medium text-gray-900 truncate">{doc.originalName}</p>
                              <p className="text-xs text-dr-neutral">{formatDate(doc.createdAt || "")}</p>
                            </div>
                          ))}
                          {categoryDocs.length > 2 && (
                            <p className="text-xs text-dr-blue">+{categoryDocs.length - 2} {t('documents.more')}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* All Documents List */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('documents.allDocuments')}</CardTitle>
              </CardHeader>
              <CardContent>
                {!documents || documents.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-file-upload text-gray-400 text-6xl mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('documents.noDocumentsUploaded')}</h3>
                    <p className="text-gray-500 mb-6">
                      {t('documents.uploadKeyDocuments')}
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-dr-light-blue text-white hover:bg-dr-blue"
                          >
                            <i className="fas fa-upload mr-2"></i>
{t('documents.uploadFirst')}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('documents.uploadToPersonalize')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc: InstitutionDocument) => {
                      const docType = documentTypes[doc.documentType as keyof typeof documentTypes];
                      
                      return (
                        <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-dr-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                              <i className={`fas ${docType?.icon || "fa-file"} text-dr-blue`}></i>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.originalName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-dr-neutral">
                                <Badge className={docType?.color}>{docType?.name}</Badge>
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <span>{formatDate(doc.createdAt || "")}</span>
                              </div>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.analyzedAt ? (
                              <Badge className="bg-green-100 text-green-800">
                                <i className="fas fa-check mr-1"></i>
{t('documents.analyzed')}
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <i className="fas fa-clock mr-1"></i>
{t('documents.pending')}
                              </Badge>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteMutation.mutate(doc.id)}
                                    disabled={deleteMutation.isPending}
                                  >
                                    <i className="fas fa-trash text-red-500"></i>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t('documents.deleteDocument')}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* COSO Analysis Section */}
            <Card id="analysis" className="mb-8 border-2 border-dr-blue bg-gradient-to-r from-dr-blue/5 to-dr-light-blue/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-dr-blue" />
                    <div>
                      <CardTitle className="text-xl text-dr-blue">{t('documents.cosoAnalysis')}</CardTitle>
                      <p className="text-sm text-dr-neutral mt-1">
                        {t('documents.cosoAnalysisDescription')}
                      </p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => analyzeDocumentsMutation.mutate()}
                          disabled={analyzeDocumentsMutation.isPending || !documents || documents.length === 0}
                          className="bg-dr-blue hover:bg-dr-blue/90 text-white"
                        >
                          {analyzeDocumentsMutation.isPending ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>{t('documents.analyzing')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>{t('documents.startAnalysis')}</span>
                            </div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('documents.cosoAnalysisDescription')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-dr-blue mb-2">{t('documents.analysisTitle')}</h4>
                  <ul className="text-sm text-dr-neutral space-y-1">
                    <li>• {t('documents.analysisPoint1')}</li>
                    <li>• {t('documents.analysisPoint2')}</li>
                    <li>• {t('documents.analysisPoint3')}</li>
                    <li>• {t('documents.analysisPoint4')}</li>
                  </ul>
                  {!documents || documents.length === 0 && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {t('documents.uploadAtLeastOne')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <FloatingChatbot onClick={() => setIsAIModalOpen(true)} />
      <AIToolsModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* COSO Analysis Results Modal */}
      <Dialog open={isAnalysisModalOpen} onOpenChange={setIsAnalysisModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-dr-blue" />
              <span>{t('documents.analysisResults')}</span>
            </DialogTitle>
          </DialogHeader>
          
          {analysisResults && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-dr-blue/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dr-blue">{t('documents.analysisSummary')}</h3>
                  <Badge variant="outline" className="text-dr-blue border-dr-blue">
                    {analysisResults.coveragePercentage}% {t('documents.coverage')}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dr-blue">{analysisResults.totalRequirements}</div>
                    <div className="text-sm text-dr-neutral">{t('documents.totalRequirements')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analysisResults.coveredRequirements}</div>
                    <div className="text-sm text-dr-neutral">{t('documents.covered')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{analysisResults.totalRequirements - analysisResults.coveredRequirements}</div>
                    <div className="text-sm text-dr-neutral">{t('documents.missing')}</div>
                  </div>
                </div>
                <Progress value={analysisResults.coveragePercentage} className="h-3" />
              </div>

              {/* Missing Requirements by Component */}
              <div>
                <h3 className="text-lg font-semibold text-dr-blue mb-4">{t('documents.missingRequirementsByComponent')}</h3>
                <Tabs defaultValue={analysisResults.missingRequirements[0]?.component} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    {analysisResults.missingRequirements.map((component: any) => (
                      <TabsTrigger key={component.component} value={component.component} className="text-xs">
                        {component.componentName.split(' ')[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {analysisResults.missingRequirements.map((component: any) => (
                    <TabsContent key={component.component} value={component.component} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{component.componentName}</h4>
                        <Badge variant="destructive">{component.missing.length} {t('documents.missingCount')}</Badge>
                      </div>
                      
                      <div className="grid gap-3">
                        {component.missing.map((requirement: string, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center space-x-3">
                              <XCircle className="w-5 h-5 text-red-500" />
                              <span className="text-sm font-medium text-gray-900">{requirement}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedRequirement({ component: component.component, requirement });
                                setIsPolicyGeneratorOpen(true);
                              }}
                              className="bg-dr-blue hover:bg-dr-blue/90 text-white"
                            >
                              {t('documents.generateDocument')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Policy Generator Modal */}
      <Dialog open={isPolicyGeneratorOpen} onOpenChange={setIsPolicyGeneratorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-dr-blue" />
              <span>Generar Documento COSO</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequirement && (
            <div className="space-y-6">
              <div className="bg-dr-blue/5 rounded-lg p-4">
                <h4 className="font-semibold text-dr-blue mb-2">Requisito Seleccionado</h4>
                <p className="text-sm text-gray-900">{selectedRequirement.requirement}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">¿Qué deseas generar?</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="policy"
                      checked={policyOptions.generatePolicy}
                      onCheckedChange={(checked) => 
                        setPolicyOptions(prev => ({ ...prev, generatePolicy: checked as boolean }))
                      }
                    />
                    <label htmlFor="policy" className="text-sm font-medium">
                      Política institucional
                    </label>
                  </div>
                  <div className="text-xs text-dr-neutral ml-6">
                    Documento que establece las directrices y lineamientos generales
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="procedure"
                      checked={policyOptions.generateProcedure}
                      onCheckedChange={(checked) => 
                        setPolicyOptions(prev => ({ ...prev, generateProcedure: checked as boolean }))
                      }
                    />
                    <label htmlFor="procedure" className="text-sm font-medium">
                      Procedimiento operativo
                    </label>
                  </div>
                  <div className="text-xs text-dr-neutral ml-6">
                    Documento con pasos específicos para implementar la política
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPolicyGeneratorOpen(false);
                    setPolicyOptions({ generatePolicy: false, generateProcedure: false });
                    setSelectedRequirement(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (policyOptions.generatePolicy || policyOptions.generateProcedure) {
                      generatePolicyMutation.mutate({
                        requirement: selectedRequirement.requirement,
                        options: policyOptions
                      });
                    }
                  }}
                  disabled={(!policyOptions.generatePolicy && !policyOptions.generateProcedure) || generatePolicyMutation.isPending}
                  className="flex-1 bg-dr-blue hover:bg-dr-blue/90 text-white"
                >
                  {generatePolicyMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Generar</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}