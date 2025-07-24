import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import SidebarSimple from "@/components/layout/SidebarSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileText, Link as LinkIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/i18n";

interface ChecklistItem {
  id: number;
  code: string;
  requirement: string;
  verificationQuestion: string;
  componentType: string;
}

interface ChecklistResponse {
  id: number;
  checklistItemId: number;
  workflowId: number;
  response: "cumple" | "no_cumple" | "parcialmente";
  observations?: string;
  linkedDocumentIds?: number[];
  createdAt: string;
}

interface InstitutionDocument {
  id: number;
  fileName: string;
  originalName: string;
  documentType: string;
  description?: string;
  createdAt: string;
}

// Component types will be defined inside component to use translation

export default function Verification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedComponent, setSelectedComponent] = useState("ambiente_control");
  
  // Component types with translations
  const componentTypes = [
    { id: "ambiente_control", name: t('verification.components.ambiente_control.name'), description: t('verification.components.ambiente_control.description') },
    { id: "evaluacion_riesgos", name: t('verification.components.evaluacion_riesgos.name'), description: t('verification.components.evaluacion_riesgos.description') },
    { id: "actividades_control", name: t('verification.components.actividades_control.name'), description: t('verification.components.actividades_control.description') },
    { id: "informacion_comunicacion", name: t('verification.components.informacion_comunicacion.name'), description: t('verification.components.informacion_comunicacion.description') },
    { id: "supervision", name: t('verification.components.supervision.name'), description: t('verification.components.supervision.description') }
  ];
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null);
  const [documentDialog, setDocumentDialog] = useState<{ open: boolean; itemId: number | null }>({ open: false, itemId: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user data
  const { data: userData } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Get institution data
  const { data: institution } = useQuery({
    queryKey: ["/api/institutions/1"],
    enabled: !!userData,
  });

  // Get workflows and compliance scores for sidebar
  const { data: sidebarWorkflows = [] } = useQuery({
    queryKey: ["/api/workflows", { institutionId: 1 }],
    enabled: !!userData,
  });

  const { data: complianceScores = [] } = useQuery({
    queryKey: ["/api/compliance-scores", { institutionId: 1 }],
    enabled: !!userData,
  });

  // Get checklist items by component
  const { data: checklistItems = [] } = useQuery({
    queryKey: ["/api/checklist/items", selectedComponent],
    queryFn: async () => {
      const response = await fetch(`/api/checklist/items?componentType=${selectedComponent}`);
      return response.json();
    }
  });

  // Get workflows for current institution
  const { data: workflows = [] } = useQuery({
    queryKey: ["/api/workflows", user?.institutionId],
    queryFn: async () => {
      const response = await fetch(`/api/workflows?institutionId=${user?.institutionId}`);
      return response.json();
    },
    enabled: !!user?.institutionId
  });

  // Get responses for selected workflow
  const { data: responses = [] } = useQuery({
    queryKey: ["/api/checklist/responses", selectedWorkflow],
    queryFn: async () => {
      const response = await fetch(`/api/checklist/responses/${selectedWorkflow}`);
      return response.json();
    },
    enabled: !!selectedWorkflow
  });

  // Get institution documents
  const { data: documents = [] } = useQuery({
    queryKey: ["/api/documents", user?.institutionId],
    queryFn: async () => {
      const response = await fetch(`/api/documents?institutionId=${user?.institutionId}`);
      return response.json();
    },
    enabled: !!user?.institutionId
  });

  // Create or update response mutation
  const createResponseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/checklist/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist/responses"] });
      toast({ title: "Respuesta guardada", description: "La verificación ha sido registrada exitosamente" });
    }
  });

  const updateResponseMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await fetch(`/api/checklist/responses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist/responses"] });
      toast({ title: t('verification.responseUpdated'), description: t('verification.verificationUpdated') });
    }
  });

  const getResponseForItem = (itemId: number) => {
    return responses.find((r: ChecklistResponse) => r.checklistItemId === itemId);
  };

  const getStatusIcon = (response?: string) => {
    switch (response) {
      case "cumple":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "no_cumple":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "parcialmente":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (response?: string) => {
    switch (response) {
      case "cumple":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">{t('verification.responses.cumple')}</Badge>;
      case "no_cumple":
        return <Badge variant="destructive">{t('verification.responses.no_cumple')}</Badge>;
      case "parcialmente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">{t('verification.responses.parcialmente')}</Badge>;
      default:
        return <Badge variant="outline">{t('verification.pending')}</Badge>;
    }
  };

  const ComponentSelector = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('verification.selectComponent')}</CardTitle>
        <CardDescription>{t('verification.selectComponentDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedComponent} onValueChange={setSelectedComponent} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="ambiente_control" className="text-xs px-2 py-2">
              {t('verification.tabs.environment')}
            </TabsTrigger>
            <TabsTrigger value="evaluacion_riesgos" className="text-xs px-2 py-2">
              {t('verification.tabs.risks')}
            </TabsTrigger>
            <TabsTrigger value="actividades_control" className="text-xs px-2 py-2">
              {t('verification.tabs.activities')}
            </TabsTrigger>
            <TabsTrigger value="informacion_comunicacion" className="text-xs px-2 py-2">
              {t('verification.tabs.information')}
            </TabsTrigger>
            <TabsTrigger value="supervision" className="text-xs px-2 py-2">
              {t('verification.tabs.monitoring')}
            </TabsTrigger>
          </TabsList>
          
          {componentTypes.map((component) => (
            <TabsContent key={component.id} value={component.id}>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">{component.name}</h3>
                <p className="text-blue-700 text-sm mb-2">{component.description}</p>
                <p className="text-xs text-blue-600">
                  {t('verification.availableElements', { count: checklistItems.length })}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );

  const WorkflowSelector = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('verification.selectWorkflow')}</CardTitle>
        <CardDescription>{t('verification.selectWorkflowDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedWorkflow?.toString()} onValueChange={(value) => setSelectedWorkflow(parseInt(value))}>
          {workflows.filter((w: any) => w.componentType === selectedComponent).map((workflow: any) => (
            <div key={workflow.id} className="flex items-center space-x-2">
              <RadioGroupItem value={workflow.id.toString()} id={workflow.id.toString()} />
              <Label htmlFor={workflow.id.toString()} className="flex-1">
                <div className="flex items-center justify-between">
                  <span>{workflow.name}</span>
                  <Badge variant="outline">{workflow.status}</Badge>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const DocumentLinkDialog = ({ itemId }: { itemId: number }) => {
    const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
    const existingResponse = getResponseForItem(itemId);

    const handleDocumentToggle = (docId: number) => {
      setSelectedDocuments(prev => 
        prev.includes(docId) 
          ? prev.filter(id => id !== docId)
          : [...prev, docId]
      );
    };

    const handleSave = () => {
      if (existingResponse) {
        const updatedResponse = { ...existingResponse, linkedDocumentIds: selectedDocuments };
        updateResponseMutation.mutate(updatedResponse);
      }
      setDocumentDialog({ open: false, itemId: null });
    };

    return (
      <Dialog open={documentDialog.open && documentDialog.itemId === itemId} onOpenChange={(open) => setDocumentDialog({ open, itemId: open ? itemId : null })}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <LinkIcon className="h-4 w-4 mr-2" />
{t('verification.linkDocuments')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('verification.linkEvidenceDocuments')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {documents.map((doc: InstitutionDocument) => (
                <div key={doc.id} className="border rounded-lg p-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleDocumentToggle(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{doc.originalName}</span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        <p className="text-sm text-gray-500">{doc.documentType}</p>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDocumentDialog({ open: false, itemId: null })}>
{t('verification.cancel')}
            </Button>
            <Button onClick={handleSave}>{t('verification.save')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (!userData || !institution) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dr-blue mx-auto"></div>
          <p className="mt-4 text-dr-neutral">{t('verification.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dr-bg">
      <Header 
        user={userData} 
        institution={institution} 
        onMobileMenuToggle={() => setSidebarOpen(true)}
        stats={{}}
      />
      
      <div className="flex h-screen pt-16">
        <SidebarSimple 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{t('verification.title')}</h1>
                <p className="text-gray-600 mt-2">
                  {t('verification.subtitle')}
                </p>
              </div>

              <ComponentSelector />
              <WorkflowSelector />

              {checklistItems.length > 0 && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{t('verification.verificationList', { component: componentTypes.find(c => c.id === selectedComponent)?.name })}</h2>
                    <p className="text-gray-600 text-sm">
                      {selectedWorkflow ? t('verification.workflowSelectDesc') : t('verification.workflowNotSelected')}
                    </p>
                  </div>
                  
                  {checklistItems.map((item: ChecklistItem) => {
                    const existingResponse = getResponseForItem(item.id);
                    const canRespond = selectedWorkflow !== null;
                    
                    return (
                      <Card key={item.id} className={!canRespond ? "opacity-75" : ""}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">{item.code}</Badge>
                                {item.requirement}
                                {getStatusIcon(existingResponse?.response)}
                              </CardTitle>
                              <CardDescription className="mt-2 font-medium text-blue-700">
                                {item.verificationQuestion}
                              </CardDescription>
                            </div>
                            {getStatusBadge(existingResponse?.response)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label className="font-medium">{t('verification.complianceLevel')}</Label>
                              <RadioGroup
                                value={existingResponse?.response || ""}
                                onValueChange={canRespond ? (value) => {
                                  if (existingResponse) {
                                    updateResponseMutation.mutate({ 
                                      id: existingResponse.id, 
                                      response: value,
                                      observations: existingResponse.observations
                                    });
                                  } else {
                                    createResponseMutation.mutate({
                                      checklistItemId: item.id,
                                      workflowId: selectedWorkflow,
                                      response: value
                                    });
                                  }
                                } : undefined}
                                disabled={!canRespond}
                                className="flex gap-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="cumple" id={`cumple-${item.id}`} />
                                  <Label htmlFor={`cumple-${item.id}`} className="text-green-700 font-medium">{t('verification.responses.cumple')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="parcialmente" id={`parcialmente-${item.id}`} />
                                  <Label htmlFor={`parcialmente-${item.id}`} className="text-yellow-700 font-medium">{t('verification.responses.parcialmente')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no_cumple" id={`no_cumple-${item.id}`} />
                                  <Label htmlFor={`no_cumple-${item.id}`} className="text-red-700 font-medium">{t('verification.responses.no_cumple')}</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`observations-${item.id}`} className="font-medium">{t('verification.commentsObservations')}</Label>
                              <Textarea
                                id={`observations-${item.id}`}
                                placeholder={t('verification.observationsPlaceholder')}
                                value={existingResponse?.observations || ""}
                                onChange={canRespond ? (e) => {
                                  const updatedResponse = { ...existingResponse, observations: e.target.value };
                                  updateResponseMutation.mutate(updatedResponse);
                                } : undefined}
                                disabled={!canRespond}
                                rows={3}
                              />
                              
                              <div className="flex gap-2 items-center">
                                <DocumentLinkDialog itemId={item.id} />
                                {existingResponse?.linkedDocumentIds && existingResponse.linkedDocumentIds.length > 0 && (
                                  <Badge variant="secondary">
                                    {existingResponse.linkedDocumentIds.length} documentos de evidencia vinculados
                                  </Badge>
                                )}
                                {!canRespond && (
                                  <Badge variant="outline" className="text-xs">
                                    Seleccione un flujo de trabajo para responder
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {checklistItems.length === 0 && (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-gray-500">No hay elementos de verificación disponibles para este componente</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}