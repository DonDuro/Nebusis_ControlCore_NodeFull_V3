# NEBUSIS® ControlCore Module

## Overview

This is a full-stack web application for managing universal internal control framework compliance workflows. The system helps government institutions worldwide track and manage their compliance with five key components: Control Environment, Risk Assessment, Control Activities, Information & Communication, and Monitoring Activities.

## System Architecture

The application follows a monorepo structure with a React frontend and Express.js backend, using PostgreSQL for data persistence and TypeScript throughout for type safety.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Validation**: Zod schemas shared between frontend and backend

## Key Components

### Database Schema
The system uses six main entities:
- **Users**: System users with roles (admin, supervisor, user)
- **Institutions**: Government institutions with metadata
- **Workflows**: NOBACI component implementations
- **Workflow Steps**: Individual tasks within workflows
- **Evidence**: Supporting documents and files
- **Institution Documents**: Contextual documents for workflow personalization

### API Structure
RESTful API endpoints organized by domain:
- `/api/auth/*` - Authentication and user management
- `/api/workflows/*` - Workflow CRUD operations
- `/api/institutions/*` - Institution management
- `/api/activities/*` - Activity tracking
- `/api/compliance-scores/*` - Compliance scoring
- `/api/documents/*` - Document management and AI analysis

### UI Components
Component library built on Radix UI:
- Layout components (Header, Sidebar)
- Dashboard widgets (StatsCards, WorkflowProgress, RecentActivity)
- Workflow management (WorkflowList, WorkflowDetails)
- Reusable UI primitives (Button, Card, Dialog, etc.)

## Data Flow

1. **Authentication**: Demo login system using hardcoded user credentials
2. **Institution Context**: User's institution determines available workflows
3. **Workflow Management**: CRUD operations for NOBACI component workflows
4. **Progress Tracking**: Real-time progress updates and compliance scoring
5. **Activity Logging**: Audit trail of all system interactions

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: TypeScript-first schema validation

### Development Dependencies
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: `npm run build` creates optimized bundles
- **Production Server**: `npm start` runs the production server
- **Database**: Automatic PostgreSQL provisioning via Replit modules
- **Environment**: Node.js 20 with web and PostgreSQL modules

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned)
- `NODE_ENV`: Environment mode (development/production)

### Port Configuration
- **Development**: Port 5000 for the combined server
- **Production**: External port 80 mapped to internal port 5000

## Authentication System

### Demo Login Credentials
The system includes demo login functionality with the following admin accounts:

- **ana.rodriguez@hacienda.gob.do** / nobaci2024 (Original admin)
- **aquezada@qsiglobalventures.com** / demo2024 (QSI admin)
- **calvarado@nebusis.com** / admin2024 (Celso Alvarado - Nebusis President)
- **dzambrano@nebusis.com** / admin2024 (David Zambrano - Nebusis CTO)

All accounts have admin-level access to the system with full workflow management capabilities.

## Product Architecture

### Branding Structure
- **Platform**: Nebusis® ControlCore - "The Nucleus of Modern Internal Control"
- **Purpose**: Integrated internal control oversight and management platform with multilingual support (English base, Spanish toggle)
- **Framework Support**: COSO Internal Control Framework and INTOSAI standards with dynamic framework switching
- **Target Market**: Government institutions and private organizations implementing internal control frameworks

## User Preferences

### Recent User Requests
- Added profile management system with photo upload functionality
- Users can access profile page through dropdown menu in header
- Profile system supports changing personal information and uploading photos
- Integrated professional photos for specific users (Celso, Yerardy) with profile management capabilities
- Created admin credentials for Nebusis executives (President and CTO) for app testing
- Both accounts use "admin2024" password with full administrative privileges
- Accounts are configured for Nebusis company executives to test the NOBACI system

## Changelog

```
Changelog:
- July 24, 2025. Updated all "Control Core" references to use "ControlCore" as one word
  * Fixed branding consistency throughout the application to use "ControlCore" (one word) instead of "Control Core" (two words)
  * Updated English translations to use "Nebusis® ControlCore" consistently
  * Updated Spanish translations to use "Nebusis® ControlCore" consistently  
  * Updated replit.md documentation to reflect correct branding
  * Ensured consistent one-word "ControlCore" usage across all components and documentation
- January 24, 2025. Completed comprehensive bilingual translation system for landing page
  * Fixed all hardcoded Spanish content in blue COSO components area to use proper translation keys
  * Updated login form with complete translation support (username, password, sign in, forgot password)
  * Fixed footer branding with correct copyright "© 2025 Nebusis Cloud Services, LLC" and "Powered by Nebusis®"
  * Added comprehensive translation keys for authentication, footer, and form elements in both languages
  * Fixed password recovery dialog with proper translation support
  * Ensured complete bilingual functionality - all text properly switches between English and Spanish
  * Landing page now fully universal and ready for global deployment with proper language toggle functionality
- January 24, 2025. Completed comprehensive replacement of all "COSO Wizard" and "ControlCore" references with "Nebusis® ControlCore"
  * Systematically replaced all instances throughout the entire application
  * Updated Terms of Service, Privacy Policy, Features page, and all marketing content
  * Fixed AI Help Bot to use "Nebusis® ControlCore" branding consistently
  * Updated translation files for both English and Spanish languages
  * Modified glossary terms to use proper "Nebusis® ControlCore" naming
  * Ensured "ControlCore" never appears without the "Nebusis®" prefix anywhere in the application
  * Updated auto-login page, integration pages, and all technical documentation
  * Application now uses unified "Nebusis® ControlCore" branding throughout all interfaces and documentation
- January 24, 2025. Completed removal of all country-specific references for universal deployment
  * Systematically replaced all Dominican Republic references with generic international terminology
  * Updated "CGR" (Contraloría General de la República) to "Entidad de Auditoría" throughout application
  * Replaced SIGEF with ERP Systems in glossary for universal applicability
  * Updated all server endpoints and comments to use audit-generic terminology
  * Removed all specific country legislation references (Decreto 491-07) with INTOSAI Standards
  * Updated partner program to target international government market instead of Dominican-specific
  * Replaced Dominican cities (Santo Domingo, Santiago, etc.) with continental geographic regions (América del Norte, Europa, Asia, etc.)
  * Updated landing page description from "instituciones dominicanas" to "instituciones gubernamentales"
  * Application now completely country-agnostic and suitable for any nation implementing COSO framework
- January 24, 2025. Completed comprehensive universal bilingual transformation to Nebusis® ControlCore
  * Transformed entire system from NOBACI-specific to universal ControlCore platform for any country
  * Implemented complete i18n infrastructure with English as base language and Spanish toggle
  * Added professional language toggle with 🇺🇸/🇪🇸 flag indicators in all page headers
  * Updated all branding to "Nebusis® ControlCore - The Nucleus of Modern Internal Control"
  * Created framework-aware translation system supporting COSO/INTOSAI terminology switching
  * Implemented persistent language preference storage in localStorage across all sessions
  * Updated landing page with complete bilingual interface and modern ControlCore branding
  * Fixed login page with proper translation system and professional styling
  * Updated all navigation menus and page content to use translation keys
  * Created comprehensive translation files for features, navigation, and branding elements
  * Fixed syntax errors in marketing pages (features.tsx, about.tsx) with proper JSX structure
  * Eliminated ALL references to Dominican Republic, NOBACI, and country-specific content
  * Updated call-to-action buttons from "Join Now" to "Request a Proposal" / "Solicitar Propuesta"
  * Removed all "COSO Wizard" references, keeping unified "Nebusis® ControlCore" branding throughout
  * System now operates as universal bilingual internal control platform ready for global deployment in any country
- July 23, 2025. Created comprehensive horizontal logo package with professional branding assets
  * Created 4 horizontal logo variations: transparent, white background, blue background, and large version
  * Built interactive HTML converter tool for generating PNG files in multiple sizes (200×50 to 900×240)
  * Designed logos with "NOBACI Wizard" text beside icon matching header layout style
  * Generated complete ZIP package (nobaci-wizard-logos-horizontal.zip) with all assets and documentation
  * Professional logos suitable for headers, documents, business cards, and branded materials
  * All variations maintain consistent design with application header and government institution standards
- July 23, 2025. Added Yerardy Montoya user account for video inspection and documentation
  * Created admin account for ymontoya@qsiglobalventures.com (Yerardy Montoya - QSI Global Ventures)
  * Added login credentials with "video2024" password for video production inspection access
  * Integrated Yerardy's professional photo into user profile system (header and sidebar)
  * Updated gender-aware greeting system to show "Bienvenida Yerardy" for female users
  * Account configured for visual inspection and video creation about the NOBACI application
- July 23, 2025. Fixed duplicate user profile display and added professional photo for Celso Alvarado
  * Resolved header duplication issue showing user information multiple times
  * Integrated Celso Alvarado's professional photo into user profile system
  * Updated Header component to show single user profile instance with photo and name
  * Enhanced both header and sidebar to display professional photo for calvarado@nebusis.com
  * Implemented gender-aware greeting system showing "Bienvenido Celso" based on name detection
  * Simplified header structure to eliminate any duplicate user information
- July 23, 2025. Added Nebusis executive admin credentials for app testing
  * Created admin accounts for calvarado@nebusis.com (Celso Alvarado - Nebusis President)
  * Created admin account for dzambrano@nebusis.com (David Zambrano - Nebusis CTO)
  * Both accounts use "admin2024" password with full administrative privileges
  * Updated authentication system to properly identify Nebusis executives
  * Tested login functionality - both accounts working correctly
  * Accounts configured for Nebusis executives to test the NOBACI compliance system
- July 22, 2025. Created comprehensive deployment package (Version 2.5)
  * Generated complete system backup with version 2.5 and today's date (22JUL2025)
  * Created comprehensive deployment package for GitHub and Render platforms
  * Included detailed deployment instructions and configuration guides
  * Added professional README with complete project documentation
  * Fixed auto-login system with proper session token storage and authentication flow
  * Enhanced authentication system to store session tokens in localStorage
  * Created automated login system for direct dashboard access
  * Updated login credentials to use correct demo password (nobaci2024)
  * Package ready for immediate deployment to production environments
- January 22, 2025. Enhanced commercial form and removed public email addresses
  * Added "Producto de Interés" field to sales inquiry form with comprehensive product options
  * Included ComplianceCore (available), NOBACI Wizard (Dominican Republic), and all "Acceso Anticipado" products
  * Added options for multiple products and custom solutions for comprehensive needs assessment
  * Fixed button text visibility issue in all CTA sections by adding hover:border-blue-600 class
  * Outline buttons now properly display text on hover with blue border and blue text
  * Removed partners@nebusis.com and all other public email addresses from marketing pages
  * Contact information now directs users to use forms instead of exposing email addresses
  * Same commercial form now handles both current products and early access requests for upcoming products
- January 22, 2025. Fixed color scheme consistency in Partners page
  * Converted all purple/indigo colors to blue/gray palette for consistency
  * Changed background gradients from purple-50/indigo-50 to blue-50/gray-50
  * Updated form focus rings from purple-500 to blue-500 throughout
  * Modified collaboration area icons and highlights to use blue/gray colors
  * Updated "Programa de Colaboradores" header text to blue-600
  * Converted all form buttons and accents to consistent blue color scheme
  * Partners page now follows same visual identity as other marketing pages
- January 22, 2025. Enhanced all CTA sections to target both clients and collaborators
  * Updated "Solicitar Más Información" sections in About, Features, and Pricing pages
  * Changed "Únete Ahora" buttons to "Información para Clientes" for clarity
  * Added second CTA button "Oportunidades de Colaboración" directing to /partners page
  * Updated CTA descriptions to mention both client services and collaboration opportunities
  * Reverted mobile app download to "Próximamente" status as originally intended
  * Removed MobileAppSection component from landing page completely
  * Updated footer mobile app link to display as static "Próximamente" text
  * Consistent dual-CTA approach across all marketing pages targeting both audiences
- January 22, 2025. Added comprehensive Partner/Collaborator Program to pricing page
  * Created new Partners Section with focus on commercialization and technical configuration roles
  * Built complete Partner Application Form with specific fields for collaboration areas
  * Added visual cards highlighting Commercial Sales and Technical Configuration opportunities
  * Form includes experience validation, geographic location, and professional references
  * Targeting professionals for governmental institution sales and ComplianceCore implementation
  * Professional purple/indigo gradient design to distinguish from main pricing content
  * Form positioned strategically before final CTA section for maximum visibility
- January 22, 2025. Enhanced pricing page with transparent base pricing structure
  * Added prominent pricing section with US$ 1,250 configuration + US$ 1,250 annual license
  * Repositioned base pricing before pricing factors for improved user flow
  * Updated section titles to "Factores que Determinan el Precio Final" for clarity
  * Maintained consistent blue/gray color palette throughout all pricing sections
- January 22, 2025. Fixed logo positioning in legal pages headers
  * Corrected Privacy Policy and Terms of Service headers to center Nebusis® logo perfectly
  * Used absolute positioning to ensure logo remains centered regardless of "Volver" button
  * Improved visual hierarchy and professional appearance of legal documents
- January 22, 2025. Created comprehensive legal framework with Privacy Policy and Terms of Service
  * Built complete Privacy Policy page in Spanish focused on NOBACI Wizard and Nebusis®
  * Created Terms of Service page with Florida state law jurisdiction and Nebusis-favorable terms
  * Both documents properly localized for Dominican Republic government institutions
  * Added footer links in landing page for easy access to legal documents
  * All legal documents emphasize data protection, enterprise security, and professional compliance
  * Terms specifically favor Nebusis Cloud Services, LLC with Florida jurisdiction and arbitration clauses
  * Documents follow provided templates while adapting to NOBACI Wizard context and Spanish language
  * Added new routes /privacy-policy and /terms-of-service to application routing
- January 22, 2025. Completed professional landing page with NOBACI-specific context and functional navigation
  * Removed all WizSpeak references ("Mantente Seguro") and "17 normas" repetitions
  * Focused exclusively on the 5 key NOBACI components with proper naming:
    1. Ambiente de Control
    2. Valoración y Administración de Riesgos
    3. Actividades de Control
    4. Información y Comunicación
    5. Monitoreo y Evaluación
  * Implemented functional navigation menu with NOBACI-specific information tooltips
  * Enhanced right panel to showcase the 5 main NOBACI components with proper context
  * Improved alignment and responsiveness across all screen sizes
  * Added credential recovery functionality with proper modal dialog
  * Updated badges to reflect NOBACI context: "CGR Compliant", "IA Integrada", "Gobierno RD"
  * Fixed authentication system with proper session management using localStorage tokens
  * Landing page now accurately represents NOBACI Wizard as digital compliance platform for Dominican government institutions
  * Enhanced navigation menu with comprehensive product description and contact information
  * Added detailed "Características" section with ISO 22301 compliance and business continuity focus
  * Integrated contact information and demonstration request functionality
  * Added comprehensive "Acerca de" section with complete Nebusis® company information
  * Included Nebusis® Business Suite overview with all 8 enterprise applications
  * Featured company credentials including multinational clients (PepsiCo, Google) and government experience
  * Applied proper Nebusis® branding to all product names in Business Suite section
  * Added comprehensive pricing policy with three-tier structure (Alcance, Usuarios, Servicio)
  * Included detailed pricing methodology for institutional customization
  * Created comprehensive support form with professional design matching enterprise standards
  * Implemented support ticket system with categorization, validation, and submission handling
  * Added enterprise support options and service information sections
  * Built complete Institutional Sales Inquiry form with all required fields and validation specifically for Dominican government institutions
  * Implemented comprehensive sales form with Contact Information, Organization Details, and Project Requirements sections
  * Added industry-specific dropdown options and company size categorization
  * Created user count and implementation timeline selectors for accurate project scoping
  * Integrated budget range and current solution fields for better sales qualification
  * Connected both "Únete ahora" and "Contactar Ventas" buttons to professional sales inquiry form
  * All forms include comprehensive validation, error handling, and success confirmation messages
  * Created beautiful dedicated pages for Features, Pricing, and About sections with professional design
  * Implemented interactive dashboard mockups and analytics charts in Features page
  * Added comprehensive pricing structure visualization with three-tier service levels
  * Created complete company profile and Business Suite showcase in About page
  * All pages include prominent "Únete Ahora" call-to-action buttons directing to sales inquiry form
  * Enhanced navigation system routing to dedicated pages instead of alert popups
  * Professional gradient backgrounds and modern card layouts throughout all marketing pages
  * Corrected About page to use exact Nebusis® information without invented content
  * Updated focus from "software development" to "digital transformation solutions"
  * Set ComplianceCore as featured product, removed NOBACI Wizard from global Business Suite
  * Added "Próximamente" badges for upcoming Business Suite applications
- January 22, 2025. Created comprehensive system backup and deployment documentation
  * Generated complete system backup (COMPLETE_SYSTEM_BACKUP_2025.md) with current state
  * Created GitHub deployment guide (GITHUB_DEPLOYMENT_GUIDE.md) with multi-platform instructions
  * Documented all deployment platforms: Replit, Render, Railway, Vercel
  * Included complete database schema, API endpoints, and technical specifications
  * Added security considerations, performance optimizations, and monitoring procedures
  * Documented all 40+ API endpoints with complete functionality descriptions
  * Ready for immediate deployment to any cloud platform with proper configuration
- January 22, 2025. Enhanced NOBACI workflows with hierarchical subcomponents and improved visual design
  * Added comprehensive subcomponent structure for all 5 NOBACI components
  * Enhanced component tabs with gradient backgrounds and better visual prominence when selected
  * Created detailed component header cards showing subcomponents in organized grid layout
  * Improved workflow cards with better hover effects and visual hierarchy
  * Added descriptive text and badge indicators for each component section
  * Enhanced user experience with clear visual distinction between selected and unselected components
- January 22, 2025. Fixed critical app startup issues and API integration problems
  * Resolved TypeScript errors preventing application from running
  * Fixed missing import conflicts between Lucide icons and schema types
  * Updated API queries to include proper institution ID parameters
  * Fixed runtime error "User is not defined" in workflows page
  * Application now loads successfully with proper data handling
  * All dashboard statistics and workflow data loading correctly
- January 22, 2025. Enhanced dashboard with sophisticated colorful analytical charts and comprehensive data visualization
  * Created new AnalyticalCharts component with advanced performance metrics and KPI displays
  * Implemented colorful analytical dashboard with enhanced user experience while preserving all essential UI elements
  * Added sophisticated charting for NOBACI component progress, compliance trends, and alert notifications
  * Enhanced quick actions grid with gradient backgrounds, hover effects, and improved visual hierarchy
  * Maintained all critical user interface elements: user name/role display, logout functionality, settings button
  * Simplified sidebar navigation across all pages while adding comprehensive analytical visualizations
  * Replaced basic stats with advanced performance cards, trend analysis, and real-time activity feeds
  * Dashboard now provides executive-level insights with colorful charts for Dominican Republic public officials
- January 15, 2025. Created complete production-ready Go backend with MySQL
  * Built enterprise-grade Go 1.21+ backend with Gin Web Framework
  * Implemented MySQL 8.0 database with comprehensive schema (12 tables)
  * Created session-based authentication system with bcrypt password hashing
  * Built Docker multi-stage builds with docker-compose for development
  * Structured handlers package with proper separation of concerns
  * Added comprehensive Makefile for development and deployment workflows
  * Implemented CORS, security middleware, and production configurations
  * Created detailed production documentation and setup guides
  * Multi-tenant, multi-sector database design with foreign key constraints
  * RESTful API with proper HTTP status codes and error handling
  * Session storage in MySQL with automatic cleanup and validation
  * Development and production environment configurations
  * Ready for React 18.2+ frontend with TypeScript, Vite, TanStack Query integration
- January 15, 2025. Created comprehensive system backup documentation
  * Generated complete system backup (COMPLETE_SYSTEM_BACKUP.md) with detailed technical specifications
  * Documented all 13 database tables with full schema definitions
  * Catalogued all 40+ API endpoints with complete functionality descriptions
  * Detailed all frontend components and their purposes
  * Comprehensive documentation of all 5 NOBACI components and their implementation
  * Complete feature descriptions for workflow management, document management, verification, alerts, training, and reporting
  * Technical specifications including performance requirements, security measures, and deployment configuration
  * Current system status with completed features and known issues
  * Future enhancement roadmap and maintenance procedures
  * Ready for production deployment with proper API keys and cloud storage configuration
- January 14, 2025. Created comprehensive Spanish user guide covering all system features
  * Generated complete user manual (GUIA_USUARIO_NOBACI_WIZARD.md) with 12 detailed sections
  * Covers all application modules: Dashboard, Workflows, Documents, Verification, Reports, Alerts, Glossary, Integration
  * Includes step-by-step instructions for getting started and using each feature
  * Provides troubleshooting guide and technical support information
  * Written in clear, accessible Spanish for Dominican Republic government institutions
  * Comprehensive documentation of NOBACI components and compliance processes
- January 14, 2025. Completed comprehensive hover tooltip implementation across all interactive elements
  * Added hover tooltips to all clickable elements in dashboard, login, and documents pages
  * Enhanced Header component with tooltips for mobile menu toggle and user profile section
  * Implemented tooltips for all stats cards with descriptive function explanations
  * Added tooltips to document management buttons (upload, analyze, delete) with clear descriptions
  * Enhanced login form with tooltips for email, password, and authentication buttons
  * All tooltips use simple, descriptive language explaining element functionality
  * Improves user experience by providing contextual help on hover for all interactive elements
- January 14, 2025. Updated system branding to "NOBACI Wizard" 
  * Changed header title from "NEBUSIS® Wizard" to "NOBACI Wizard"
  * Updated all references in documents page, integration page, and storage components
  * Maintained NEBUSIS logo while updating textual branding for better clarity
  * Updated user preferences to reflect new branding standards
- June 13, 2025. Added user account for Antonia Quezada
  * Created admin account for aquezada@qsiglobalventures.com
  * Full access to NOBACI compliance system and all features
  * Administrative privileges for system demonstration and evaluation
- June 13, 2025. Enhanced document management system with expanded categories
  * Added "Procedimientos" and "Instructivos" as new document types with distinct color coding
  * Changed "Reglamentos Internos" to "Reglamentos" for simplified terminology
  * Added "Análisis de Documentos" sidebar option for direct access to document analysis features
  * Enhanced document categorization system for better institutional organization
  * Fixed navigation to automatically scroll to analysis section when accessed from sidebar
- June 13, 2025. Implemented comprehensive email alert notification system for NOBACI compliance
  * Created complete alert management system with automated detection of workflow issues
  * Built email notification infrastructure using SendGrid for professional communications
  * Added alert service that monitors deadlines, workflow stagnation, and compliance issues
  * Implemented supervisor notification system - alerts sent to responsible parties AND their supervisors
  * Created alert management interface with configuration options, test email functionality, and manual alert checks
  * Enhanced database schema with alert notifications and supervisor relationship tracking
  * Added API endpoints for alert management, email testing, and notification preferences
  * Alert system ready for production use once SendGrid API key is configured
- June 13, 2025. Implemented institutional logo display and comprehensive reports system
  * Added logoUrl field to institutions database schema
  * Created logo display functionality in header next to institution name
  * Built complete reports generation system with 4 report types (compliance, progress, performance, risk)
  * Changed "Reportes" to "Informes" throughout application for proper Spanish terminology
  * Added API endpoints for generating institutional compliance reports with real data
- June 13, 2025. Enhanced NOBACI system navigation and UI improvements
  * Fixed NOBACI component navigation - sidebar components now properly route to workflow pages
  * Updated API endpoints to correctly handle institution ID parameters
  * Added comprehensive workflow execution dialogs with step-by-step process visualization
  * Enhanced workflows page with component-specific tabs and detailed workflow cards
  * Improved sidebar design with blue rectangle header for "Componentes de Control"
  * Made "Personalización Inteligente" text bold in documents page for better emphasis
  * Fixed asset serving for NEBUSIS logo and application images
- June 13, 2025. Fixed image loading issues and completed login page graphics integration
  * Resolved image serving permissions and file path configuration
  * Successfully integrated user-provided workflow and analytics illustrations
  * Confirmed proper display of NEBUSIS logo and visual elements
  * Login page now displays all graphics correctly with professional styling
- June 13, 2025. Created beautiful professional login page with enhanced visual design
  * Implemented split-screen design with workflow management and analytics illustrations
  * Added NEBUSIS branding with official logo and government styling
  * Created responsive design with mobile adaptation
  * Integrated authentication flow with demo login functionality
  * Enhanced with gradient backgrounds and Dominican Republic color scheme
  * Fixed NOBACI component navigation with clickable sidebar sections
- June 13, 2025. Implemented comprehensive NOBACI workflow execution system
  * Built structured workflow definitions for all 5 NOBACI components with detailed steps
  * Created workflow execution interface with step-by-step process tracking
  * Added comprehensive glossary with 20+ official NOBACI terms and definitions
  * Integrated AI help bot with NOBACI knowledge base and application guidance
  * Implemented evidence tracking, responsibility assignment, and audit trail functionality
  * Added PDF export capabilities and progress monitoring for compliance workflows
- June 13, 2025. Completed NOBACI verification system implementation
  * Fixed database seeding issues and created comprehensive checklist items
  * Implemented functional verification page with component-based filtering
  * Created API endpoints for checklist responses and document linking
  * Added workflow selection and response tracking functionality
- June 13, 2025. Updated application branding with NEBUSIS logo and "Workflow Wizard" title
  * Replaced header icon with official NEBUSIS logo image
  * Changed main title to "Workflow Wizard" with "Sistema de Gestión de Control Interno" subtitle
  * Maintained professional government institution appearance
  * Consolidated workflow concept - removed artificial separation between workflows and processes
  * Reorganized sidebar to prioritize NOBACI control components at the top
  * Fixed sidebar highlighting for better text visibility on selected items
- June 13, 2025. Added comprehensive document management system for institutional context
  * Created document upload interface with categorization (creation laws, regulations, organigrams, etc.)
  * Implemented AI-powered document analysis framework for workflow personalization
  * Added document visualization and management dashboard
  * Integrated document upload tracking in activity feed
- June 12, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Header layout: NEBUSIS logo and titles should be left-justified, not centered.
Logo positioning: NEBUSIS logo moved slightly to the right for better visual balance.
Branding: Use "NOBACI Wizard" instead of "IA" when referring to the intelligent analysis features.
```