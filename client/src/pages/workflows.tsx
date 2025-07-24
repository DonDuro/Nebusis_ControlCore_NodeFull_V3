import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import SidebarSimple from "@/components/layout/SidebarSimple";
import WorkflowList from "@/components/workflows/WorkflowList";
import FloatingChatbot from "@/components/common/FloatingChatbot";
import AIToolsModal from "@/components/common/AIToolsModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  User as UserIcon, 
  Calendar, 
  FileText, 
  Download,
  Upload,
  AlertCircle,
  Target,
  Plus
} from "lucide-react";
import { cosoWorkflows, getWorkflowsByComponent, type COSOWorkflow, type WorkflowStep } from "@/data/coso-workflows";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { type User, type Institution } from "@shared/schema";
import { useTranslation } from "@/i18n";

// Component types will be generated from translation keys
const getComponentTypes = (t: any) => [
  { 
    id: "ambiente_control", 
    name: t('workflows.components.controlEnvironment.name'), 
    color: "bg-blue-500",
    description: t('workflows.components.controlEnvironment.description'),
    subcomponents: [
      t('workflows.components.controlEnvironment.sub1'),
      t('workflows.components.controlEnvironment.sub2'), 
      t('workflows.components.controlEnvironment.sub3'),
      t('workflows.components.controlEnvironment.sub4'),
      t('workflows.components.controlEnvironment.sub5')
    ]
  },
  { 
    id: "evaluacion_riesgos", 
    name: t('workflows.components.riskAssessment.name'), 
    color: "bg-orange-500",
    description: t('workflows.components.riskAssessment.description'),
    subcomponents: [
      t('workflows.components.riskAssessment.sub1'),
      t('workflows.components.riskAssessment.sub2'),
      t('workflows.components.riskAssessment.sub3'),
      t('workflows.components.riskAssessment.sub4')
    ]
  },
  { 
    id: "actividades_control", 
    name: t('workflows.components.controlActivities.name'), 
    color: "bg-green-500",
    description: t('workflows.components.controlActivities.description'),
    subcomponents: [
      t('workflows.components.controlActivities.sub1'),
      t('workflows.components.controlActivities.sub2'),
      t('workflows.components.controlActivities.sub3'),
      t('workflows.components.controlActivities.sub4')
    ]
  },
  { 
    id: "informacion_comunicacion", 
    name: t('workflows.components.informationCommunication.name'), 
    color: "bg-purple-500",
    description: t('workflows.components.informationCommunication.description'),
    subcomponents: [
      t('workflows.components.informationCommunication.sub1'),
      t('workflows.components.informationCommunication.sub2'), 
      t('workflows.components.informationCommunication.sub3'),
      t('workflows.components.informationCommunication.sub4')
    ]
  },
  { 
    id: "supervision", 
    name: t('workflows.components.monitoring.name'), 
    color: "bg-red-500",
    description: t('workflows.components.monitoring.description'),
    subcomponents: [
      t('workflows.components.monitoring.sub1'),
      t('workflows.components.monitoring.sub2'),
      t('workflows.components.monitoring.sub3'),
      t('workflows.components.monitoring.sub4')
    ]
  }
];

export default function Workflows() {
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("ambiente_control");
  const [selectedWorkflow, setSelectedWorkflow] = useState<COSOWorkflow | null>(null);
  const [executionDialog, setExecutionDialog] = useState(false);
  const [createWorkflowDialog, setCreateWorkflowDialog] = useState(false);
  const [newWorkflowData, setNewWorkflowData] = useState({
    componentType: "",
    subcomponent: "",
    name: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high"
  });

  // Handle component parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const componentParam = urlParams.get('component');
    if (componentParam && componentTypes.some(c => c.id === componentParam)) {
      setSelectedComponent(componentParam);
    }
  }, [location, setSelectedComponent]);

  // Get workflows for selected component
  const getWorkflowsForComponent = (componentType: string) => {
    return getWorkflowsByComponent(componentType);
  };

  // Handle creating new workflow for subcomponent
  const handleCreateWorkflow = (componentType: string, subcomponent: string) => {
    const component = componentTypes.find(c => c.id === componentType);
    setNewWorkflowData({
      componentType,
      subcomponent,
      name: `Flujo de ${subcomponent}`,
      description: `Proceso de implementación para ${subcomponent} en ${component?.name}`,
      priority: "medium"
    });
    setCreateWorkflowDialog(true);
  };

  const selectedComponentWorkflows = getWorkflowsForComponent(selectedComponent);
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: institution } = useQuery({
    queryKey: ["/api/institutions/1"],
    enabled: !!user,
  });

  const { data: workflows } = useQuery({
    queryKey: ["/api/workflows", user?.institutionId],
    enabled: !!user?.institutionId,
  });

  // Create workflow mutation
  const createWorkflowMutation = useMutation({
    mutationFn: async (workflowData: any) => {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflowData.name,
          description: workflowData.description,
          componentType: workflowData.componentType,
          institutionId: user?.institutionId || 1,
          assignedToId: user?.id,
          priority: workflowData.priority,
          subcomponent: workflowData.subcomponent
        }),
      });
      if (!response.ok) {
        throw new Error('Error al crear el flujo de trabajo');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Flujo creado exitosamente",
        description: "El nuevo flujo de trabajo ha sido creado y está listo para usar.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/workflows'] });
      setCreateWorkflowDialog(false);
      setNewWorkflowData({
        componentType: "",
        subcomponent: "",
        name: "",
        description: "",
        priority: "medium"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear flujo",
        description: error.message || "No se pudo crear el flujo de trabajo.",
        variant: "destructive",
      });
    },
  });

  // Add default values to prevent errors with complete User type
  const userData: User = user || {
    id: 0,
    email: "",
    firstName: "Usuario",
    lastName: "",
    role: "user",
    supervisorId: null,
    institutionId: null,
    emailNotifications: true,
    createdAt: null,
    updatedAt: null,
  };

  // Add default values to prevent errors with complete Institution type
  const institutionData: Institution = institution || {
    id: 0,
    name: t('common.institution'),
    type: "",
    size: "",
    legalBasis: null,
    sectorRegulations: null,
    logoUrl: null,
    createdAt: null,
  };

  const componentTypes = getComponentTypes(t);

  return (
    <div className="min-h-screen bg-nebusis-background">
      <Header 
        user={userData} 
        institution={institutionData}
        onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex pt-16">
        <SidebarSimple isOpen={sidebarOpen} />
        
        <main className="flex-1 lg:ml-0 transition-all duration-300 ease-in-out">
          <div className="pl-2 pr-4 py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-nebusis-slate mb-2">
                {t('workflows.title')}
              </h1>
              <p className="text-nebusis-muted">
                {t('workflows.subtitle')}
              </p>
            </div>

            <Tabs value={selectedComponent} onValueChange={setSelectedComponent} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4 h-auto">
                {componentTypes.map((component) => (
                  <TabsTrigger 
                    key={component.id} 
                    value={component.id} 
                    className={cn(
                      "flex-col gap-1 h-auto py-3 px-2 text-xs font-medium transition-all",
                      "data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-blue-600",
                      "data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105",
                      "hover:bg-gray-100"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full mb-1", component.color)}></div>
                    <span className="leading-tight text-center">
                      {component.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] opacity-75 leading-tight text-center">
                      {component.name.split(' ').slice(1).join(' ')}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {componentTypes.map((component) => (
                <TabsContent key={component.id} value={component.id}>
                  <div className="space-y-4">
                    {/* Component Header with Subcomponents */}
                    <Card className={cn("border-l-4 bg-gradient-to-r from-blue-50 to-white", `border-l-${component.color.replace('bg-', '')}-500`)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", component.color)}>
                              <span className="text-sm font-bold">{component.name.charAt(0)}</span>
                            </div>
                            <div>
                              <CardTitle className="text-xl text-gray-900">{component.name}</CardTitle>
                              <CardDescription className="text-base mt-1">{component.description}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-sm">
                            {component.subcomponents.length} {t('workflows.subcomponents')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {component.subcomponents.map((subcomponent, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", component.color)}></div>
                                <span className="text-sm text-gray-700">{subcomponent}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleCreateWorkflow(component.id, subcomponent)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {t('common.create')}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Workflows */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        {t('workflows.workflowsTitle')}
                      </h3>
                      {getWorkflowsByComponent(component.id).length > 0 ? (
                        <div className="grid gap-4">
                          {getWorkflowsByComponent(component.id).map((workflow) => (
                            <Card key={workflow.id} className="border-l-4 hover:shadow-md transition-shadow" style={{borderLeftColor: component.color.replace('bg-', '#')}}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <div className={cn("w-3 h-3 rounded-full", component.color)}></div>
                                    {workflow.name}
                                  </CardTitle>
                                  <Badge variant="outline">{workflow.priority}</Badge>
                                </div>
                                <CardDescription>{workflow.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {workflow.estimatedDuration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <UserIcon className="h-4 w-4" />
                                      {workflow.responsibleRole}
                                    </span>
                                  </div>
                                  <Button onClick={() => {
                                    setSelectedWorkflow(workflow);
                                    setExecutionDialog(true);
                                  }}>
                                    <Play className="h-4 w-4 mr-2" />
                                    {t('common.execute')}
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{t('workflows.steps')}: {workflow.steps.length}</span>
                                    <span>{t('workflows.progress')}: 0%</span>
                                  </div>
                                  <Progress value={0} className="h-2" />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('workflows.noWorkflows')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}

              {/* Workflow Execution Dialog */}
              <Dialog open={executionDialog} onOpenChange={setExecutionDialog}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{t('workflows.execute')}: {selectedWorkflow?.name}</DialogTitle>
                  </DialogHeader>
                  {selectedWorkflow && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                          <div className="text-sm font-medium">{t('workflows.estimatedDuration')}</div>
                          <div className="text-lg">{selectedWorkflow.estimatedDuration}</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <UserIcon className="h-8 w-8 mx-auto mb-2 text-green-500" />
                          <div className="text-sm font-medium">{t('workflows.responsible')}</div>
                          <div className="text-lg">{selectedWorkflow.responsibleRole}</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                          <div className="text-sm font-medium">{t('workflows.totalSteps')}</div>
                          <div className="text-lg">{selectedWorkflow.steps.length}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">{t('workflows.workflowSteps')}</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedWorkflow.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 p-3 border rounded-lg">
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{step.name}</div>
                                <div className="text-sm text-gray-600">{step.description}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Duración: {step.estimatedDuration}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setExecutionDialog(false)}>
                          Cerrar
                        </Button>
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Ejecución
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Create Workflow Dialog */}
              <Dialog open={createWorkflowDialog} onOpenChange={setCreateWorkflowDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Flujo de Trabajo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="workflowName">Nombre del Flujo</Label>
                      <Input
                        id="workflowName"
                        value={newWorkflowData.name}
                        onChange={(e) => setNewWorkflowData({...newWorkflowData, name: e.target.value})}
                        placeholder="Nombre del flujo de trabajo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workflowDescription">Descripción</Label>
                      <textarea
                        id="workflowDescription"
                        value={newWorkflowData.description}
                        onChange={(e) => setNewWorkflowData({...newWorkflowData, description: e.target.value})}
                        placeholder="Descripción del flujo de trabajo"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none h-20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workflowPriority">Prioridad</Label>
                      <select
                        id="workflowPriority"
                        value={newWorkflowData.priority}
                        onChange={(e) => setNewWorkflowData({...newWorkflowData, priority: e.target.value as "low" | "medium" | "high"})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-900">Componente: {componentTypes.find(c => c.id === newWorkflowData.componentType)?.name}</div>
                      <div className="text-sm text-blue-700">Subcomponente: {newWorkflowData.subcomponent}</div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCreateWorkflowDialog(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        onClick={() => createWorkflowMutation.mutate(newWorkflowData)}
                        disabled={createWorkflowMutation.isPending || !newWorkflowData.name}
                      >
                        {createWorkflowMutation.isPending ? "Creando..." : "Crear Flujo"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Tabs>

          </div>
        </main>
      </div>

      <FloatingChatbot 
        isOpen={isAIModalOpen} 
        onToggle={() => setIsAIModalOpen(!isAIModalOpen)} 
      />
      
      <AIToolsModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        user={userData}
        institution={institutionData}
      />
    </div>
  );
}