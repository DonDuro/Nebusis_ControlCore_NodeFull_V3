import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import SidebarSimple from "@/components/layout/SidebarSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";
import { controlCoreGlossary, searchGlossary, getTermsByCategory, type GlossaryTerm } from "@/data/coso-glossary";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useQuery } from "@tanstack/react-query";

export default function Glossary() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const filteredTerms = searchTerm.trim() 
    ? searchGlossary(searchTerm)
    : selectedCategory === "all" 
      ? controlCoreGlossary 
      : getTermsByCategory(selectedCategory as GlossaryTerm['category']);

  const categoryStats = {
    all: controlCoreGlossary.length,
    general: getTermsByCategory("general").length,
    component: getTermsByCategory("component").length,
    legal: getTermsByCategory("legal").length,
    technical: getTermsByCategory("technical").length
  };

  if (!user || !institution) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-dr-bg">
      <Header 
        user={user} 
        institution={institution} 
        onMobileMenuToggle={() => setSidebarOpen(true)}
        stats={{}}
      />
      
      <div className="flex h-screen pt-16">
        <SidebarSimple 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-dr-blue" />
                <h1 className="text-3xl font-bold text-gray-900">Glosario COSO</h1>
              </div>
              <p className="text-gray-600">
                Términos y conceptos fundamentales del Sistema de Control Interno
              </p>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar términos, definiciones o conceptos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  Todos ({categoryStats.all})
                </TabsTrigger>
                <TabsTrigger value="general">
                  General ({categoryStats.general})
                </TabsTrigger>
                <TabsTrigger value="component">
                  Componentes ({categoryStats.component})
                </TabsTrigger>
                <TabsTrigger value="legal">
                  Legal ({categoryStats.legal})
                </TabsTrigger>
                <TabsTrigger value="technical">
                  Técnico ({categoryStats.technical})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Results */}
            <div className="space-y-4">
              {filteredTerms.length === 0 && (
                <Card>
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-gray-500">
                      No se encontraron términos para "{searchTerm}"
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {filteredTerms.map((term, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-dr-blue mb-2">
                          {term.term}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${term.category === 'general' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${term.category === 'component' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            ${term.category === 'legal' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                            ${term.category === 'technical' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                          `}
                        >
                          {term.category === 'general' && 'General'}
                          {term.category === 'component' && 'Componente'}
                          {term.category === 'legal' && 'Legal'}
                          {term.category === 'technical' && 'Técnico'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-700 text-base leading-relaxed mb-4">
                      {term.definition}
                    </CardDescription>
                    
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Términos relacionados:</p>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className="text-xs cursor-pointer hover:bg-dr-light-blue hover:text-white"
                              onClick={() => setSearchTerm(relatedTerm)}
                            >
                              {relatedTerm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Legal Reference */}
            <Card className="mt-8 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-dr-blue">{t('glossary.legalReferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <strong>{t('glossary.nationalLaw')}:</strong> {t('glossary.nationalLawDescription')}
                </p>
                <p className="text-sm">
                  <strong>{t('glossary.regulations')}:</strong> {t('glossary.regulationsDescription')}
                </p>
                <p className="text-sm">
                  <strong>{t('glossary.guidelines')}:</strong> {t('glossary.guidelinesDescription')}
                </p>
                <p className="text-sm">
                  <strong>{t('glossary.standards')}:</strong> {t('glossary.standardsDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}