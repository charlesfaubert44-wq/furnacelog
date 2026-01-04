# FurnaceLog Documentation

Complete documentation for the FurnaceLog home maintenance tracking platform.

---

## Quick Links

- **[Main README](../README.md)** - Project overview and quick start
- **[Getting Started Guide](../GETTING_STARTED.md)** - Setup and installation instructions
- **[API Specification](architecture/API_SPECIFICATION.md)** - Complete REST API documentation
- **[Database Schema](architecture/DATABASE_SCHEMA.md)** - Database design and models
- **[Security Guide](security/SECURITY.md)** - Security overview and best practices

---

## Documentation Structure

### 📋 [Planning](planning/)
Project planning, requirements, and task tracking.

| Document | Description |
|----------|-------------|
| [Product Requirements Document](planning/northern-home-tracker-prd.md) | Complete PRD with all features and specifications |
| [Tasks](planning/TASKS.md) | Project task list and milestones |

---

### 🏗️ [Architecture](architecture/)
Technical architecture, database design, and system specifications.

| Document | Description |
|----------|-------------|
| [API Specification](architecture/API_SPECIFICATION.md) | REST API endpoints, request/response formats |
| [Database Schema](architecture/DATABASE_SCHEMA.md) | PostgreSQL/MongoDB schema design |
| [Onboarding Data Model](architecture/ONBOARDING_DATA_MODEL.md) | User onboarding data structure |
| [Design System](architecture/DESIGN_SYSTEM_IMPLEMENTATION.md) | UI/UX design system and components |

---

### ⚙️ [Implementation](implementation/)
Implementation reports and technical details for completed features.

| Document | Description |
|----------|-------------|
| [E1: Infrastructure Report](implementation/E1_INFRASTRUCTURE_REPORT.md) | Backend infrastructure setup |
| [E1: Complete](implementation/EPIC_E1_COMPLETE.md) | Epic 1 completion summary |
| [E3: Implementation Summary](implementation/E3_IMPLEMENTATION_SUMMARY.md) | Epic 3 overview |
| [E3: Final Report](implementation/E3_FINAL_REPORT.md) | Epic 3 detailed report |
| [E3: Files Created](implementation/E3_FILES_CREATED.md) | Files created in Epic 3 |
| [E4: Implementation Report](implementation/EPIC_E4_IMPLEMENTATION_REPORT.md) | Epic 4 detailed report |
| [E5: Implementation Report](implementation/EPIC_E5_IMPLEMENTATION_REPORT.md) | Epic 5 detailed report |
| [Authentication](implementation/AUTH_IMPLEMENTATION.md) | JWT auth, OAuth, session management |
| [UI Implementation](implementation/UI_IMPLEMENTATION_SUMMARY.md) | Frontend UI implementation |
| [Task Library](implementation/TASK_LIBRARY_SUMMARY.md) | Maintenance task library |
| [Onboarding Wizard](implementation/ONBOARDING_WIZARD_IMPLEMENTATION.md) | 8-step onboarding implementation |
| [Onboarding Complete](implementation/ONBOARDING_IMPLEMENTATION_COMPLETE.md) | Onboarding completion report |
| [Climate Time Machine](implementation/CLIMATE_TIME_MACHINE_IMPLEMENTATION.md) | Interactive timeline implementation |

---

### 🎨 [Features](features/)
Feature specifications and design documents.

| Document | Description |
|----------|-------------|
| [Wiki Feature Specification](features/WIKI_FEATURE_SPECIFICATION.md) | User-generated wiki system |
| [Creative Features](features/CREATIVE_FEATURES.md) | Innovative feature ideas |
| [Climate Time Machine Design](features/CLIMATE_TIME_MACHINE_DESIGN.md) | Interactive timeline design |
| [Onboarding Wizard Visual Guide](features/ONBOARDING_WIZARD_VISUAL_GUIDE.md) | Visual onboarding guide |
| [Personalized Onboarding](features/PERSONALIZED_ONBOARDING_PROMPT.md) | Custom onboarding prompts |
| [Dashboard Rehaul](features/DASHBOARD_REHAUL_PROMPT.md) | Dashboard redesign specification |

---

### 🚀 [Deployment](deployment/)
Deployment guides, infrastructure setup, and production readiness.

| Document | Description |
|----------|-------------|
| [Your Deployment Guide](deployment/YOUR_DEPLOYMENT_GUIDE.md) | **START HERE** - Step-by-step deployment |
| [Dokploy Quickstart](deployment/DOKPLOY_QUICKSTART.md) | Quick Dokploy setup guide |
| [Dokploy Setup Guide](deployment/DOKPLOY_SETUP_GUIDE.md) | Detailed Dokploy configuration |
| [Dokploy Deployment](deployment/DOKPLOY_DEPLOYMENT.md) | Full deployment documentation |
| [Dokploy Redis Fix](deployment/DOKPLOY_REDIS_FIX.md) | Redis troubleshooting |
| [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |
| [Production Readiness](deployment/PRODUCTION_READINESS_REPORT.md) | Production readiness assessment |

---

### 🔒 [Security](security/)
Security implementation, best practices, and compliance.

| Document | Description |
|----------|-------------|
| [Security Overview](security/SECURITY.md) | Security policies and overview |
| [Security Checklist](security/SECURITY_CHECKLIST.md) | Security audit checklist |
| [Security Setup Guide](security/SECURITY_SETUP_GUIDE.md) | Step-by-step security setup |
| [Security Implementation](security/SECURITY_IMPLEMENTATION_REPORT.md) | Implementation details |
| [Security Quick Reference](security/SECURITY_QUICK_REFERENCE.md) | Quick security reference |
| [Security Fixes Report](security/SECURITY_FIXES_REPORT.md) | Security issues and fixes |

---

### 📖 [Guides](guides/)
Quick references and how-to guides.

| Document | Description |
|----------|-------------|
| [E4 Quick Reference](guides/E4_QUICK_REFERENCE.md) | Quick reference for Epic 4 features |
| [E5 Quick Reference](guides/E5_QUICK_REFERENCE.md) | Quick reference for Epic 5 features |
| [API Examples](guides/API_EXAMPLES.md) | Code examples for API usage |

---

### 📦 [Archive](archive/)
Old or deprecated documentation.

| Document | Description |
|----------|-------------|
| [README E3](archive/README_E3.md) | Old Epic 3 README |
| [Frontend Design Agent](archive/frontend-design-agent.md) | Design agent notes |

---

## Documentation Standards

### File Naming Conventions

- Use `UPPERCASE_WITH_UNDERSCORES.md` for specification documents
- Use `lowercase-with-hyphens.md` for guides and tutorials
- Prefix epic reports with `E{number}_` or `EPIC_E{number}_`
- Use descriptive names that indicate content

### Document Structure

All documentation should include:
1. **Title and Description** - Clear title and one-sentence description
2. **Table of Contents** - For documents >500 lines
3. **Quick Links** - Links to related documents
4. **Code Examples** - Practical examples where applicable
5. **Last Updated** - Date of last significant update

### Markdown Best Practices

- Use heading hierarchy properly (# → ## → ###)
- Include code syntax highlighting
- Use tables for structured data
- Add diagrams using Mermaid when helpful
- Link to related documents using relative paths

---

## Contributing to Documentation

### When to Update Documentation

- **New Features**: Create specification in `features/` before implementation
- **Implementation Complete**: Add report to `implementation/`
- **Architecture Changes**: Update relevant docs in `architecture/`
- **Security Changes**: Update `security/` documentation
- **Deployment Changes**: Update `deployment/` guides

### Documentation Review Process

1. Write documentation in appropriate folder
2. Update this index (docs/README.md)
3. Update main README.md if needed
4. Review for accuracy and clarity
5. Commit with descriptive message

---

## Getting Help

- **General Questions**: See [Getting Started Guide](../GETTING_STARTED.md)
- **API Questions**: See [API Specification](architecture/API_SPECIFICATION.md)
- **Deployment Issues**: See [Deployment Guides](deployment/)
- **Security Concerns**: See [Security Documentation](security/)

---

## Document Change Log

| Date | Change | Files Affected |
|------|--------|----------------|
| 2024-01-04 | Reorganized all documentation into structured folders | All files (44 moved) |
| 2024-01-04 | Added Wiki Feature Specification | features/WIKI_FEATURE_SPECIFICATION.md |
| 2024-01-04 | Added comprehensive documentation index | docs/README.md |
| 2024-01-04 | Created documentation cleanup summary | DOCUMENTATION_CLEANUP_SUMMARY.md |

**Full reorganization details:** See [DOCUMENTATION_CLEANUP_SUMMARY.md](DOCUMENTATION_CLEANUP_SUMMARY.md)

---

**Last Updated**: January 4, 2024
**Maintained By**: FurnaceLog Development Team
