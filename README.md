# Nebusis® ControlCore v3.0
## Universal Internal Control Framework Platform

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/nebusis/controlcore)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D13.0-blue.svg)](https://postgresql.org/)

A comprehensive digital platform for managing internal control framework compliance, designed for government institutions and enterprises worldwide. Supports COSO and INTOSAI standards with complete bilingual functionality (English/Spanish).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 13+ database
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nebusis-controlcore.git
cd nebusis-controlcore

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database configuration

# Setup database
npm run db:push

# Start development server
npm run dev

# For production deployment
npm run build
npm start
```

---

## 🌐 Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/controlcore

# Server Configuration
NODE_ENV=production
PORT=5000

# Security
SESSION_SECRET=your-secure-session-secret-minimum-32-characters

# Optional: External Services
SENDGRID_API_KEY=your-sendgrid-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Optional: File Storage
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES=pdf,doc,docx,xls,xlsx,txt,rtf
```

---

## 🏗 System Architecture

### Frontend Stack
- **React 18.3** with TypeScript
- **Vite 5.4** build system
- **Wouter 3.3** routing
- **TanStack Query 5.60** state management
- **Radix UI** components
- **Tailwind CSS 3.4** styling
- **Framer Motion** animations

### Backend Stack
- **Node.js 20+** runtime
- **Express.js 4.21** web framework
- **TypeScript 5.6** type safety
- **Drizzle ORM 0.39** database
- **PostgreSQL 13+** database
- **Express Sessions** authentication

### Key Features
- **Bilingual Support**: Complete English/Spanish localization
- **Framework Agnostic**: COSO and INTOSAI standards
- **Document Management**: 9-category organization system
- **Workflow Engine**: Step-by-step compliance processes
- **AI Integration**: Automated analysis and generation
- **Real-time Analytics**: Compliance dashboards and reporting

---

## 📊 Database Schema

The application uses PostgreSQL with the following core tables:

```sql
-- Core Tables
users              -- System users and authentication
institutions       -- Government/organization profiles  
workflows          -- COSO component implementations
workflow_steps     -- Individual workflow tasks
institution_documents -- Document management
evidence           -- Supporting files and documents
activities         -- Audit trail and user actions
compliance_scores  -- Progress and scoring metrics
checklist_items    -- Verification elements
```

### Database Setup

```bash
# Push schema to database (creates all tables)
npm run db:push

# Alternative: Manual database setup
psql -d your_database -f database/schema.sql
```

---

## 🔐 Authentication

### Demo Login Credentials

**Admin Accounts** (Full Access):
```
ana.rodriguez@hacienda.gob.do / nobaci2024
aquezada@qsiglobalventures.com / demo2024  
calvarado@nebusis.com / admin2024
dzambrano@nebusis.com / admin2024
```

### Authentication Features
- Session-based authentication
- Role-based access control
- Profile management with photos
- Password recovery system
- Persistent login sessions

---

## 🌍 Internationalization

Complete bilingual support with professional translations:

### Supported Languages
- **English** (default): Full system translation
- **Spanish**: Complete localization including technical terms

### Translation System
- Framework-aware terminology (COSO/INTOSAI)
- Persistent language preferences
- Professional flag-based toggle (🇺🇸/🇪🇸)
- Real-time language switching

---

## 📋 Core Modules

### 1. Document Management
**9 Document Categories** (v3.0 Organization):
1. Applicable Laws
2. Articles of Incorporation/Bylaws
3. Sector Regulations
4. Organizational Chart
5. Previous Control Reports
6. Memos and Specifications
7. Policies and Manuals
8. Procedures and Work Instructions
9. Other Documents

### 2. Workflow Management
**5 COSO Components**:
- Control Environment
- Risk Assessment  
- Control Activities
- Information & Communication
- Monitoring Activities

### 3. Analytics & Reporting
- Real-time compliance dashboards
- Progress visualization
- Executive analytics
- Exportable reports
- Performance metrics

### 4. AI-Powered Features
- Document analysis against COSO requirements
- Automated policy/procedure generation
- Intelligent workflow personalization
- Smart compliance gap analysis

---

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm start           # Start production server
npm run check       # TypeScript type checking

# Database
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio (optional)

# Code Quality
npm run lint        # Run ESLint
npm run format      # Format code with Prettier
npm test           # Run test suite
```

### Project Structure

```
nebusis-controlcore/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages/routes
│   │   ├── i18n/            # Translation files
│   │   ├── lib/             # Utilities and configurations
│   │   └── types/           # TypeScript type definitions
│   ├── index.html
│   └── public/              # Static assets
├── server/                   # Express.js backend
│   ├── index.ts            # Main server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database interface layer
│   └── vite.ts             # Development server setup
├── shared/                   # Shared TypeScript schemas
│   └── schema.ts           # Database and validation schemas
├── package.json             # Dependencies and scripts
├── vite.config.ts          # Vite build configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── drizzle.config.ts       # Database ORM configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

---

## 🚀 Deployment

### Deployment Platforms

#### Render (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Set build/start commands
4. Deploy with PostgreSQL addon

#### Railway
1. Import from GitHub
2. Add PostgreSQL service
3. Configure environment variables
4. Zero-config deployment

#### Vercel
1. Import GitHub repository
2. Configure build settings
3. Add external PostgreSQL database
4. Deploy with serverless functions

#### Traditional VPS/Cloud
1. Clone repository
2. Install Node.js and PostgreSQL
3. Configure environment variables
4. Build and start with PM2/systemd

### Build Configuration

```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

---

## 🔧 Configuration Options

### Server Configuration
```typescript
// server/index.ts configuration options
const config = {
  port: process.env.PORT || 5000,
  sessionSecret: process.env.SESSION_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadMaxSize: process.env.UPLOAD_MAX_SIZE || '10MB',
  databaseUrl: process.env.DATABASE_URL
};
```

### Frontend Configuration
```typescript
// vite.config.ts customization
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
});
```

---

## 🔌 API Reference

### Authentication Endpoints
```typescript
POST /api/auth/login      // User authentication
GET  /api/auth/user       // Current user info
POST /api/auth/logout     // Logout user
POST /api/auth/reset      // Password reset
```

### Core Application Endpoints
```typescript
GET    /api/workflows              // List workflows
POST   /api/workflows              // Create workflow
PUT    /api/workflows/:id          // Update workflow
DELETE /api/workflows/:id          // Delete workflow

GET    /api/documents              // List documents
POST   /api/documents              // Upload document
DELETE /api/documents/:id          // Delete document
POST   /api/documents/analyze      // AI analysis

GET    /api/institutions/:id       // Get institution
PUT    /api/institutions/:id       // Update institution
POST   /api/institutions/:id/logo  // Upload logo

GET    /api/compliance-scores      // Get compliance scores
POST   /api/compliance-scores      // Update scores

GET    /api/reports                // List reports
POST   /api/reports/generate       // Generate report
```

---

## 🛡 Security

### Authentication & Authorization
- Session-based authentication with secure cookies
- Password hashing using bcrypt
- Role-based access control (admin/supervisor/user)
- CSRF protection enabled
- XSS protection with content security policy

### Data Protection
- SQL injection prevention with parameterized queries
- Input validation using Zod schemas
- File upload restrictions and validation
- Secure session storage in PostgreSQL
- Environment variable protection

### Best Practices
```typescript
// Example secure route implementation
app.post('/api/documents', requireAuth, validateInput, async (req, res) => {
  const { institutionId } = req.user;
  const document = await storage.createDocument({
    ...req.body,
    institutionId, // Ensure user can only access their institution
    uploadedBy: req.user.id
  });
  res.json(document);
});
```

---

## 📈 Performance Optimization

### Frontend Optimizations
- React.lazy() for code splitting
- TanStack Query for efficient data fetching
- Memoization of expensive computations
- Optimized bundle sizes with tree shaking
- Image optimization and lazy loading

### Backend Optimizations
- Database connection pooling
- Query optimization with proper indexing
- Response compression (gzip)
- Static file serving with proper caching headers
- Rate limiting for API endpoints

### Database Optimizations
```sql
-- Example indexes for performance
CREATE INDEX idx_workflows_institution ON workflows(institution_id);
CREATE INDEX idx_documents_type ON institution_documents(document_type);
CREATE INDEX idx_activities_user ON activities(user_id, created_at);
```

---

## 🧪 Testing

### Test Structure
```bash
tests/
├── unit/              # Unit tests
│   ├── components/    # React component tests
│   ├── utils/         # Utility function tests
│   └── api/           # API endpoint tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data and mocks
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:unit     # Unit tests only  
npm run test:e2e      # End-to-end tests
npm run test:coverage # Generate coverage report
```

---

## 📚 Documentation

### Available Documentation
- **User Guide (English)**: Complete system documentation
- **Guía del Usuario (Español)**: Documentación completa del sistema
- **API Documentation**: Developer reference with examples
- **Deployment Guide**: Platform-specific deployment instructions
- **Architecture Overview**: Technical system design
- **Troubleshooting Guide**: Common issues and solutions

### Generating Documentation
```bash
npm run docs:build    # Build documentation site
npm run docs:serve    # Serve documentation locally
```

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for version control
- Test coverage requirements

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check PostgreSQL connection
psql $DATABASE_URL

# Verify environment variables
echo $DATABASE_URL

# Reset database schema
npm run db:push
```

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run check

# Build with verbose output
npm run build --verbose
```

**Runtime Errors**
```bash
# Check application logs
npm start 2>&1 | tee app.log

# Enable debug mode
DEBUG=* npm start

# Verify environment configuration
node -e "console.log(process.env)"
```

### Getting Help
- Check the troubleshooting guide in `/docs/troubleshooting.md`
- Review GitHub issues for similar problems
- Contact support through the application contact forms

---

## 📄 License

**Proprietary Software**  
© 2025 Nebusis Cloud Services, LLC. All rights reserved.

This software is licensed for institutional deployment and customization. Contact Nebusis for commercial licensing terms and enterprise support options.

---

## 🏢 About Nebusis®

**Nebusis Cloud Services, LLC** is a digital transformation solutions provider specializing in government and enterprise applications. Founded in 2019 and based in Reston, Virginia, USA.

### Company Specializations
- Government digital transformation
- Cloud-native application development  
- AI-powered business solutions
- Compliance and regulatory systems
- Multi-language enterprise platforms

### Contact
- **Website**: https://nebusis.com
- **Platform**: Nebusis® ControlCore
- **Support**: Available through platform contact forms
- **Location**: Reston, Virginia, USA

---

## 🎯 Version History

### v3.0.0 (July 24, 2025)
- ✅ Document category reorganization (9-category structure)
- ✅ Enhanced file upload with real file selection
- ✅ Complete translation system (no hardcoded text)  
- ✅ COSO analysis results fully translated
- ✅ Improved navigation and user experience
- ✅ Production deployment optimization

### v2.5.0 (July 22, 2025)
- Comprehensive bilingual transformation
- Universal ControlCore platform implementation
- Complete i18n infrastructure
- Professional language toggle system

### v2.0.0 (January 22, 2025)
- Universal internal control platform
- Framework-agnostic design (COSO/INTOSAI)
- Multi-sector adaptability
- Enhanced analytics and reporting

### v1.0.0 (July 2024)
- Initial NOBACI implementation
- Core workflow management
- Basic document management
- PostgreSQL integration

---

*Nebusis® ControlCore v3.0 - The Nucleus of Modern Internal Control*  
*Ready for production deployment on any modern cloud infrastructure*

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy with Railway](https://railway.app/button.svg)](https://railway.app/new)