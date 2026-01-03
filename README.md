# FurnaceLog

**Home Maintenance Tracker for Canada's North**

FurnaceLog is a comprehensive home maintenance tracking and management platform specifically designed for homeowners in Canada's northern territories (Northwest Territories, Nunavut, and Yukon). Built to address the unique challenges of maintaining homes in extreme cold climates, including specialized heating systems, freeze prevention, and the logistics of accessing qualified tradespeople in remote communities.

---

## 🎯 Project Overview

- **Name:** FurnaceLog
- **Version:** 1.0 (MVP in development)
- **Stack:** MERN (MongoDB, Express, React, Node.js)
- **Deployment:** Dokploy on dedicated server
- **Design:** Industrial Reliability aesthetic

---

## 📋 Key Documents

| Document | Description |
|----------|-------------|
| [PRD](northern-home-tracker-prd.md) | Complete Product Requirements Document |
| [TASKS](TASKS.md) | Development task breakdown by epic and phase |
| [DEPLOYMENT](DOKPLOY_DEPLOYMENT.md) | Dokploy deployment guide for production |

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18+ with Vite
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching
- React Hook Form + Zod validation
- PWA with offline-first capabilities

**Backend:**
- Node.js 20 LTS
- Express.js or Fastify
- Mongoose ODM for MongoDB
- Passport.js + JWT authentication
- BullMQ for job queuing

**Database & Storage:**
- MongoDB 7+ (primary database)
- Redis 7+ (caching, sessions, job queue)
- MinIO (S3-compatible object storage)

**Infrastructure:**
- Docker containers
- Dokploy for deployment
- Traefik reverse proxy (via Dokploy)
- Let's Encrypt SSL certificates

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 LTS
- Docker & Docker Compose
- Git

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/charlesfaubert44-wq/furnacelog.git
   cd furnacelog
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   This starts:
   - MongoDB (port 27017)
   - Redis (port 6379)
   - MinIO (port 9000 API, 9001 Console)
   - Backend API (port 3000)
   - Frontend (port 5173)
   - MailHog for email testing (port 8025)

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/v1
   - MinIO Console: http://localhost:9001
   - MailHog: http://localhost:8025

5. **Initialize MongoDB:**
   ```bash
   # MongoDB initialization runs automatically on first start
   # Collections and indexes are created via mongo-init.js
   ```

### Manual Backend Setup (without Docker)

```bash
cd backend
npm install
npm run dev
```

### Manual Frontend Setup (without Docker)

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Project Structure

```
furnacelog/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── package.json
│   └── ...
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── services/       # API services
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── ...
├── backend.Dockerfile       # Backend Docker config
├── frontend.Dockerfile      # Frontend Docker config
├── nginx.conf              # Nginx config for frontend
├── docker-compose.yml      # Local development
├── .env.example            # Environment variables template
├── mongo-init.js           # MongoDB initialization
├── healthcheck.js          # Docker health check
├── northern-home-tracker-prd.md  # Product requirements
├── TASKS.md                # Development tasks
├── DOKPLOY_DEPLOYMENT.md   # Deployment guide
└── README.md               # This file
```

---

## 🎨 Design System

**Theme:** "Industrial Reliability"
- Professional maintenance logbook aesthetic
- High-contrast industrial color palette ("Boiler Room" & "Heat & Function")
- Strong typography with systematic layouts
- Blueprint-inspired grids
- Utilitarian, function-first design

**Colors:**
- Primary: Graphite (#1A1D23), Steel Gray (#2C3440)
- Accents: System Green (#059669), Heat Orange (#EA580C), Emergency Red (#B91C1C)

---

## 🔧 Key Features

### Phase 1: MVP
- ✅ User authentication & profiles
- ✅ Home profile management (multiple properties)
- ✅ System & component tracking
- ✅ Maintenance task library (100+ northern-specific tasks)
- ✅ Maintenance scheduling & logging
- ✅ Seasonal checklists (freeze-up, winter, break-up, summer)
- ✅ PWA with offline support

### Phase 2: V1 Launch
- 📄 Document management
- 🔔 Reminders & notifications
- 🌤️ Weather integration (Environment Canada)
- 📚 Community wiki with WYSIWYG editor
- 🔍 Service provider directory
- ⭐ Reviews & ratings
- 📊 Cost tracking & analytics
- ❄️ Northern-specific features (HRV, heat trace, fuel tracking)

### Phase 3: Post-Launch
- 💰 Provider monetization (subscriptions)
- 🎯 Smart provider suggestions
- 📱 Native mobile apps
- 🏢 Housing authority features

---

## 📝 Development Phases

### MVP (3-4 months)
**Team:** 2-3 developers
**Focus:** Core infrastructure + basic features
- See [TASKS.md](TASKS.md) for detailed task breakdown

### V1 Launch (2-3 months)
**Team:** 3-4 developers
**Focus:** Complete feature set + polish

### Post-Launch (Ongoing)
**Team:** 4-6 developers + product/marketing
**Focus:** Revenue, scaling, advanced features

---

## 🚢 Deployment

### Production (Dokploy)

FurnaceLog is designed to be deployed on a dedicated server using Dokploy.

**Prerequisites:**
- Dedicated server with Ubuntu 22.04 LTS
- 4GB+ RAM, 2+ CPU cores, 50GB+ storage
- Domain name
- Docker installed

**Quick Deploy:**

1. Follow the comprehensive [DOKPLOY_DEPLOYMENT.md](DOKPLOY_DEPLOYMENT.md) guide
2. Install MongoDB on server
3. Install Dokploy
4. Deploy backend and frontend via Dokploy dashboard
5. Configure SSL via Let's Encrypt

**Deployment Checklist:**
- [ ] Server provisioned and secured
- [ ] MongoDB installed and configured
- [ ] Dokploy installed
- [ ] DNS records configured
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] SSL certificates active
- [ ] Backups configured
- [ ] Monitoring set up

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking (if using TypeScript)
npm run type-check
```

---

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure headers via Helmet.js
- MongoDB authentication required
- Redis password protection
- File upload validation and virus scanning

---

## 📊 Monitoring

### Health Checks

- Backend: `GET /api/v1/health`
- Frontend: `GET /health`

### Recommended Monitoring

- Uptime Kuma for service monitoring
- Grafana + Prometheus for metrics (advanced)
- Docker container logs
- MongoDB performance monitoring

---

## 🔄 Backups

**MongoDB:**
```bash
# Automated daily backups at 2 AM
/opt/backup-mongodb.sh
```

**MinIO:**
- Data stored in `/data/minio`
- Include in server backup strategy

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request
5. Wait for CI/CD checks to pass
6. Get code review approval
7. Merge to main

### Code Standards

- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📖 API Documentation

API documentation will be available at:
- Development: http://localhost:3000/api/v1/docs
- Production: https://api.furnacelog.yourdomain.com/api/v1/docs

Generated using OpenAPI/Swagger specification.

---

## 🌐 Environment Variables

See [.env.example](.env.example) for complete list of environment variables.

**Critical Variables:**
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `REDIS_URL` - Redis connection URL
- `MINIO_*` - MinIO configuration
- `SMTP_*` - Email configuration
- `VITE_API_URL` - Backend API URL (frontend)

---

## 📄 License

[License to be determined]

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/charlesfaubert44-wq/furnacelog/issues)
- **Documentation:** See PRD and deployment guide
- **Email:** support@furnacelog.com (when available)

---

## 🙏 Acknowledgments

- Inspired by LubeLogger's approach to maintenance tracking
- Built for northern homeowners and communities
- Designed with northern climate challenges in mind

---

## 🗺️ Roadmap

See [TASKS.md](TASKS.md) for detailed roadmap and task breakdown.

**Current Phase:** MVP Development
**Next Milestone:** MVP completion (Q2 2026)
**V1 Launch Target:** Q3 2026

---

**Built with ❄️ for Canada's North**
