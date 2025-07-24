import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/common/LanguageProvider";
import { FrameworkProvider } from "@/components/common/FrameworkProvider";
import Dashboard from "@/pages/dashboard";
import Workflows from "@/pages/workflows";
import Documents from "@/pages/documents";
import Verification from "@/pages/verification";
import Glossary from "@/pages/glossary";
import Reports from "@/pages/reports";

import Configuration from "@/pages/configuration";
import Profile from "@/pages/Profile";
import InstitutionalPlans from "@/pages/institutional-plans";
import TrainingManagement from "@/pages/training-management";
import CgrReporting from "@/pages/cgr-reporting";
import Login from "@/pages/login";
import Landing from "@/pages/landing";
import Features from "@/pages/features";
import Pricing from "@/pages/pricing";
import About from "@/pages/about";
import Partners from "@/pages/partners";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AutoLogin from "@/pages/auto-login";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import { AIHelpBot } from "@/components/ai-help/AIHelpBot";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";

function Router() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dr-blue mx-auto"></div>
          <p className="mt-4 text-dr-neutral">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/auto-login" component={AutoLogin} />
        <Route path="/features" component={Features} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/about" component={About} />
        <Route path="/collaborators" component={Partners} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/documents" component={Documents} />
      <Route path="/verification" component={Verification} />
      <Route path="/institutional-plans" component={InstitutionalPlans} />
      <Route path="/training-management" component={TrainingManagement} />
      <Route path="/reports" component={Reports} />
      <Route path="/informes" component={Reports} />
      <Route path="/cgr-reporting" component={CgrReporting} />

      <Route path="/configuration" component={Configuration} />
      <Route path="/profile" component={Profile} />
      <Route path="/glossary" component={Glossary} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <FrameworkProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <AIHelpBot />
          </TooltipProvider>
        </FrameworkProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
