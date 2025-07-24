import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  FileText, 
  Download,
  Upload,
  AlertCircle,
  Target
} from "lucide-react";
import { cosoWorkflows, getWorkflowsByComponent, type COSOWorkflow, type WorkflowStep } from "@/data/coso-workflows";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useQuery } from "@tanstack/react-query";

const componentTypes = [
  { id: "ambiente_control", name: "Ambiente de Control", color: "bg-blue-500" },
  { id: "evaluacion_riesgos", name: "Evaluación de Riesgos", color: "bg-orange-500" },
  { id: "actividades_control", name: "Actividades de Control", color: "bg-green-500" },
  { id: "informacion_comunicacion", name: "Información y Comunicación", color: "bg-purple-500" },
  { id: "supervision", name: "Supervisión", color: "bg-red-500" }
];

export default function WorkflowExecution() {
  const { user } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState("ambiente_control");
  const [selectedWorkflow, setSelectedWorkflow] = useState<COSOWorkflow | null>(null);
  const [executionDialog, setExecutionDialog] = useState(false);
  const [stepDialog, setStepDialog] = useState<{ open: boolean; step: WorkflowStep | null }>({ open: false, step: null });

  // Get data for sidebar
  const { data: workflows = [] } = useWorkflows(user?.institutionId || 1);
  const { data: complianceScores = [] } = useQuery({
    queryKey: ["/api/compliance-scores", user?.institutionId],
    enabled: !!user?.institutionId
  });

  const { data: institution } = useQuery({
    queryKey: ["/api/institutions", user?.institutionId],
    enabled: !!user?.institutionId
  });

  const componentWorkflows = getWorkflowsByComponent(selectedComponent);

  const handleExecuteWorkflow = (workflow: COSOWorkflow) => {
    setSelectedWorkflow(workflow);
    setExecutionDialog(true);
  };

  const handleStepDetail = (step: WorkflowStep) => {
    setStepDialog({ open: true, step });
  };

  const exportWorkflowToPDF = (workflow: COSOWorkflow) => {
    // Implementation for PDF export
    console.log("Exporting workflow to PDF:", workflow.name);
  };

  if (!user || !institution) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-dr-bg">
      <Header user={user} institution={institution} />
      
      <div className="flex h-screen pt-16">
        <Sidebar 
          workflows={workflows} 
          complianceScores={complianceScores}
          overallProgress={70}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Flujos de Trabajo COSO</h1>
                  <p className="text-gray-600">
                    Procesos estructurados para implementar control interno
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => exportWorkflowToPDF(componentWorkflows[0])}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Component Selector */}
            <Tabs value={selectedComponent} onValueChange={setSelectedComponent} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                {componentTypes.map((component) => (
                  <TabsTrigger key={component.id} value={component.id} className="text-xs">
                    {component.name.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Workflow List */}
            <div className="space-y-6">
              {componentWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {workflow.code}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className={`${componentTypes.find(c => c.id === workflow.componentType)?.color} text-white`}
                          >
                            {workflow.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{workflow.name}</CardTitle>
                        <CardDescription className="text-base mb-3">
                          {workflow.description}
                        </CardDescription>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{workflow.responsibleRole}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{workflow.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{workflow.frequency}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleExecuteWorkflow(workflow)}
                          className="bg-dr-blue hover:bg-dr-dark-blue"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Ejecutar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Workflow Summary */}
                    <div className="grid grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Elementos de Entrada</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {workflow.inputs.slice(0, 3).map((input, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-dr-blue">•</span>
                              {input}
                            </li>
                          ))}
                          {workflow.inputs.length > 3 && (
                            <li className="text-dr-blue text-xs">+{workflow.inputs.length - 3} más</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Resultados Esperados</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {workflow.outputs.slice(0, 3).map((output, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              {output}
                            </li>
                          ))}
                          {workflow.outputs.length > 3 && (
                            <li className="text-green-600 text-xs">+{workflow.outputs.length - 3} más</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Steps Preview */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Pasos del Proceso ({workflow.steps.length} pasos)
                      </h4>
                      <div className="space-y-2">
                        {workflow.steps.slice(0, 3).map((step) => (
                          <div 
                            key={step.id} 
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => handleStepDetail(step)}
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-dr-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {step.sequenceNumber}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{step.whatToDo}</p>
                              <p className="text-xs text-gray-600">Responsable: {step.whoDoesIt}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        ))}
                        {workflow.steps.length > 3 && (
                          <div className="text-center">
                            <Button variant="outline" size="sm" onClick={() => handleExecuteWorkflow(workflow)}>
                              Ver todos los {workflow.steps.length} pasos
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workflow Execution Dialog */}
            <Dialog open={executionDialog} onOpenChange={setExecutionDialog}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-dr-blue" />
                    {selectedWorkflow?.name}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedWorkflow && (
                  <div className="space-y-6">
                    {/* Workflow Info */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Información del Proceso</h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Código:</strong> {selectedWorkflow.code}</div>
                          <div><strong>Responsable:</strong> {selectedWorkflow.responsibleRole}</div>
                          <div><strong>Duración:</strong> {selectedWorkflow.estimatedDuration}</div>
                          <div><strong>Frecuencia:</strong> {selectedWorkflow.frequency}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Progreso de Ejecución</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completado</span>
                            <span>0 / {selectedWorkflow.steps.length} pasos</span>
                          </div>
                          <Progress value={0} className="h-2" />
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Play className="h-3 w-3 mr-1" />
                              Iniciar
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Exportar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Steps Execution */}
                    <div>
                      <h3 className="font-semibold mb-4">Pasos de Ejecución</h3>
                      <div className="space-y-4">
                        {selectedWorkflow.steps.map((step) => (
                          <Card key={step.id} className="border-l-4 border-l-gray-300">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-medium">
                                  {step.sequenceNumber}
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                  <div>
                                    <h4 className="font-medium mb-1">{step.whatToDo}</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                      <div><strong>Responsable:</strong> {step.whoDoesIt}</div>
                                      <div><strong>Evidencia:</strong> {step.evidenceGenerated}</div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs font-medium text-gray-700">Recursos Requeridos:</Label>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {step.requiredResources.map((resource, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {resource}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Input placeholder="Notas del paso..." className="flex-1 h-8 text-sm" />
                                    <Button size="sm" variant="outline" className="h-8">
                                      <Upload className="h-3 w-3 mr-1" />
                                      Evidencia
                                    </Button>
                                    <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Step Detail Dialog */}
            <Dialog open={stepDialog.open} onOpenChange={(open) => setStepDialog({ open, step: stepDialog.step })}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Detalle del Paso</DialogTitle>
                </DialogHeader>
                
                {stepDialog.step && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Paso {stepDialog.step.sequenceNumber}</h3>
                      <p className="text-gray-700">{stepDialog.step.whatToDo}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium">Responsable</Label>
                        <p className="text-sm text-gray-600">{stepDialog.step.whoDoesIt}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Evidencia Generada</Label>
                        <p className="text-sm text-gray-600">{stepDialog.step.evidenceGenerated}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-medium">Recursos Requeridos</Label>
                      <ul className="mt-1 space-y-1">
                        {stepDialog.step.requiredResources.map((resource, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="text-dr-blue">•</span>
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}