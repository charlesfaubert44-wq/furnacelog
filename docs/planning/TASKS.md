# FurnaceLog - Development Task Breakdown

**Version:** 1.0
**Date:** January 2, 2026
**Source:** FurnaceLog PRD v1.0

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [Phase 1: MVP (Minimum Viable Product)](#phase-1-mvp-minimum-viable-product)
3. [Phase 2: V1 Launch](#phase-2-v1-launch)
4. [Phase 3: Post-Launch Enhancements](#phase-3-post-launch-enhancements)
5. [Task Priority Legend](#task-priority-legend)

---

## Epic Overview

### Epic Grouping

| Epic ID | Epic Name | Description | Phase |
|---------|-----------|-------------|-------|
| E1 | Infrastructure & DevOps | Server setup, Docker, databases, deployment pipeline | MVP |
| E2 | Authentication & User Management | User registration, login, profile management | MVP |
| E3 | Home Profile Management | Create, edit, manage home profiles and properties | MVP |
| E4 | System & Component Tracking | Track home systems (heating, plumbing, etc.) and components | MVP |
| E5 | Maintenance Management | Task library, scheduling, logging, checklists | MVP |
| E6 | Document Management | File upload, storage, organization | V1 |
| E7 | Reminders & Notifications | Email, push notifications, weather alerts | V1 |
| E8 | Community Wiki | User-generated articles with admin review workflow | V1 |
| E9 | Service Provider Directory | Provider listings, search, reviews | V1 |
| E10 | Reporting & Analytics | Cost tracking, maintenance reports, dashboards | V1 |
| E11 | Northern-Specific Features | Heat trace, HRV, freeze protection, modular homes | V1 |
| E12 | UI/UX & Design System | Design implementation, responsive layouts, PWA | MVP |
| E13 | Admin & Moderation | Admin dashboard, content moderation, provider management | V1 |
| E14 | Provider Monetization | Premium tiers, smart suggestions, lead generation | Post-Launch |

---

## Phase 1: MVP (Minimum Viable Product)

**Goal:** Core functionality for homeowners to track homes and maintenance
**Timeline:** 3-4 months

---

### EPIC E1: Infrastructure & DevOps

#### E1-T1: Initial Project Setup
**Priority:** P0 | **Complexity:** M | **Dependencies:** None

**User Story:** As a developer, I want the project infrastructure set up so that I can begin development.

**Tasks:**
- [ ] Initialize Git repository
- [ ] Set up monorepo structure (frontend/backend)
- [ ] Configure Node.js 20 LTS environment
- [ ] Set up ESLint, Prettier, TypeScript configs
- [ ] Create README with setup instructions
- [ ] Configure .gitignore and .env templates

**Acceptance Criteria:**
- Repository structure follows monorepo best practices
- All developers can clone and run project locally
- Code formatting and linting work consistently

---

#### E1-T2: Docker Development Environment
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T1

**User Story:** As a developer, I want a Docker development environment so that all team members have consistent setups.

**Tasks:**
- [ ] Create Dockerfile for Node.js backend
- [ ] Create Dockerfile for React frontend
- [ ] Create docker-compose.yml for local development
- [ ] Configure MongoDB container with initialization
- [ ] Configure Redis container
- [ ] Configure MinIO container for object storage
- [ ] Set up volume mounts for hot reloading
- [ ] Document Docker setup in README

**Acceptance Criteria:**
- `docker-compose up` starts all services
- Hot reloading works for frontend and backend
- Database persists data between restarts

---

#### E1-T3: Database Setup - MongoDB
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T2

**User Story:** As a developer, I want MongoDB configured so that we can store application data.

**Tasks:**
- [ ] Configure MongoDB connection with Mongoose
- [ ] Create database connection utilities
- [ ] Set up database indexes (per PRD section 10.2)
- [ ] Create database seed scripts for development
- [ ] Implement connection pooling and error handling
- [ ] Set up database migration strategy

**Acceptance Criteria:**
- MongoDB connects successfully
- Indexes are created automatically
- Seed data populates for testing

---

#### E1-T4: Object Storage Setup - MinIO
**Priority:** P0 | **Complexity:** S | **Dependencies:** E1-T2

**User Story:** As a developer, I want object storage configured so that we can handle file uploads.

**Tasks:**
- [ ] Configure MinIO S3-compatible storage
- [ ] Create buckets for different file types (documents, images, etc.)
- [ ] Set up access policies
- [ ] Create MinIO utility functions for upload/download
- [ ] Implement file URL generation

**Acceptance Criteria:**
- Files can be uploaded to MinIO
- Files can be retrieved via URL
- Buckets have appropriate access controls

---

#### E1-T5: Redis Cache Setup
**Priority:** P1 | **Complexity:** S | **Dependencies:** E1-T2

**User Story:** As a developer, I want Redis configured for caching and sessions.

**Tasks:**
- [ ] Configure Redis connection
- [ ] Set up session storage
- [ ] Create cache utility functions
- [ ] Configure cache eviction policies
- [ ] Set up BullMQ for job queue

**Acceptance Criteria:**
- Redis connects successfully
- Sessions persist in Redis
- Cache functions work correctly

---

#### E1-T6: CI/CD Pipeline
**Priority:** P1 | **Complexity:** L | **Dependencies:** E1-T1

**User Story:** As a developer, I want automated testing and deployment so that code quality is maintained.

**Tasks:**
- [ ] Set up GitHub Actions or similar CI
- [ ] Configure automated testing on push
- [ ] Set up linting checks
- [ ] Configure automated builds
- [ ] Set up staging deployment pipeline
- [ ] Configure production deployment via Dokploy
- [ ] Implement deployment rollback strategy

**Acceptance Criteria:**
- Tests run automatically on PR
- Failed tests block merging
- Successful merges trigger staging deployment

---

#### E1-T7: Dokploy Production Deployment
**Priority:** P1 | **Complexity:** L | **Dependencies:** E1-T2, E1-T6

**User Story:** As a developer, I want to deploy FurnaceLog to production using Dokploy on a dedicated server.

**Tasks:**
- [ ] Provision dedicated server (Ubuntu 22.04 LTS, 4GB+ RAM)
- [ ] Configure server security (firewall, fail2ban, SSH hardening)
- [ ] Install Docker on dedicated server
- [ ] Install MongoDB on server (Docker or direct installation)
- [ ] Set up MongoDB authentication and create furnacelog database
- [ ] Run mongo-init.js to create collections and indexes
- [ ] Install and configure Dokploy on server
- [ ] Deploy Redis container for caching/sessions
- [ ] Deploy MinIO container for object storage
- [ ] Create MinIO buckets (documents, images, avatars)
- [ ] Configure DNS records for domain
- [ ] Deploy backend application in Dokploy:
  - Connect to Git repository
  - Set Dockerfile path to `backend.Dockerfile`
  - Configure all environment variables
  - Set up health checks
- [ ] Deploy frontend application in Dokploy:
  - Connect to Git repository
  - Set Dockerfile path to `frontend.Dockerfile`
  - Configure build arguments (VITE_API_URL, etc.)
  - Set up SSL via Let's Encrypt
- [ ] Configure domain and SSL for both frontend and backend
- [ ] Set up MongoDB backups (automated daily backups)
- [ ] Configure monitoring (Uptime Kuma or similar)
- [ ] Test all services are communicating correctly
- [ ] Document deployment process and credentials

**Acceptance Criteria:**
- FurnaceLog is accessible via custom domain with SSL
- Frontend can communicate with backend API
- Backend can connect to MongoDB, Redis, and MinIO
- Health checks are passing
- SSL certificates are valid
- Backups are running automatically
- Monitoring is active and alerting works
- Deployment guide (DOKPLOY_DEPLOYMENT.md) is followed successfully

**Reference Files:**
- `backend.Dockerfile` - Backend Docker configuration
- `frontend.Dockerfile` - Frontend Docker configuration
- `nginx.conf` - Nginx configuration for frontend
- `docker-compose.yml` - Local development setup (reference)
- `.env.example` - Environment variables template
- `mongo-init.js` - MongoDB initialization script
- `healthcheck.js` - Docker health check script
- `DOKPLOY_DEPLOYMENT.md` - Complete deployment guide

---

### EPIC E2: Authentication & User Management

#### E2-T1: User Registration API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T3

**User Story:** As a new user, I want to register an account so that I can use FurnaceLog.

**Tasks:**
- [ ] Create User data model (per PRD section 9.1.1)
- [ ] Implement POST /api/v1/auth/register endpoint
- [ ] Add email validation and uniqueness check
- [ ] Implement password hashing with bcrypt
- [ ] Add input validation with Zod
- [ ] Create user profile with default preferences
- [ ] Send welcome email

**Acceptance Criteria:**
- User can register with email and password
- Passwords are hashed before storage
- Duplicate emails are rejected
- User receives welcome email

---

#### E2-T2: User Login API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E2-T1

**User Story:** As a registered user, I want to log in so that I can access my data.

**Tasks:**
- [ ] Implement POST /api/v1/auth/login endpoint
- [ ] Verify credentials against database
- [ ] Generate JWT access and refresh tokens
- [ ] Store session in Redis
- [ ] Return user profile data
- [ ] Implement rate limiting for login attempts
- [ ] Add login attempt logging

**Acceptance Criteria:**
- Valid credentials return JWT tokens
- Invalid credentials return appropriate error
- Rate limiting prevents brute force attacks
- Sessions persist in Redis

---

#### E2-T3: JWT Authentication Middleware
**Priority:** P0 | **Complexity:** M | **Dependencies:** E2-T2

**User Story:** As the system, I want to protect routes so that only authenticated users access them.

**Tasks:**
- [ ] Create JWT verification middleware
- [ ] Implement token refresh logic
- [ ] Add authorization header parsing
- [ ] Create protected route decorator
- [ ] Handle expired token errors
- [ ] Implement logout functionality (token invalidation)

**Acceptance Criteria:**
- Protected routes require valid JWT
- Expired tokens are rejected
- Refresh tokens extend session
- Logout invalidates tokens

---

#### E2-T4: User Profile Management API
**Priority:** P1 | **Complexity:** S | **Dependencies:** E2-T3

**User Story:** As a user, I want to update my profile so that my information is current.

**Tasks:**
- [ ] Implement GET /api/v1/users/me endpoint
- [ ] Implement PATCH /api/v1/users/me endpoint
- [ ] Add profile field validation
- [ ] Implement password change functionality
- [ ] Add email change with verification
- [ ] Create account deletion endpoint

**Acceptance Criteria:**
- User can view their profile
- User can update profile fields
- Password changes require old password
- Email changes require verification

---

#### E2-T5: Authentication UI - Registration
**Priority:** P0 | **Complexity:** M | **Dependencies:** E2-T1

**User Story:** As a new user, I want a registration form so that I can create an account.

**Tasks:**
- [ ] Create registration form component
- [ ] Implement form validation (React Hook Form + Zod)
- [ ] Add password strength indicator
- [ ] Implement error handling and display
- [ ] Add loading states
- [ ] Create success confirmation
- [ ] Add redirect to login after registration

**Acceptance Criteria:**
- Form validates inputs before submission
- Errors display clearly
- Successful registration shows confirmation
- User is redirected appropriately

---

#### E2-T6: Authentication UI - Login
**Priority:** P0 | **Complexity:** M | **Dependencies:** E2-T2

**User Story:** As a registered user, I want a login form so that I can access my account.

**Tasks:**
- [ ] Create login form component
- [ ] Implement form validation
- [ ] Add "Remember me" checkbox
- [ ] Implement "Forgot password" link
- [ ] Store JWT tokens securely (httpOnly cookies or localStorage)
- [ ] Redirect to dashboard after login
- [ ] Add error handling

**Acceptance Criteria:**
- User can log in with credentials
- Tokens are stored securely
- Errors display appropriately
- Successful login redirects to dashboard

---

#### E2-T7: Password Reset Flow
**Priority:** P2 | **Complexity:** M | **Dependencies:** E2-T2, E7-T1

**User Story:** As a user, I want to reset my password if I forget it.

**Tasks:**
- [ ] Implement POST /api/v1/auth/forgot-password endpoint
- [ ] Generate password reset tokens
- [ ] Send reset email with token link
- [ ] Create reset password form UI
- [ ] Implement POST /api/v1/auth/reset-password endpoint
- [ ] Validate reset tokens
- [ ] Expire tokens after use or timeout

**Acceptance Criteria:**
- User receives reset email with link
- Token is valid for 1 hour
- User can set new password
- Token is invalidated after use

---

### EPIC E3: Home Profile Management

#### E3-T1: Home Data Model & API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T3, E2-T3

**User Story:** As a homeowner, I want to register my home so that I can track its maintenance.

**Tasks:**
- [ ] Create Home data model (per PRD section 9.1.2)
- [ ] Implement POST /api/v1/homes endpoint
- [ ] Implement GET /api/v1/homes endpoint (list user's homes)
- [ ] Implement GET /api/v1/homes/:homeId endpoint
- [ ] Implement PATCH /api/v1/homes/:homeId endpoint
- [ ] Implement DELETE /api/v1/homes/:homeId endpoint
- [ ] Add ownership validation middleware
- [ ] Support GPS coordinates for remote locations

**Acceptance Criteria:**
- User can create unlimited homes
- Each home has required fields validated
- User can only access their own homes
- Home addresses support northern territories format

---

#### E3-T2: Home Registration Form UI
**Priority:** P0 | **Complexity:** L | **Dependencies:** E3-T1

**User Story:** As a homeowner, I want an intuitive form to register my home.

**Tasks:**
- [ ] Create multi-step home registration form
- [ ] Implement basic details section (name, address, type)
- [ ] Add home type selection (modular, stick-built, log, mobile)
- [ ] Create foundation type selector
- [ ] Add utilities configuration (water, sewage, electrical, heating)
- [ ] Implement modular home info section (conditional)
- [ ] Add GPS coordinate picker with map integration
- [ ] Create photo upload for home cover image
- [ ] Add form validation
- [ ] Implement progress indicator

**Acceptance Criteria:**
- Form guides user through registration
- Fields are validated appropriately
- Modular home fields show conditionally
- Map allows coordinate selection
- User can upload cover photo

---

#### E3-T3: Home Dashboard View
**Priority:** P0 | **Complexity:** L | **Dependencies:** E3-T1

**User Story:** As a homeowner, I want a dashboard for my home so that I can see its status at a glance.

**Tasks:**
- [ ] Create home dashboard layout component
- [ ] Display home basic information
- [ ] Show maintenance due summary (overdue, due this week, due this month)
- [ ] Create recent activity feed
- [ ] Display system status overview
- [ ] Add weather integration display
- [ ] Create quick-add buttons for tasks
- [ ] Show seasonal checklist progress
- [ ] Add responsive mobile layout

**Acceptance Criteria:**
- Dashboard shows all key information
- Maintenance summary is accurate
- Weather displays current conditions
- Quick actions are accessible
- Mobile layout is usable

---

#### E3-T4: Multi-Property Support
**Priority:** P1 | **Complexity:** M | **Dependencies:** E3-T1, E3-T3

**User Story:** As a property manager, I want to manage multiple properties so that I can track all my homes.

**Tasks:**
- [ ] Create property selector component (dropdown/sidebar)
- [ ] Implement property switching logic
- [ ] Create aggregate dashboard view (all properties)
- [ ] Add property filtering and search
- [ ] Implement default home preference
- [ ] Create property comparison view

**Acceptance Criteria:**
- User can switch between properties easily
- Aggregate view shows data from all homes
- Default home loads on login
- Property selector is always accessible

---

#### E3-T5: Home Edit & Management UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E3-T2

**User Story:** As a homeowner, I want to update my home details as things change.

**Tasks:**
- [ ] Create home edit form (pre-filled)
- [ ] Implement cover photo update/delete
- [ ] Add home deletion with confirmation
- [ ] Create home archiving functionality
- [ ] Add audit trail for home changes

**Acceptance Criteria:**
- User can edit all home fields
- Changes save correctly
- Deletion requires confirmation
- Audit trail tracks changes

---

### EPIC E4: System & Component Tracking

#### E4-T1: System Data Model & API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E3-T1

**User Story:** As a homeowner, I want to track my home systems so that I can manage their maintenance.

**Tasks:**
- [ ] Create System data model (per PRD section 9.1.3)
- [ ] Implement POST /api/v1/homes/:homeId/systems endpoint
- [ ] Implement GET /api/v1/homes/:homeId/systems endpoint
- [ ] Implement GET /api/v1/homes/:homeId/systems/:systemId endpoint
- [ ] Implement PATCH /api/v1/homes/:homeId/systems/:systemId endpoint
- [ ] Implement DELETE /api/v1/homes/:homeId/systems/:systemId endpoint
- [ ] Add system categorization (heating, plumbing, electrical, etc.)
- [ ] Support warranty tracking

**Acceptance Criteria:**
- User can add systems to their home
- Systems are categorized correctly
- Warranty information is tracked
- API validates ownership

---

#### E4-T2: System Templates Library
**Priority:** P0 | **Complexity:** M | **Dependencies:** E4-T1

**User Story:** As a homeowner, I want pre-configured system templates so that I don't have to enter everything manually.

**Tasks:**
- [ ] Create system template collection in database
- [ ] Define templates for common northern systems:
  - Forced-air furnace (propane, oil, natural gas)
  - Boiler systems
  - Tankless water heater
  - Tank water heater
  - HRV/ERV systems
  - Heat trace cables
  - Propane/oil tanks
  - Electric baseboards
- [ ] Include default maintenance schedules per template
- [ ] Add northern-specific system types
- [ ] Create template selection API endpoint
- [ ] Implement template customization after selection

**Acceptance Criteria:**
- Templates cover major northern systems
- Each template has default maintenance tasks
- User can customize template-based systems
- Templates include manufacturer-specific info

---

#### E4-T3: Add System UI
**Priority:** P0 | **Complexity:** L | **Dependencies:** E4-T1, E4-T2

**User Story:** As a homeowner, I want to add a system to my home with guided assistance.

**Tasks:**
- [ ] Create system category selector
- [ ] Implement template-based system creation wizard
- [ ] Add manual system entry option
- [ ] Create system details form (make, model, serial)
- [ ] Add installation information fields
- [ ] Implement warranty tracking fields
- [ ] Add photo upload for system
- [ ] Create location/notes fields
- [ ] Add QR code generation for system labels

**Acceptance Criteria:**
- User can choose template or manual entry
- Wizard guides through system setup
- All fields validate appropriately
- Photos can be uploaded
- QR codes generate for physical labeling

---

#### E4-T4: System List & Detail Views
**Priority:** P0 | **Complexity:** M | **Dependencies:** E4-T1

**User Story:** As a homeowner, I want to view all my systems and their details.

**Tasks:**
- [ ] Create systems list view (grouped by category)
- [ ] Implement system status indicators (active, service due, etc.)
- [ ] Create system detail page
- [ ] Display system specifications
- [ ] Show maintenance history for system
- [ ] Display warranty status
- [ ] Add edit and delete actions
- [ ] Create system card component

**Acceptance Criteria:**
- Systems are organized by category
- Status indicators are clear
- Detail page shows all information
- User can navigate to edit/delete

---

#### E4-T5: Component Data Model & API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T1

**User Story:** As a homeowner, I want to track individual components within systems.

**Tasks:**
- [ ] Create Component data model (per PRD section 9.1.4)
- [ ] Implement component CRUD API endpoints
- [ ] Link components to parent systems
- [ ] Add replacement interval tracking
- [ ] Implement supplier information
- [ ] Add cost tracking

**Acceptance Criteria:**
- Components link to systems
- Replacement schedules track correctly
- Supplier info is stored
- Costs are recorded

---

#### E4-T6: Component Management UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T5

**User Story:** As a homeowner, I want to track components like filters and parts.

**Tasks:**
- [ ] Create add component form
- [ ] Implement component list within system detail
- [ ] Add replacement due indicators
- [ ] Create component edit/delete
- [ ] Add bulk component operations
- [ ] Implement low stock warnings

**Acceptance Criteria:**
- Components show under their system
- Due dates calculate correctly
- Bulk operations work
- Warnings display appropriately

---

#### E4-T7: Warranty Tracking
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T1

**User Story:** As a homeowner, I want to track warranties so I don't miss coverage.

**Tasks:**
- [ ] Create warranty calendar view
- [ ] Implement warranty expiration alerts (90, 60, 30 days)
- [ ] Add document attachment to warranties
- [ ] Create warranty claims logging
- [ ] Implement manufacturer contact storage
- [ ] Add warranty export functionality

**Acceptance Criteria:**
- Calendar shows all warranties
- Alerts trigger at appropriate times
- Documents link to warranties
- Claims are tracked

---

### EPIC E5: Maintenance Management

#### E5-T1: Maintenance Task Library - Data Model
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T3

**User Story:** As a developer, I want a task library database so that we can provide pre-built maintenance tasks.

**Tasks:**
- [ ] Create MaintenanceTask data model (per PRD section 9.1.5)
- [ ] Define task categorization (routine, seasonal, reactive, emergency)
- [ ] Implement applicable systems mapping
- [ ] Add scheduling configuration
- [ ] Create execution details (difficulty, time, tools, instructions)
- [ ] Add cost estimates (DIY vs professional)

**Acceptance Criteria:**
- Model supports all task types
- Tasks link to applicable systems
- Scheduling rules are flexible
- Instructions are structured

---

#### E5-T2: Seed Northern-Specific Task Library
**Priority:** P0 | **Complexity:** L | **Dependencies:** E5-T1

**User Story:** As a homeowner, I want pre-built northern maintenance tasks so I know what to do.

**Tasks:**
- [ ] Research and document 100+ northern-specific tasks
- [ ] Create seed data for heating system tasks:
  - Furnace filter changes
  - Furnace combustion analysis
  - Boiler maintenance
  - Heat trace inspection and testing
- [ ] Add HRV/ERV tasks:
  - Core cleaning
  - Filter replacement
  - Balancing and calibration
- [ ] Create freeze protection tasks
- [ ] Add tankless water heater tasks (descaling, etc.)
- [ ] Create seasonal checklist tasks
- [ ] Add propane/oil system tasks
- [ ] Include safety warnings
- [ ] Add tool and supply lists

**Acceptance Criteria:**
- 100+ tasks in library
- All major northern systems covered
- Tasks have complete instructions
- Safety warnings included
- Tool lists are accurate

---

#### E5-T3: Task Library API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E5-T1, E5-T2

**User Story:** As a developer, I want task library APIs so the frontend can access tasks.

**Tasks:**
- [ ] Implement GET /api/v1/maintenance/tasks/library endpoint
- [ ] Add filtering by category, system, difficulty
- [ ] Implement task search
- [ ] Create task detail endpoint
- [ ] Add custom task creation endpoint
- [ ] Implement task templates

**Acceptance Criteria:**
- Library is searchable and filterable
- Task details are complete
- Users can create custom tasks
- Templates work correctly

---

#### E5-T4: Scheduled Maintenance - Data Model & API
**Priority:** P0 | **Complexity:** L | **Dependencies:** E5-T1, E4-T1

**User Story:** As a homeowner, I want to schedule maintenance tasks so I don't forget them.

**Tasks:**
- [ ] Create ScheduledMaintenance data model (per PRD section 9.1.6)
- [ ] Implement POST /api/v1/maintenance/tasks endpoint (schedule task)
- [ ] Add recurrence logic (interval, seasonal, annual)
- [ ] Create GET /api/v1/maintenance/tasks/scheduled endpoint
- [ ] Implement task status updates (due, overdue, completed, skipped)
- [ ] Add reminder configuration
- [ ] Create task completion workflow
- [ ] Implement defer/snooze functionality

**Acceptance Criteria:**
- Tasks schedule correctly
- Recurrence patterns work
- Status updates accurately
- Reminders trigger appropriately

---

#### E5-T5: Maintenance Calendar UI
**Priority:** P0 | **Complexity:** L | **Dependencies:** E5-T4

**User Story:** As a homeowner, I want a calendar view of my maintenance so I can plan ahead.

**Tasks:**
- [ ] Implement calendar component (react-big-calendar)
- [ ] Display scheduled tasks on calendar
- [ ] Add color coding by status (due, overdue, completed)
- [ ] Create month/week/day views
- [ ] Implement drag-and-drop rescheduling
- [ ] Add task quick-view modal
- [ ] Create filter by system/category
- [ ] Add today/upcoming tasks sidebar

**Acceptance Criteria:**
- Calendar displays all scheduled tasks
- Views are responsive
- Drag-and-drop works
- Filters apply correctly
- Mobile view is usable

---

#### E5-T6: Task Scheduling UI
**Priority:** P0 | **Complexity:** M | **Dependencies:** E5-T3, E5-T4

**User Story:** As a homeowner, I want to easily schedule maintenance tasks.

**Tasks:**
- [ ] Create task selection from library
- [ ] Implement scheduling form:
  - One-time vs recurring
  - Interval selection (days, weeks, months, years)
  - Seasonal scheduling
  - Specific date selection
- [ ] Add system/component association
- [ ] Create reminder preference settings
- [ ] Implement bulk scheduling
- [ ] Add quick-schedule buttons (common intervals)

**Acceptance Criteria:**
- User can browse and select tasks
- All scheduling options work
- Form validates inputs
- Bulk operations succeed

---

#### E5-T7: Maintenance Logging - Data Model & API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E5-T4

**User Story:** As a homeowner, I want to log completed maintenance so I have records.

**Tasks:**
- [ ] Create MaintenanceLog data model (per PRD section 9.1.7)
- [ ] Implement POST /api/v1/maintenance/logs endpoint
- [ ] Add GET /api/v1/maintenance/logs endpoint
- [ ] Support photo uploads
- [ ] Track costs (parts, labor, total)
- [ ] Record performer (self, provider, other)
- [ ] Add meter readings support
- [ ] Create follow-up task generation

**Acceptance Criteria:**
- Logs capture all details
- Photos upload correctly
- Costs calculate accurately
- Links to scheduled tasks

---

#### E5-T8: Maintenance Logging UI
**Priority:** P0 | **Complexity:** L | **Dependencies:** E5-T7

**User Story:** As a homeowner, I want to easily log completed maintenance.

**Tasks:**
- [ ] Create quick-log form (simple tasks)
- [ ] Implement detailed log form:
  - Task selection
  - Date/time picker
  - Performer selection
  - Cost entry (parts breakdown)
  - Photo upload (before/during/after)
  - Notes field
  - Issues discovered
- [ ] Add follow-up task creation
- [ ] Implement offline logging with sync
- [ ] Create log from scheduled task (pre-filled)

**Acceptance Criteria:**
- Quick log takes <30 seconds
- Detailed log captures everything
- Photos attach correctly
- Offline logging works
- Pre-filling from scheduled task works

---

#### E5-T9: Seasonal Checklists - Data & API
**Priority:** P0 | **Complexity:** M | **Dependencies:** E5-T1

**User Story:** As a homeowner, I want seasonal checklists so I prepare for northern weather changes.

**Tasks:**
- [ ] Create SeasonalChecklist data model (per PRD section 9.1.11)
- [ ] Define checklist templates:
  - Pre-Freeze-Up (September-October)
  - Winter Operations (November-March)
  - Break-Up (April-May)
  - Summer (June-August)
- [ ] Implement GET /api/v1/maintenance/checklists/seasonal endpoint
- [ ] Add checklist item status updates
- [ ] Create annual checklist generation
- [ ] Track progress percentage

**Acceptance Criteria:**
- 4 seasonal checklists defined
- Each has northern-specific items
- Progress tracks correctly
- Checklists regenerate annually

---

#### E5-T10: Seasonal Checklist UI
**Priority:** P0 | **Complexity:** M | **Dependencies:** E5-T9

**User Story:** As a homeowner, I want to work through seasonal checklists to prepare my home.

**Tasks:**
- [ ] Create checklist view component
- [ ] Display current season checklist
- [ ] Add checkbox for each item
- [ ] Show progress bar
- [ ] Create item detail modal (with instructions)
- [ ] Add notes for each item
- [ ] Implement skip/not applicable marking
- [ ] Create year-over-year comparison view

**Acceptance Criteria:**
- Current season highlights automatically
- Progress updates in real-time
- Items can be checked off
- Instructions are accessible
- Historical data shows

---

#### E5-T11: Service History Timeline
**Priority:** P1 | **Complexity:** M | **Dependencies:** E5-T7

**User Story:** As a homeowner, I want to see my complete maintenance history.

**Tasks:**
- [ ] Create timeline view component
- [ ] Display logs chronologically
- [ ] Add filtering:
  - Date range
  - System/component
  - Task type
  - Provider
  - Cost range
- [ ] Implement search within history
- [ ] Create cost trend visualization
- [ ] Add export to PDF/CSV

**Acceptance Criteria:**
- Timeline shows all logs
- Filters work correctly
- Search finds relevant logs
- Export generates correctly
- Visualizations are clear

---

### EPIC E12: UI/UX & Design System

#### E12-T1: Design System Setup
**Priority:** P0 | **Complexity:** M | **Dependencies:** E1-T1

**User Story:** As a developer, I want a design system so that UI is consistent.

**Tasks:**
- [ ] Set up Tailwind CSS configuration
- [ ] Define color palette (per PRD "Boiler Room" and "Heat & Function")
- [ ] Configure typography (fonts, sizes, weights)
- [ ] Create spacing and sizing scales
- [ ] Define breakpoints for responsive design
- [ ] Set up dark mode support (optional)
- [ ] Document design tokens

**Acceptance Criteria:**
- Tailwind config matches PRD colors
- Typography is consistent
- Design tokens are documented
- All developers can use system

---

#### E12-T2: Component Library - shadcn/ui Setup
**Priority:** P0 | **Complexity:** M | **Dependencies:** E12-T1

**User Story:** As a developer, I want reusable UI components so development is faster.

**Tasks:**
- [ ] Install and configure shadcn/ui
- [ ] Customize components to match FurnaceLog branding
- [ ] Create base components:
  - Button variants
  - Input fields
  - Select dropdowns
  - Modals/dialogs
  - Cards
  - Tables
  - Forms
  - Alerts/toasts
  - Badges
  - Tabs
- [ ] Create Storybook for component documentation
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

**Acceptance Criteria:**
- Components match design system
- All variants are styled
- Storybook documents each component
- Components are accessible

---

#### E12-T3: Layout Components
**Priority:** P0 | **Complexity:** M | **Dependencies:** E12-T2

**User Story:** As a user, I want consistent navigation and layout.

**Tasks:**
- [ ] Create main app shell/layout component
- [ ] Implement navigation sidebar:
  - Home selector dropdown
  - Main navigation menu
  - User profile menu
  - Collapsible on mobile
- [ ] Create top header/navbar
- [ ] Implement breadcrumb navigation
- [ ] Create footer component
- [ ] Add mobile hamburger menu
- [ ] Implement responsive grid system

**Acceptance Criteria:**
- Layout is responsive
- Navigation is accessible
- Mobile menu works
- Breadcrumbs show current location

---

#### E12-T4: Dashboard Layout & Widgets
**Priority:** P0 | **Complexity:** L | **Dependencies:** E12-T3

**User Story:** As a homeowner, I want a dashboard that shows key information at a glance.

**Tasks:**
- [ ] Create dashboard grid layout
- [ ] Build widget components:
  - Maintenance due summary
  - Recent activity feed
  - System status overview
  - Weather widget
  - Seasonal checklist progress
  - Quick actions panel
- [ ] Implement customizable widget arrangement
- [ ] Add loading skeletons
- [ ] Create empty states
- [ ] Optimize for mobile

**Acceptance Criteria:**
- Widgets display correct data
- Layout is responsive
- Empty states are informative
- Loading states prevent layout shift

---

#### E12-T5: Forms & Validation
**Priority:** P0 | **Complexity:** M | **Dependencies:** E12-T2

**User Story:** As a user, I want forms that guide me and prevent errors.

**Tasks:**
- [ ] Set up React Hook Form
- [ ] Configure Zod validation schemas
- [ ] Create reusable form components
- [ ] Implement error display patterns
- [ ] Add field-level validation
- [ ] Create multi-step form component
- [ ] Add auto-save for long forms
- [ ] Implement form state persistence

**Acceptance Criteria:**
- Validation is consistent
- Errors display clearly
- Multi-step forms work
- Auto-save prevents data loss

---

#### E12-T6: PWA Setup
**Priority:** P1 | **Complexity:** M | **Dependencies:** E1-T1

**User Story:** As a user, I want the app to work offline and feel like a native app.

**Tasks:**
- [ ] Configure Workbox service worker
- [ ] Create manifest.json with app metadata
- [ ] Add app icons (multiple sizes)
- [ ] Implement cache strategies (per PRD section 8.4.2):
  - NetworkFirst for API calls
  - CacheFirst for static assets
  - StaleWhileRevalidate for wiki articles
  - NetworkOnly for weather
- [ ] Add offline fallback page
- [ ] Implement background sync
- [ ] Add install prompt
- [ ] Test PWA criteria (Lighthouse)

**Acceptance Criteria:**
- App installs on devices
- Offline mode works
- Cache strategies perform correctly
- Lighthouse PWA score >90

---

#### E12-T7: Loading States & Skeletons
**Priority:** P1 | **Complexity:** S | **Dependencies:** E12-T2

**User Story:** As a user, I want the app to feel responsive even when loading.

**Tasks:**
- [ ] Create skeleton components for:
  - List items
  - Cards
  - Tables
  - Forms
  - Dashboard widgets
- [ ] Implement loading spinners
- [ ] Add progressive loading
- [ ] Create optimistic UI updates
- [ ] Add loading bars for page transitions

**Acceptance Criteria:**
- Skeletons match actual content layout
- Loading states are smooth
- Optimistic updates work
- No layout shift when loading completes

---

#### E12-T8: Error Handling & Empty States
**Priority:** P1 | **Complexity:** M | **Dependencies:** E12-T2

**User Story:** As a user, I want helpful messages when things go wrong or are empty.

**Tasks:**
- [ ] Create error boundary components
- [ ] Design error state templates
- [ ] Implement empty state illustrations/messages for:
  - No homes
  - No systems
  - No scheduled maintenance
  - No maintenance logs
  - No documents
- [ ] Add actionable CTAs in empty states
- [ ] Create 404 page
- [ ] Add network error handling
- [ ] Implement retry mechanisms

**Acceptance Criteria:**
- Errors don't crash the app
- Empty states guide user to action
- Error messages are helpful
- Retry works correctly

---

#### E12-T9: Responsive Design & Mobile Optimization
**Priority:** P0 | **Complexity:** L | **Dependencies:** E12-T3

**User Story:** As a mobile user, I want the app to work well on my phone.

**Tasks:**
- [ ] Test all views on mobile breakpoints
- [ ] Optimize touch targets (minimum 44px)
- [ ] Implement mobile-specific navigation
- [ ] Add swipe gestures where appropriate
- [ ] Optimize images for mobile
- [ ] Test on actual devices (iOS, Android)
- [ ] Optimize performance for slower connections
- [ ] Add mobile-specific features (camera for photos)

**Acceptance Criteria:**
- All features work on mobile
- Touch targets are adequate
- Navigation is mobile-friendly
- Performance is acceptable on 3G

---

---

## Phase 2: V1 Launch

**Goal:** Complete feature set ready for public launch
**Timeline:** 2-3 months after MVP

---

### EPIC E6: Document Management

#### E6-T1: Document Data Model & API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E1-T4, E3-T1

**User Story:** As a homeowner, I want to store documents so everything is in one place.

**Tasks:**
- [ ] Create Document data model (per PRD section 9.1.8)
- [ ] Implement POST /api/v1/documents/upload endpoint
- [ ] Add GET /api/v1/documents endpoint (list with filters)
- [ ] Create GET /api/v1/documents/:documentId endpoint
- [ ] Implement DELETE /api/v1/documents/:documentId endpoint
- [ ] Add file type validation (PDF, images, common formats)
- [ ] Implement 10GB storage limit per home
- [ ] Add virus scanning for uploads
- [ ] Create automatic categorization based on filename
- [ ] Implement OCR for receipt scanning (future enhancement)

**Acceptance Criteria:**
- Files upload to MinIO successfully
- 10GB limit enforced
- File types validated
- Documents link to systems/components

---

#### E6-T2: Document Upload UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E6-T1

**User Story:** As a homeowner, I want to easily upload and organize documents.

**Tasks:**
- [ ] Create file upload component with drag-and-drop
- [ ] Implement bulk upload
- [ ] Add upload progress indicators
- [ ] Create document categorization (manual, warranty, receipt, etc.)
- [ ] Add tagging interface
- [ ] Link documents to systems/components
- [ ] Support mobile camera capture
- [ ] Add upload resumption for large files

**Acceptance Criteria:**
- Drag-and-drop works
- Multiple files upload
- Progress shows accurately
- Mobile camera integration works

---

#### E6-T3: Document Library UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E6-T1

**User Story:** As a homeowner, I want to browse and find my documents easily.

**Tasks:**
- [ ] Create document library list view
- [ ] Implement grid view option
- [ ] Add filtering by type, system, tags
- [ ] Create search functionality
- [ ] Implement document preview (PDF, images)
- [ ] Add download/print options
- [ ] Create sharing functionality
- [ ] Add document version history

**Acceptance Criteria:**
- Documents display in list/grid
- Search finds documents
- Preview works for supported formats
- Filtering is fast

---

---

### EPIC E7: Reminders & Notifications

#### E7-T1: Email Service Setup
**Priority:** P1 | **Complexity:** M | **Dependencies:** E1-T1

**User Story:** As the system, I want to send emails so users get notifications.

**Tasks:**
- [ ] Configure Nodemailer with email provider
- [ ] Create email templates:
  - Welcome email
  - Password reset
  - Maintenance due reminder
  - Warranty expiration
  - Seasonal checklist reminder
  - Weather alert
- [ ] Implement email queue (BullMQ)
- [ ] Add email delivery tracking
- [ ] Create unsubscribe functionality
- [ ] Implement email preferences

**Acceptance Criteria:**
- Emails send successfully
- Templates render correctly
- Queue handles failures
- Unsubscribe works

---

#### E7-T2: Notification Preferences API
**Priority:** P1 | **Complexity:** S | **Dependencies:** E2-T1

**User Story:** As a user, I want to control which notifications I receive.

**Tasks:**
- [ ] Add notification preferences to User model
- [ ] Implement PATCH /api/v1/users/me/preferences endpoint
- [ ] Create notification categories:
  - Maintenance reminders
  - Warranty expirations
  - Weather alerts
  - Seasonal checklists
  - System news
- [ ] Add frequency options (immediate, daily digest, weekly)
- [ ] Implement quiet hours

**Acceptance Criteria:**
- Users can toggle each category
- Frequency settings work
- Quiet hours are respected

---

#### E7-T3: Notification Preferences UI
**Priority:** P1 | **Complexity:** S | **Dependencies:** E7-T2

**User Story:** As a user, I want an easy way to manage my notification settings.

**Tasks:**
- [ ] Create notification settings page
- [ ] Add toggle switches for each category
- [ ] Implement frequency selectors
- [ ] Add quiet hours time picker
- [ ] Create email vs push selection
- [ ] Add test notification button

**Acceptance Criteria:**
- Settings page is intuitive
- Changes save immediately
- Test notification works

---

#### E7-T4: Scheduled Reminder System
**Priority:** P1 | **Complexity:** L | **Dependencies:** E5-T4, E7-T1

**User Story:** As a homeowner, I want reminders for upcoming maintenance so I don't forget.

**Tasks:**
- [ ] Create reminder job scheduler (BullMQ)
- [ ] Implement daily job to check upcoming maintenance
- [ ] Generate reminders based on user preferences:
  - Maintenance due (7 days, 3 days, 1 day before)
  - Overdue tasks (daily)
  - Warranty expirations (90, 60, 30 days)
- [ ] Create reminder email templates
- [ ] Add reminder dismissal/snooze
- [ ] Implement in-app notification display
- [ ] Track reminder delivery status

**Acceptance Criteria:**
- Reminders send at correct times
- Users can snooze reminders
- In-app notifications appear
- Reminder frequency respects preferences

---

#### E7-T5: Push Notification Setup (PWA)
**Priority:** P2 | **Complexity:** M | **Dependencies:** E12-T6

**User Story:** As a user, I want push notifications so I get alerts even when the app is closed.

**Tasks:**
- [ ] Implement Web Push API
- [ ] Create push notification subscription flow
- [ ] Store push subscriptions in database
- [ ] Implement push notification sending
- [ ] Add push to reminder system
- [ ] Create notification permission prompt
- [ ] Handle push notification clicks (deep linking)

**Acceptance Criteria:**
- Users can subscribe to push
- Push notifications deliver
- Clicking notification opens app
- Permissions handle gracefully

---

#### E7-T6: Weather Integration API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E3-T1

**User Story:** As a homeowner, I want weather alerts so I can prepare for extreme conditions.

**Tasks:**
- [ ] Integrate with Environment Canada weather API
- [ ] Implement GET /api/v1/weather/current endpoint
- [ ] Create GET /api/v1/weather/alerts endpoint
- [ ] Add extreme cold detection (below -30°C, -40°C)
- [ ] Detect rapid temperature changes
- [ ] Add wind chill warnings
- [ ] Implement blizzard/storm alerts
- [ ] Create spring flooding alerts
- [ ] Add weather-triggered maintenance reminders
- [ ] Cache weather data (offline support)

**Acceptance Criteria:**
- Weather data fetches for user location
- Alerts trigger appropriately
- Maintenance suggestions appear
- Offline cache works

---

#### E7-T7: Weather Widget UI
**Priority:** P1 | **Complexity:** S | **Dependencies:** E7-T6

**User Story:** As a homeowner, I want to see current weather and alerts on my dashboard.

**Tasks:**
- [ ] Create weather widget component
- [ ] Display current conditions
- [ ] Show temperature and wind chill
- [ ] Add weather alerts banner
- [ ] Display forecast summary
- [ ] Add weather-triggered task suggestions
- [ ] Implement auto-refresh

**Acceptance Criteria:**
- Weather displays correctly
- Alerts are prominent
- Suggestions are relevant
- Widget updates automatically

---

---

### EPIC E8: Community Wiki

#### E8-T1: Wiki Article Data Model & API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E1-T3, E2-T3

**User Story:** As a community member, I want to share knowledge through articles.

**Tasks:**
- [ ] Create WikiArticle data model (per PRD section 9.1.13)
- [ ] Implement POST /api/v1/wiki/articles endpoint (create draft)
- [ ] Add GET /api/v1/wiki/articles endpoint (public published articles)
- [ ] Create PATCH /api/v1/wiki/articles/:articleId endpoint
- [ ] Implement POST /api/v1/wiki/articles/:articleId/submit (submit for review)
- [ ] Add GET /api/v1/wiki/articles/my-articles endpoint
- [ ] Implement article slug generation
- [ ] Add plain text extraction for search
- [ ] Create engagement tracking (views, helpful votes)

**Acceptance Criteria:**
- Articles save as drafts
- Slugs are unique and URL-friendly
- Engagement metrics track correctly
- API enforces ownership

---

#### E8-T2: WYSIWYG Editor Integration
**Priority:** P1 | **Complexity:** M | **Dependencies:** E8-T1

**User Story:** As an author, I want a rich text editor so I can format my articles.

**Tasks:**
- [ ] Integrate TipTap editor
- [ ] Configure toolbar with formatting options:
  - Headings (H1-H4)
  - Bold, italic, underline
  - Lists (bulleted, numbered)
  - Links
  - Code blocks
  - Tables
  - Image insertion
  - Video embeds (YouTube, Vimeo)
- [ ] Add auto-save functionality (every 30 seconds)
- [ ] Implement draft restoration
- [ ] Add character/word count
- [ ] Create preview mode

**Acceptance Criteria:**
- All formatting options work
- Auto-save prevents data loss
- Preview matches final output
- Editor is responsive

---

#### E8-T3: Wiki Article Creation UI
**Priority:** P1 | **Complexity:** L | **Dependencies:** E8-T2

**User Story:** As an author, I want to create and submit articles easily.

**Tasks:**
- [ ] Create article creation page
- [ ] Add title and summary fields
- [ ] Implement WYSIWYG content editor
- [ ] Create category multi-select
- [ ] Add tag input with autocomplete
- [ ] Implement metadata form:
  - Applicable systems
  - Home types
  - Difficulty level
  - Seasons
  - Geographic region
- [ ] Add image upload gallery (up to 20 images)
- [ ] Create image caption/alt text editor
- [ ] Implement related articles selector
- [ ] Add "Save Draft" and "Submit for Review" buttons
- [ ] Show submission confirmation

**Acceptance Criteria:**
- Form guides author through creation
- All metadata options work
- Images upload correctly
- Submission triggers review workflow

---

#### E8-T4: Admin Review Dashboard
**Priority:** P1 | **Complexity:** M | **Dependencies:** E8-T1, E13-T1

**User Story:** As an admin, I want to review submitted articles efficiently.

**Tasks:**
- [ ] Create admin review queue page
- [ ] Display pending articles in list
- [ ] Show article metadata and preview
- [ ] Add quick approve/reject/request revisions actions
- [ ] Create detailed article preview modal
- [ ] Implement revision request form with feedback
- [ ] Add author contribution history view
- [ ] Create batch actions for admins
- [ ] Show review analytics (time to review, approval rate)

**Acceptance Criteria:**
- Queue shows all pending articles
- Preview displays correctly
- Actions update article status
- Feedback reaches author

---

#### E8-T5: Admin Review Workflow API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E8-T1, E13-T1

**User Story:** As the system, I want to manage article review workflow.

**Tasks:**
- [ ] Implement POST /api/v1/wiki/admin/:articleId/approve endpoint
- [ ] Add POST /api/v1/wiki/admin/:articleId/request-revisions endpoint
- [ ] Create POST /api/v1/wiki/admin/:articleId/reject endpoint
- [ ] Implement email notifications:
  - Author: article submitted
  - Admin: new submission
  - Author: approved/rejected/revisions requested
- [ ] Add review status tracking
- [ ] Create review timeline/audit trail
- [ ] Implement SLA tracking (target 48-72 hours)

**Acceptance Criteria:**
- All workflow actions work
- Notifications send correctly
- Status transitions are valid
- Audit trail is complete

---

#### E8-T6: Published Wiki Article View
**Priority:** P1 | **Complexity:** M | **Dependencies:** E8-T1

**User Story:** As a user, I want to read published wiki articles.

**Tasks:**
- [ ] Create article detail page (/wiki/:slug)
- [ ] Render article content from HTML
- [ ] Display article metadata (author, date, categories, tags)
- [ ] Show reading time estimate
- [ ] Add table of contents (auto-generated from headings)
- [ ] Display related articles
- [ ] Add helpful/not helpful voting
- [ ] Implement view count tracking
- [ ] Create print-friendly view
- [ ] Add share buttons
- [ ] Show editorial notes/warnings if present

**Acceptance Criteria:**
- Articles render correctly
- Metadata displays accurately
- TOC navigates to sections
- Voting works
- Print view is clean

---

#### E8-T7: Wiki Browse & Search UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E8-T1

**User Story:** As a user, I want to discover wiki articles easily.

**Tasks:**
- [ ] Create wiki home page
- [ ] Add featured articles carousel
- [ ] Display categories browser
- [ ] Show popular articles (by views)
- [ ] Add recently published articles
- [ ] Implement full-text search
- [ ] Create filter sidebar:
  - Categories
  - Tags
  - Difficulty
  - Seasons
  - Geographic region
- [ ] Add sort options (relevance, date, popularity, helpful percentage)
- [ ] Implement bookmark functionality

**Acceptance Criteria:**
- Home page is engaging
- Search finds relevant articles
- Filters work correctly
- Bookmarks save

---

#### E8-T8: Wiki Integration with Maintenance
**Priority:** P2 | **Complexity:** M | **Dependencies:** E8-T1, E5-T3

**User Story:** As a user, I want articles suggested when relevant to my tasks.

**Tasks:**
- [ ] Link wiki articles to maintenance tasks
- [ ] Add "Learn More" buttons in task library
- [ ] Create contextual article suggestions:
  - When viewing system details
  - When scheduling maintenance
  - When logging maintenance
  - In seasonal checklists
- [ ] Implement smart article recommendations based on user's systems
- [ ] Add article suggestions in reminders

**Acceptance Criteria:**
- Articles link to tasks correctly
- Suggestions appear contextually
- Recommendations are relevant

---

---

### EPIC E9: Service Provider Directory

#### E9-T1: Service Provider Data Model & API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E1-T3

**User Story:** As a service provider, I want to list my business so homeowners can find me.

**Tasks:**
- [ ] Create ServiceProvider data model (per PRD section 9.1.9)
- [ ] Implement POST /api/v1/providers endpoint (create listing)
- [ ] Add GET /api/v1/providers/search endpoint
- [ ] Create GET /api/v1/providers/:providerId endpoint
- [ ] Implement PATCH /api/v1/providers/:providerId endpoint
- [ ] Add service area definitions (communities, fly-in vs drive-in)
- [ ] Implement certifications and insurance tracking
- [ ] Add business hours and emergency availability
- [ ] Create verification levels (unverified → community-endorsed)

**Acceptance Criteria:**
- Providers can create listings
- Service areas define correctly
- Search works by location and service type
- Verification levels track

---

#### E9-T2: Provider Registration UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E9-T1

**User Story:** As a service provider, I want to create my business listing.

**Tasks:**
- [ ] Create provider registration form
- [ ] Add business information fields
- [ ] Implement service type multi-select
- [ ] Create service area builder (add communities)
- [ ] Add certification upload
- [ ] Implement insurance verification upload
- [ ] Add business hours schedule
- [ ] Create emergency availability settings
- [ ] Add profile photo upload

**Acceptance Criteria:**
- Form captures all business info
- Service areas save correctly
- Files upload successfully
- Profile previews accurately

---

#### E9-T3: Provider Search & Directory UI
**Priority:** P1 | **Complexity:** L | **Dependencies:** E9-T1

**User Story:** As a homeowner, I want to find service providers in my area.

**Tasks:**
- [ ] Create provider directory page
- [ ] Implement search with filters:
  - Service type
  - Community/location
  - Availability (emergency, same-day, scheduled)
  - Rating threshold
  - Certifications
- [ ] Display search results as cards
- [ ] Show distance/travel info
- [ ] Add rating and review summary
- [ ] Implement map view of providers
- [ ] Create quick contact actions (call, email)
- [ ] Add "Save to favorites" functionality

**Acceptance Criteria:**
- Search returns relevant providers
- Filters work correctly
- Map displays provider locations
- Contact actions work

---

#### E9-T4: Provider Detail Page
**Priority:** P1 | **Complexity:** M | **Dependencies:** E9-T1

**User Story:** As a homeowner, I want to see detailed provider information.

**Tasks:**
- [ ] Create provider detail page
- [ ] Display business information
- [ ] Show service areas and travel policies
- [ ] List certifications and insurance
- [ ] Display business hours
- [ ] Show reviews and ratings
- [ ] Add contact information
- [ ] Create "Request Quote" button (if Pro tier)
- [ ] Display provider analytics (if Premium+)

**Acceptance Criteria:**
- All provider info displays
- Reviews show correctly
- Contact methods work
- Quote requests send

---

#### E9-T5: Review & Rating System - Data Model & API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E9-T1, E5-T7

**User Story:** As a homeowner, I want to review providers I've used.

**Tasks:**
- [ ] Create Review data model (per PRD section 9.1.10)
- [ ] Implement POST /api/v1/providers/:providerId/reviews endpoint
- [ ] Add review verification (link to maintenance log)
- [ ] Calculate provider rating averages
- [ ] Implement helpful vote system
- [ ] Add provider response capability
- [ ] Create review moderation (flagging)
- [ ] Prevent duplicate reviews

**Acceptance Criteria:**
- Users can submit reviews
- Ratings calculate correctly
- Verified reviews badge shows
- Providers can respond

---

#### E9-T6: Review Submission & Display UI
**Priority:** P1 | **Complexity:** M | **Dependencies:** E9-T5

**User Story:** As a homeowner, I want to share my experience with providers.

**Tasks:**
- [ ] Create review submission form
- [ ] Add star rating inputs (overall, quality, professionalism, value)
- [ ] Implement review text area
- [ ] Add photo upload option
- [ ] Create "Would recommend" checkbox
- [ ] Link to maintenance log for verification
- [ ] Display reviews on provider page
- [ ] Add sorting (newest, highest rated, most helpful)
- [ ] Implement helpful voting
- [ ] Show provider responses

**Acceptance Criteria:**
- Form is easy to use
- Reviews submit correctly
- Display is readable
- Sorting works
- Helpful votes count

---

#### E9-T7: Emergency Provider Quick Access
**Priority:** P1 | **Complexity:** S | **Dependencies:** E9-T1

**User Story:** As a homeowner, I want quick access to emergency providers during a crisis.

**Tasks:**
- [ ] Create emergency contacts section in navigation
- [ ] Implement GET /api/v1/providers/emergency endpoint
- [ ] Filter providers by emergency availability
- [ ] Display provider's location and user's location
- [ ] Add one-tap calling
- [ ] Show after-hours availability
- [ ] Create recently used providers list

**Acceptance Criteria:**
- Emergency providers filter correctly
- Calling works with one tap
- Recently used list saves
- UI is accessible in crisis

---

---

### EPIC E10: Reporting & Analytics

#### E10-T1: Cost Tracking API
**Priority:** P1 | **Complexity:** M | **Dependencies:** E5-T7

**User Story:** As a homeowner, I want to see how much I spend on home maintenance.

**Tasks:**
- [ ] Aggregate cost data from maintenance logs
- [ ] Implement GET /api/v1/reports/maintenance-summary endpoint
- [ ] Add GET /api/v1/reports/cost-analysis endpoint
- [ ] Calculate metrics:
  - Total spend by period (month, year)
  - Cost by system/component
  - Cost by category (parts, labor, supplies)
  - Cost trends over time
  - DIY vs professional comparison
  - Projected costs based on scheduled maintenance
- [ ] Add budget tracking
- [ ] Generate tax-relevant reports

**Acceptance Criteria:**
- Metrics calculate accurately
- Reports filter by date range
- Budget tracking works
- Export generates correctly

---

#### E10-T2: Cost Analytics Dashboard UI
**Priority:** P1 | **Complexity:** L | **Dependencies:** E10-T1

**User Story:** As a homeowner, I want visual reports of my maintenance costs.

**Tasks:**
- [ ] Create analytics/reports page
- [ ] Add cost summary dashboard widgets:
  - Total spend (YTD, all-time)
  - Spend by system (pie chart)
  - Spend over time (line chart)
  - DIY vs professional (bar chart)
  - Top expenses (list)
- [ ] Implement date range selector
- [ ] Add system/category filters
- [ ] Create budget vs actual comparison
- [ ] Add export to PDF/CSV buttons
- [ ] Implement comparison year-over-year

**Acceptance Criteria:**
- Charts display correctly
- Filters update charts
- Export generates formatted reports
- Mobile view is readable

---

#### E10-T3: Maintenance Activity Reports
**Priority:** P2 | **Complexity:** M | **Dependencies:** E5-T7

**User Story:** As a homeowner, I want reports on my maintenance activity.

**Tasks:**
- [ ] Create maintenance frequency analysis
- [ ] Generate system health scores
- [ ] Track task completion rates
- [ ] Identify overdue maintenance trends
- [ ] Create preventive vs reactive analysis
- [ ] Generate annual maintenance summary
- [ ] Add compliance tracking (for housing authorities)

**Acceptance Criteria:**
- Activity metrics are accurate
- Health scores make sense
- Reports are actionable
- Annual summary is comprehensive

---

---

### EPIC E11: Northern-Specific Features

#### E11-T1: Heat Trace Cable Tracking
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T1, E5-T1

**User Story:** As a northern homeowner, I want to track my heat trace cables so they don't fail.

**Tasks:**
- [ ] Create heat trace cable system template
- [ ] Add zone mapping fields
- [ ] Implement wattage and circuit tracking
- [ ] Create inspection checklist
- [ ] Add continuity testing log
- [ ] Implement thermostat verification tasks
- [ ] Create extreme cold alert integration
- [ ] Add warranty tracking specific to heat trace

**Acceptance Criteria:**
- Heat trace system captures all zones
- Inspection tasks schedule correctly
- Cold alerts trigger checks
- System tracks installation dates

---

#### E11-T2: HRV/ERV Maintenance Tracking
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T1, E5-T1

**User Story:** As a northern homeowner, I want to track HRV maintenance properly.

**Tasks:**
- [ ] Create HRV/ERV system template
- [ ] Add core cleaning schedule (quarterly)
- [ ] Implement filter replacement tracking
- [ ] Create balancing records
- [ ] Add condensate drain maintenance
- [ ] Implement defrost cycle monitoring
- [ ] Create seasonal adjustment reminders
- [ ] Add performance tracking (airflow, efficiency)

**Acceptance Criteria:**
- HRV template has all maintenance tasks
- Quarterly reminders work
- Filter tracking includes part numbers
- Seasonal reminders trigger

---

#### E11-T3: Fuel Level Tracking
**Priority:** P1 | **Complexity:** M | **Dependencies:** E4-T1

**User Story:** As a northern homeowner, I want to track fuel levels so I don't run out.

**Tasks:**
- [ ] Add fuel tracking to heating systems
- [ ] Support propane, oil, wood/pellet inventory
- [ ] Implement manual level entry
- [ ] Calculate consumption rates
- [ ] Estimate days remaining
- [ ] Create reorder point alerts
- [ ] Add delivery scheduling
- [ ] Track price per unit
- [ ] Generate annual consumption analysis

**Acceptance Criteria:**
- Fuel levels save correctly
- Consumption calculates accurately
- Alerts trigger at reorder point
- Deliveries log automatically

---

#### E11-T4: Freeze Event Logging
**Priority:** P1 | **Complexity:** M | **Dependencies:** E3-T1

**User Story:** As a northern homeowner, I want to log freeze events to prevent future occurrences.

**Tasks:**
- [ ] Create FreezeEvent data model (per PRD section 9.1.12)
- [ ] Implement POST /api/v1/homes/:homeId/freeze-events endpoint
- [ ] Add GET /api/v1/homes/:homeId/freeze-events endpoint
- [ ] Capture event details:
  - Date and conditions (temp, wind chill)
  - Location and affected system
  - Damage assessment
  - Root cause analysis
  - Remediation actions
  - Prevention measures added
- [ ] Create freeze event timeline view
- [ ] Generate freeze risk analysis
- [ ] Add cost tracking for freeze damage

**Acceptance Criteria:**
- Events log completely
- Timeline shows history
- Analytics identify vulnerable areas
- Costs aggregate correctly

---

#### E11-T5: Modular Home Specific Features
**Priority:** P2 | **Complexity:** M | **Dependencies:** E3-T1, E5-T1

**User Story:** As a modular homeowner, I want features specific to my home type.

**Tasks:**
- [ ] Add modular home info fields to Home model
- [ ] Create marriage wall inspection tasks
- [ ] Add skirting maintenance checklist
- [ ] Implement foundation pile tracking
- [ ] Create leveling verification schedule
- [ ] Add belly board inspection
- [ ] Track CSA certification
- [ ] Create setup contractor records

**Acceptance Criteria:**
- Modular fields show conditionally
- Specific tasks schedule for modular homes
- Pile tracking works
- Leveling history logs

---

#### E11-T6: Emergency Preparedness Module
**Priority:** P2 | **Complexity:** M | **Dependencies:** E5-T1

**User Story:** As a northern homeowner, I want emergency preparedness guidance.

**Tasks:**
- [ ] Create emergency checklist templates:
  - Heating system failure
  - Power outage
  - Water system freeze
  - Evacuation planning
- [ ] Add emergency supplies tracking
- [ ] Create emergency contact list
- [ ] Implement scenario-based response guides
- [ ] Add printable emergency cards
- [ ] Create offline-accessible guides
- [ ] Integrate with weather alerts

**Acceptance Criteria:**
- Checklists are comprehensive
- Supplies track quantities
- Contacts are accessible
- Guides work offline
- Print versions are clear

---

---

### EPIC E13: Admin & Moderation

#### E13-T1: Admin Role & Permissions
**Priority:** P1 | **Complexity:** M | **Dependencies:** E2-T3

**User Story:** As the system, I need admin roles so certain users can moderate content.

**Tasks:**
- [ ] Add role field to User model (user, admin, super-admin)
- [ ] Create role-based middleware
- [ ] Implement admin route protection
- [ ] Add permission checking utilities
- [ ] Create admin user management
- [ ] Implement activity logging for admins

**Acceptance Criteria:**
- Roles enforce correctly
- Admin routes are protected
- Only admins can access admin functions
- Activity logs track admin actions

---

#### E13-T2: Admin Dashboard
**Priority:** P1 | **Complexity:** M | **Dependencies:** E13-T1

**User Story:** As an admin, I want a dashboard to monitor platform health.

**Tasks:**
- [ ] Create admin dashboard page
- [ ] Display key metrics:
  - User count and growth
  - Home count
  - Active maintenance tracking
  - Wiki article stats (pending, published)
  - Provider listings
  - Review moderation queue
- [ ] Add recent activity feed
- [ ] Show system health indicators
- [ ] Create quick action buttons

**Acceptance Criteria:**
- Dashboard shows accurate metrics
- Metrics update in real-time
- Quick actions work
- UI is admin-focused

---

#### E13-T3: User Management (Admin)
**Priority:** P2 | **Complexity:** M | **Dependencies:** E13-T1

**User Story:** As an admin, I want to manage users and handle issues.

**Tasks:**
- [ ] Create admin user list view
- [ ] Add user search and filtering
- [ ] Implement user detail view
- [ ] Add user suspension/ban capability
- [ ] Create account deletion (admin override)
- [ ] Add role assignment
- [ ] Implement user activity log view
- [ ] Create support ticket system (future)

**Acceptance Criteria:**
- Admin can view all users
- Search finds users
- Suspension works
- Activity logs are detailed

---

#### E13-T4: Content Moderation Tools
**Priority:** P1 | **Complexity:** M | **Dependencies:** E13-T1, E8-T1, E9-T5

**User Story:** As an admin, I want tools to moderate user-generated content.

**Tasks:**
- [ ] Create content flagging system
- [ ] Add moderation queue for:
  - Wiki articles
  - Provider reviews
  - Flagged content
- [ ] Implement content editing (admin)
- [ ] Add content removal with reasons
- [ ] Create ban/warning system for repeat offenders
- [ ] Implement automated spam detection
- [ ] Add moderation action logging

**Acceptance Criteria:**
- Flagged content queues
- Admins can edit/remove content
- Bans work correctly
- Spam detection helps

---

#### E13-T5: Provider Verification (Admin)
**Priority:** P1 | **Complexity:** M | **Dependencies:** E9-T1, E13-T1

**User Story:** As an admin, I want to verify provider listings for quality.

**Tasks:**
- [ ] Create provider verification workflow
- [ ] Add license verification process
- [ ] Implement insurance verification
- [ ] Create "Verified" badge system
- [ ] Add community endorsement tracking
- [ ] Implement provider feature/pin capability
- [ ] Create provider analytics (for feedback)

**Acceptance Criteria:**
- Verification workflow is clear
- Badges display correctly
- Featured providers show prominently
- Analytics are useful

---

---

## Phase 3: Post-Launch Enhancements

**Goal:** Revenue generation, advanced features, scaling
**Timeline:** 3+ months after V1 launch

---

### EPIC E14: Provider Monetization

#### E14-T1: Provider Subscription Tiers - Data Model
**Priority:** P2 | **Complexity:** M | **Dependencies:** E9-T1

**User Story:** As a service provider, I want to upgrade my listing for better visibility.

**Tasks:**
- [ ] Add subscription tier to ServiceProvider model (Basic, Premium, Pro, Enterprise)
- [ ] Implement subscription expiration tracking
- [ ] Create subscription history logging
- [ ] Add feature flags per tier
- [ ] Implement trial period support

**Acceptance Criteria:**
- Tiers enforce feature access
- Expiration dates work
- Trials convert properly
- History tracks payments

---

#### E14-T2: Payment Integration - Stripe
**Priority:** P2 | **Complexity:** L | **Dependencies:** E14-T1

**User Story:** As a service provider, I want to pay for premium features securely.

**Tasks:**
- [ ] Integrate Stripe payment API
- [ ] Create subscription checkout flow
- [ ] Implement webhook handlers for:
  - Subscription created
  - Payment succeeded
  - Payment failed
  - Subscription cancelled
- [ ] Add payment method management
- [ ] Create invoice generation
- [ ] Implement refund processing
- [ ] Add billing portal

**Acceptance Criteria:**
- Payments process securely
- Webhooks update subscription status
- Invoices generate correctly
- Billing portal works

---

#### E14-T3: Provider Analytics Dashboard
**Priority:** P2 | **Complexity:** M | **Dependencies:** E9-T1, E14-T1

**User Story:** As a premium provider, I want to see how my listing performs.

**Tasks:**
- [ ] Track provider metrics:
  - Profile views
  - Search appearances
  - Contact clicks (phone, email, website)
  - Direction requests
  - Quote requests
  - Conversion rate
- [ ] Create provider analytics dashboard
- [ ] Add monthly insights email report
- [ ] Implement competitor benchmarking (anonymized)
- [ ] Create export functionality

**Acceptance Criteria:**
- Metrics track accurately
- Dashboard visualizes data well
- Email reports send monthly
- Benchmarking is useful

---

#### E14-T4: Smart Provider Suggestions
**Priority:** P2 | **Complexity:** L | **Dependencies:** E5-T4, E9-T1, E14-T1

**User Story:** As a Pro provider, I want to be suggested to homeowners at the right time.

**Tasks:**
- [ ] Implement provider matching algorithm (per PRD section 4.5.3)
- [ ] Create suggestion triggers:
  - System with no recent service
  - Professional-required tasks
  - Overdue furnace service before winter
  - New system added
  - Seasonal checklist prompts
  - Emergency events
- [ ] Add frequency capping (max 2 per session)
- [ ] Implement "Featured" badge display
- [ ] Create user controls (dismiss, hide provider, disable suggestions)
- [ ] Add quality gates (only 4+ star providers)
- [ ] Track suggestion impressions and clicks

**Acceptance Criteria:**
- Suggestions are contextually relevant
- Frequency caps work
- Users can control suggestions
- Quality gates enforce
- Pro providers get preference

---

#### E14-T5: Lead Notification System
**Priority:** P2 | **Complexity:** M | **Dependencies:** E9-T1, E14-T1

**User Story:** As a Pro provider, I want notifications when users need my services.

**Tasks:**
- [ ] Create lead detection logic
- [ ] Implement real-time notifications for Pro providers:
  - User searched for their service in their area
  - User viewed their profile
  - User requested a quote
  - Relevant system added
- [ ] Add email and SMS notifications
- [ ] Create lead management dashboard for providers
- [ ] Track lead response rates
- [ ] Implement lead analytics

**Acceptance Criteria:**
- Leads detect correctly
- Notifications deliver promptly
- Providers can manage leads
- Response rates track

---

#### E14-T6: Featured Placement System
**Priority:** P2 | **Complexity:** M | **Dependencies:** E9-T3, E14-T1

**User Story:** As a Pro provider, I want featured placement in search results.

**Tasks:**
- [ ] Modify search results to prioritize Pro providers
- [ ] Add "Featured" badge to listings
- [ ] Implement top-of-category placement
- [ ] Create seasonal campaign slots
- [ ] Add A/B testing for placement effectiveness
- [ ] Track featured placement ROI for providers

**Acceptance Criteria:**
- Pro providers rank higher
- Featured badge displays
- Seasonal campaigns work
- ROI is measurable

---

#### E14-T7: Quote Request System
**Priority:** P2 | **Complexity:** M | **Dependencies:** E9-T1, E14-T1

**User Story:** As a homeowner, I want to request quotes directly from providers.

**Tasks:**
- [ ] Create quote request form
- [ ] Implement quote request routing to providers
- [ ] Add quote request tracking for homeowners
- [ ] Create provider quote response interface
- [ ] Add quote comparison view
- [ ] Track quote acceptance rates
- [ ] Implement follow-up reminders

**Acceptance Criteria:**
- Quote requests send to providers
- Providers can respond
- Homeowners can compare quotes
- Acceptance rates track

---

---

## Additional Epics (Future/Nice-to-Have)

### EPIC E15: Advanced Features

- Mobile native apps (iOS, Android)
- Smart home device integration
- Automated contractor booking
- Parts marketplace
- Energy monitoring integration
- Multi-language support
- Community forum
- Gamification (badges, achievements)

### EPIC E16: Housing Authority Features

- Bulk property licensing
- Fleet management for housing stock
- Compliance tracking and reporting
- Multi-user team accounts
- API access for integrations
- Custom reporting for authorities

### EPIC E17: Integrations

- Utility provider integrations
- Tank monitor device integration
- Parts supplier integration
- Calendar sync (Google, Apple, Outlook)
- Export to property management systems
- Insurance claim management

---

## Task Priority Legend

| Priority | Description | Timeline |
|----------|-------------|----------|
| **P0 - Critical** | Must-have for MVP, blocks other work | ASAP |
| **P1 - High** | Required for V1 launch | Before launch |
| **P2 - Medium** | Important but not blocking | Post-launch |
| **P3 - Low** | Nice-to-have, future consideration | Future |

---

## Complexity Legend

| Size | Estimate | Description |
|------|----------|-------------|
| **S - Small** | 1-2 days | Simple, well-defined task |
| **M - Medium** | 3-5 days | Moderate complexity, some unknowns |
| **L - Large** | 1-2 weeks | Complex, multiple components |
| **XL - Extra Large** | 2+ weeks | Very complex, consider breaking down |

---

## Development Phases Summary

### MVP (Phase 1) - 3-4 months
**Core Features:**
- User authentication
- Home profiles
- System tracking
- Basic maintenance scheduling and logging
- Seasonal checklists
- UI/UX foundation
- PWA setup

**Team Size:** 2-3 developers

### V1 Launch (Phase 2) - 2-3 months
**Additional Features:**
- Document management
- Notifications and weather alerts
- Community wiki with review workflow
- Service provider directory and reviews
- Cost analytics and reporting
- Northern-specific features (HRV, heat trace, etc.)
- Admin dashboard

**Team Size:** 3-4 developers

### Post-Launch (Phase 3) - Ongoing
**Revenue & Scale:**
- Provider monetization (subscriptions, smart suggestions)
- Lead generation
- Advanced analytics
- Mobile apps
- Integrations

**Team Size:** 4-6 developers + product/marketing

---

## Notes for Development

1. **Start with MVP Foundation**: Focus on E1-E5, E12 to get core functionality working
2. **Iterative Development**: Build in 2-week sprints with regular demos
3. **Test Early**: Set up automated testing from day 1
4. **Mobile-First**: Design and build for mobile from the start
5. **Performance**: Monitor performance metrics; northern communities have slower internet
6. **Offline-First**: Critical for remote areas with spotty connectivity
7. **Security**: Follow OWASP guidelines; protect user data
8. **Accessibility**: WCAG 2.1 AA compliance
9. **Documentation**: Keep docs updated as features are built
10. **Community Feedback**: Launch early with beta users in Yellowknife for feedback

---

**End of Task Breakdown**
