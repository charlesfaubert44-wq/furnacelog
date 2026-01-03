# Getting Started with FurnaceLog

This guide will help you get FurnaceLog set up and pushed to GitHub.

---

## 🚀 Initial Setup

### 1. Initialize Git Repository (if not already done)

```bash
# Navigate to project directory
cd C:\Users\charl\Desktop\Charles\Projects\homemanager

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: FurnaceLog project setup with PRD, tasks, and deployment configs"
```

### 2. Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/charlesfaubert44-wq/furnacelog.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📁 Current Project Structure

Your repository now includes:

```
furnacelog/
├── 📄 README.md                        # Project overview and quick start
├── 📄 northern-home-tracker-prd.md    # Complete Product Requirements Document
├── 📄 TASKS.md                         # Development task breakdown (91+ tasks)
├── 📄 DOKPLOY_DEPLOYMENT.md           # Production deployment guide
├── 📄 GETTING_STARTED.md              # This file
├── 🐳 backend.Dockerfile               # Backend container config
├── 🐳 frontend.Dockerfile              # Frontend container config
├── 🐳 docker-compose.yml               # Local development environment
├── ⚙️ nginx.conf                       # Nginx web server config
├── ⚙️ .env.example                     # Environment variables template
├── 🗄️ mongo-init.js                   # MongoDB initialization script
├── 🏥 healthcheck.js                   # Docker health check
└── 🚫 .gitignore                       # Git ignore rules
```

---

## 🏗️ Next Steps

### For Development

1. **Set up local environment:**
   ```bash
   # Copy environment variables
   cp .env.example .env

   # Start all services
   docker-compose up -d
   ```

2. **Create project directories:**
   ```bash
   # Create backend structure
   mkdir -p backend/src/{models,routes,controllers,middleware,services,utils}

   # Create frontend structure
   mkdir -p frontend/src/{components,pages,hooks,lib,services}
   ```

3. **Initialize backend:**
   ```bash
   cd backend
   npm init -y
   npm install express mongoose dotenv bcrypt jsonwebtoken passport passport-jwt zod
   npm install -D nodemon
   ```

4. **Initialize frontend:**
   ```bash
   cd frontend
   npm create vite@latest . -- --template react
   npm install @tanstack/react-query react-hook-form @hookform/resolvers zod
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

5. **Start development:**
   - Follow [TASKS.md](TASKS.md) starting with Epic E1 (Infrastructure)
   - Begin with E2 (Authentication) for core functionality
   - Reference [PRD](northern-home-tracker-prd.md) for detailed requirements

### For Deployment

When ready to deploy to production:

1. Set up dedicated server (Ubuntu 22.04 LTS recommended)
2. Follow [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md) step-by-step
3. Configure environment variables in Dokploy dashboard
4. Deploy backend and frontend containers
5. Set up SSL certificates
6. Configure monitoring and backups

---

## 📚 Key Documentation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [README.md](README.md) | Project overview, quick reference | Getting oriented, showing to others |
| [northern-home-tracker-prd.md](northern-home-tracker-prd.md) | Complete product requirements | Understanding features, design decisions |
| [TASKS.md](TASKS.md) | Development roadmap with 91+ tasks | Planning sprints, tracking progress |
| [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md) | Production deployment guide | Deploying to dedicated server |

---

## 🎯 Development Phases

### Phase 1: MVP (Current - Months 1-4)
**Focus:** Core functionality
- ✅ Infrastructure & DevOps (E1)
- ✅ Authentication (E2)
- ✅ Home Profiles (E3)
- ✅ System Tracking (E4)
- ✅ Maintenance Management (E5)
- ✅ UI/UX Foundation (E12)

**Goal:** Working app where homeowners can track homes and maintenance

### Phase 2: V1 Launch (Months 5-7)
**Focus:** Complete feature set
- Document management
- Notifications & weather alerts
- Community wiki
- Service provider directory
- Analytics & reporting
- Northern-specific features

**Goal:** Public launch ready

### Phase 3: Post-Launch (Months 8+)
**Focus:** Revenue & scaling
- Provider monetization
- Smart suggestions
- Mobile apps
- Advanced features

---

## 🛠️ Technology Stack

**Frontend:**
- React 18+ with Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod

**Backend:**
- Node.js 20 LTS
- Express.js
- Mongoose (MongoDB ODM)
- JWT authentication
- BullMQ (job queue)

**Infrastructure:**
- Docker containers
- MongoDB 7
- Redis 7
- MinIO (S3-compatible storage)
- Dokploy (deployment)

---

## 📝 Git Workflow

### Branch Strategy

```bash
main                    # Production-ready code
├── develop            # Integration branch
├── feature/auth       # Feature branches
├── feature/homes      # Feature branches
└── hotfix/bug-123     # Hotfix branches
```

### Commit Message Format

```
type(scope): short description

Longer description if needed

Examples:
- feat(auth): add JWT authentication
- fix(homes): resolve GPS coordinate bug
- docs(readme): update setup instructions
- chore(deps): update dependencies
```

### Common Commands

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat(scope): description"

# Push to GitHub
git push origin feature/feature-name

# Update from main
git checkout main
git pull origin main
git checkout feature/feature-name
git merge main

# Create pull request on GitHub
# Review, approve, merge
```

---

## 🧪 Testing Strategy

### Unit Tests
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library

### Integration Tests
- API endpoint testing
- Database integration

### E2E Tests
- Playwright or Cypress
- Critical user flows

---

## 🔐 Security Checklist

Before deployment:

- [ ] All environment variables in `.env` (not committed)
- [ ] Strong passwords for MongoDB, Redis, MinIO
- [ ] JWT secrets generated (use `openssl rand -base64 64`)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Input validation with Zod
- [ ] File upload limits configured
- [ ] HTTPS/SSL certificates
- [ ] Firewall rules configured
- [ ] Database authentication enabled

---

## 🚨 Common Issues & Solutions

### "Module not found" errors
```bash
# Install missing dependencies
npm install
```

### Docker containers won't start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d
```

### MongoDB connection refused
```bash
# Verify MongoDB is running
docker ps | grep mongodb

# Check connection string in .env
# Should be: mongodb://admin:password@localhost:27017/furnacelog?authSource=admin
```

### Port already in use
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F

# Or use different port in .env
```

---

## 📞 Getting Help

- **Documentation:** Check README, PRD, and deployment guide first
- **Issues:** [GitHub Issues](https://github.com/charlesfaubert44-wq/furnacelog/issues)
- **Tasks:** Reference [TASKS.md](TASKS.md) for implementation details

---

## ✅ Pre-Launch Checklist

### Development
- [ ] Git repository initialized
- [ ] All files committed
- [ ] `.env` configured for local development
- [ ] Docker services running
- [ ] MongoDB initialized with collections
- [ ] Backend server starts successfully
- [ ] Frontend builds without errors

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] E2E tests for critical flows
- [ ] Manual testing completed

### Documentation
- [ ] README accurate and complete
- [ ] API documentation generated
- [ ] Deployment guide tested
- [ ] Code comments added

### Production Ready
- [ ] Server provisioned
- [ ] Dokploy installed
- [ ] MongoDB secured
- [ ] SSL certificates configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Security audit completed

---

**Ready to build FurnaceLog! 🔥**

Start with [TASKS.md](TASKS.md) Epic E1 for infrastructure setup.
