# Product Requirements Document (PRD)
# FurnaceLog: Home Maintenance Tracker for Canada's North

**Version:** 1.0  
**Date:** January 2, 2026  
**Author:** Charles  
**Status:** Draft  

---

## Executive Summary

FurnaceLog is a comprehensive home maintenance tracking and management platform specifically designed for homeowners in Canada's northern territories (Northwest Territories, Nunavut, and Yukon). Inspired by LubeLogger's approach to vehicle maintenance tracking, FurnaceLog addresses the unique challenges of maintaining homes in extreme cold climates, including modular housing, specialized heating systems, freeze prevention, and the logistics of accessing qualified tradespeople in remote communities.

The platform will be self-hosted using Docker with MongoDB, deployed via Dokploy on a dedicated server, ensuring data sovereignty and offline-first capabilities essential for northern communities with intermittent internet connectivity.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Users](#2-target-users)
3. [Goals & Objectives](#3-goals--objectives)
4. [Business Model & Monetization](#4-business-model--monetization)
5. [Scope](#5-scope)
6. [Functional Requirements](#6-functional-requirements)
7. [Northern-Specific Features](#7-northern-specific-features)
8. [Service Provider Directory](#8-service-provider-directory)
9. [Technical Architecture](#9-technical-architecture)
10. [Data Models](#10-data-models)
11. [User Interface Requirements](#11-user-interface-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Deployment & Infrastructure](#13-deployment--infrastructure)
14. [Security Requirements](#14-security-requirements)
15. [Future Considerations](#15-future-considerations)
16. [Success Metrics](#16-success-metrics)
17. [Appendices](#17-appendices)

---

## 1. Problem Statement

### 1.1 The Challenge

Homeowners in Canada's northern territories face unique maintenance challenges that existing home management applications fail to address:

- **Extreme Climate Conditions:** Temperatures regularly dropping below -40°C require specialized maintenance schedules and preventive measures not found in standard home maintenance apps
- **Specialized Systems:** Northern homes rely on systems rarely seen in southern Canada—tankless water heaters with freeze protection, heat trace cables, HRV systems, propane/oil furnaces, and boiler systems requiring specific maintenance protocols
- **Modular Housing Prevalence:** Many northern communities have predominantly modular/manufactured housing with unique maintenance requirements, warranty tracking, and component lifecycles
- **Limited Service Provider Access:** Remote communities may have few or no local tradespeople, requiring coordination with fly-in services or planning around seasonal accessibility
- **High Stakes for Failure:** A frozen pipe or furnace failure in -40°C isn't an inconvenience—it's a potential disaster that can destroy a home within hours
- **Expensive Repairs:** Parts and labor costs are significantly higher in the north, making preventive maintenance economically critical
- **No Existing Solutions:** Current home maintenance apps assume southern Canadian/American climate conditions and urban service availability

### 1.2 The Opportunity

FurnaceLog will be the first home maintenance platform purpose-built for northern Canadian conditions, providing:

- Climate-appropriate maintenance schedules
- Northern-specific system tracking (HRV, heat trace, tankless heaters, etc.)
- Emergency preparedness integration
- Local service provider discovery and reviews
- Community knowledge sharing for remote locations
- Offline functionality for areas with limited connectivity

---

## 2. Target Users

### 2.1 Primary Users

#### 2.1.1 Northern Homeowners
- **Demographics:** Residents of NWT, Nunavut, Yukon, and northern regions of provinces
- **Housing Types:** Modular homes, stick-built homes, log homes, mobile homes
- **Technical Proficiency:** Varies from basic to advanced; many are comfortable with DIY maintenance due to necessity
- **Pain Points:** Keeping track of seasonal maintenance, finding reliable contractors, managing expensive heating systems

#### 2.1.2 Property Managers
- **Context:** Managing multiple properties, often across different communities
- **Needs:** Centralized tracking, maintenance scheduling across properties, contractor coordination
- **Pain Points:** Coordinating maintenance in remote locations, tracking warranties across properties

#### 2.1.3 Housing Organizations
- **Context:** Indigenous housing authorities, territorial housing corporations
- **Needs:** Fleet management for housing stock, compliance tracking, maintenance budgeting
- **Pain Points:** Standardizing maintenance across communities, reporting requirements

### 2.2 Secondary Users

#### 2.2.1 Service Providers
- **Context:** Plumbers, electricians, HVAC technicians serving northern communities
- **Needs:** Business listing, service area definition, customer communication
- **Pain Points:** Reaching customers in remote areas, scheduling logistics

#### 2.2.2 New Northern Residents
- **Context:** People relocating to the north for work (mining, government, healthcare)
- **Needs:** Education on northern home maintenance, local service provider discovery
- **Pain Points:** Unfamiliarity with northern-specific systems and maintenance requirements

---

## 3. Goals & Objectives

### 3.1 Primary Goals

| Goal | Description | Success Indicator |
|------|-------------|-------------------|
| **Prevent Catastrophic Failures** | Reduce emergency home repairs through proactive maintenance tracking | 50% reduction in emergency service calls for tracked homes |
| **Simplify Northern Homeownership** | Provide clear, actionable maintenance guidance for northern-specific systems | User satisfaction rating >4.5/5 |
| **Connect Communities with Services** | Build comprehensive directory of northern service providers | 80% of NWT/Nunavut communities have listed providers |
| **Preserve Institutional Knowledge** | Capture and share northern home maintenance expertise | Active community knowledge base with 500+ articles |

### 3.2 Business Objectives

- **Self-Hosted First:** Ensure platform can run entirely on local infrastructure without external dependencies
- **Community-Driven:** Build platform that can be maintained and extended by northern tech community
- **Open Data Standards:** Use exportable, non-proprietary data formats for all user data
- **Sustainable Model:** Design for long-term community sustainability, not venture-scale growth

### 3.3 Non-Goals (Out of Scope for V1)

- Smart home device integration
- Automated contractor booking/payment
- Real-time energy monitoring
- Multi-language support (English only for V1)
- Mobile native apps (PWA only for V1)

---

## 4. Business Model & Monetization

### 4.1 Strategy Overview

FurnaceLog follows a **freemium model** with a two-phase go-to-market strategy:

1. **Phase 1 (Months 1-12):** Build homeowner user base with a fully-featured free tier
2. **Phase 2 (Months 6-18):** Introduce premium business listings and lead generation for service providers

The core principle: **Homeowners never pay.** Revenue comes from businesses who want access to engaged, homeowning customers actively seeking services.

### 4.2 User Tiers

#### 4.2.1 Homeowner Tier (Always Free)

| Feature | Included |
|---------|----------|
| Home profiles | Unlimited |
| System & component tracking | ✅ Full access |
| Maintenance scheduling | ✅ Unlimited tasks |
| Seasonal checklists | ✅ All seasons |
| Document storage | 10 GB per home |
| Service history & logging | ✅ Unlimited |
| Cost tracking & reports | ✅ Full analytics |
| Weather alerts | ✅ All alerts |
| Service provider directory | ✅ Search & view |
| Provider reviews | ✅ Read & write |
| Emergency contacts | ✅ Save unlimited |
| Export data | ✅ Full export |

**Why Free Forever:**
- Removes adoption friction in small northern communities
- Builds trust and word-of-mouth growth
- Creates valuable, engaged audience for premium providers
- Aligns with community-focused mission

#### 4.2.2 Property Manager Tier (Future - Optional Paid)

For users managing 5+ properties, potential future paid tier with:
- Bulk operations across properties
- Team member accounts
- Advanced reporting and compliance tools
- API access for integration
- Priority support

*Note: Evaluate demand before implementing. May remain free to maximize platform value.*

### 4.3 Business/Provider Tiers

#### 4.3.1 Basic Listing (Free)

| Feature | Included |
|---------|----------|
| Business profile | ✅ Basic info |
| Service areas | ✅ Up to 3 communities |
| Contact display | ✅ Phone & email |
| Customer reviews | ✅ Receive reviews |
| Search visibility | Standard ranking |
| Analytics | ❌ Not included |
| Lead notifications | ❌ Not included |
| Featured placement | ❌ Not included |
| Verified badge | ❌ Not included |

**Purpose:** Populate directory with providers, give small operators visibility, encourage upgrades.

#### 4.3.2 Premium Provider ($49/month or $470/year)

| Feature | Included |
|---------|----------|
| Everything in Basic | ✅ |
| Service areas | ✅ Unlimited communities |
| Enhanced profile | ✅ Photos, certifications, detailed services |
| Verified badge | ✅ License & insurance verified |
| Search visibility | **Priority ranking** in results |
| Website & social links | ✅ Full linking |
| Response to reviews | ✅ Public responses |
| Business hours & availability | ✅ Real-time status |
| Analytics dashboard | ✅ Profile views, search appearances |
| Monthly insights report | ✅ Email digest |

#### 4.3.3 Pro Provider ($149/month or $1,430/year)

| Feature | Included |
|---------|----------|
| Everything in Premium | ✅ |
| **Featured Placement** | ✅ Top of category results |
| **Smart Suggestions** | ✅ Recommended to users based on their systems |
| **Lead Notifications** | ✅ Alert when users search your services |
| **Maintenance Reminders** | ✅ Your business suggested in user reminders |
| Quote request system | ✅ Receive quote requests directly |
| Seasonal campaign slots | ✅ Pre-freeze-up, etc. promotions |
| Profile performance analytics | ✅ Conversion tracking |
| Competitor benchmarking | ✅ Anonymous category comparisons |
| Priority support | ✅ Direct support line |
| Custom promotional content | ✅ Tips & guides with your branding |

#### 4.3.4 Enterprise (Custom Pricing)

For large service companies, fuel suppliers, or multi-location businesses:
- Multi-location management
- Territory exclusivity options
- API integration for lead management
- Co-branded content partnerships
- Custom reporting
- Dedicated account manager

### 4.4 Revenue Streams

#### 4.4.1 Primary Revenue: Provider Subscriptions

| Tier | Monthly | Annual | Target Subscribers (Y2) | ARR |
|------|---------|--------|------------------------|-----|
| Premium | $49 | $470 | 40 | $18,800 |
| Pro | $149 | $1,430 | 15 | $21,450 |
| Enterprise | ~$500 | ~$5,000 | 3 | $15,000 |
| **Total** | | | **58** | **$55,250** |

#### 4.4.2 Secondary Revenue Streams (Future)

| Stream | Model | Timeline |
|--------|-------|----------|
| **Seasonal Promotions** | Pay-per-campaign featured placement during high-demand seasons | Year 2 |
| **Lead Generation Fees** | Per-lead fee for quote requests (alternative to subscription) | Year 2 |
| **Parts Marketplace Commission** | % fee on parts ordered through platform | Year 3 |
| **Housing Authority Licensing** | Annual license for bulk property management | Year 2 |
| **Data Insights** | Anonymized market data for suppliers, insurers | Year 3 |

### 4.5 Smart Suggestion System

The key monetization feature: **Contextual provider recommendations** that feel helpful, not spammy.

#### 4.5.1 Suggestion Triggers

| User Action | Provider Suggestion |
|-------------|---------------------|
| Logs system with no recent professional service | "Due for professional inspection? [Provider Name] serves your area" |
| Views maintenance task marked "Professional Required" | "Recommended providers for this service:" |
| Has overdue furnace service before winter | "Schedule your pre-winter furnace service with a verified provider" |
| Adds new system (e.g., tankless heater) | "Providers certified for [Brand] installation and service:" |
| Searches provider directory | Pro providers featured at top with "Featured" badge |
| Receives seasonal checklist | "Need help? These providers offer pre-freeze-up packages:" |
| Logs freeze event or emergency | "Emergency services available in [Community]:" |

#### 4.5.2 Suggestion Rules

To maintain user trust and avoid dark patterns:

1. **Transparency:** All paid placements clearly marked as "Featured" or "Sponsored"
2. **Relevance:** Only suggest providers who actually serve user's community and system types
3. **Frequency Caps:** Maximum 2 provider suggestions per session
4. **User Control:** Users can dismiss suggestions, hide specific providers, or disable suggestions entirely
5. **Quality Gate:** Only Premium+ providers with 4+ star ratings eligible for smart suggestions
6. **No Fake Urgency:** Never manufacture false urgency to push provider bookings

#### 4.5.3 Matching Algorithm

```
Provider Match Score = 
  (Service Match × 0.3) +
  (Location Match × 0.3) +
  (Rating Score × 0.2) +
  (Subscription Tier × 0.15) +
  (Response Rate × 0.05)

Where:
- Service Match: Provider offers services for user's systems
- Location Match: Provider serves user's community
- Rating Score: Normalized rating (0-1)
- Subscription Tier: Basic=0, Premium=0.5, Pro=1
- Response Rate: Historical quote response rate
```

### 4.6 Pricing Psychology & Positioning

#### 4.6.1 Value Proposition by Tier

| Tier | Positioning | Key Message |
|------|-------------|-------------|
| Basic | "Get discovered" | "Free visibility to northern homeowners" |
| Premium | "Stand out" | "Be the verified choice when homeowners search" |
| Pro | "Grow your business" | "Get recommended to the right customers at the right time" |

#### 4.6.2 Pricing Rationale

- **$49/month Premium:** Less than one service call profit; low barrier to entry
- **$149/month Pro:** ~1 new customer/month pays for itself; clear ROI
- **Annual discount (20%):** Encourages commitment, reduces churn
- **No per-lead fees in subscriptions:** Predictable costs for providers

### 4.7 Go-to-Market Phases

#### Phase 1: User Acquisition (Months 1-12)

**Goal:** 500 registered homeowners, 750 homes tracked

**Tactics:**
- Soft launch in Yellowknife (home community)
- Partner with Arctic Energy Alliance for promotion
- Content marketing: Northern home maintenance guides
- Local Facebook group engagement
- Word-of-mouth through existing networks

**Provider Strategy:**
- Manually onboard 50 providers with free Basic listings
- Focus on essential categories: plumbers, HVAC, electricians, fuel suppliers
- Build directory value before monetizing

#### Phase 2: Provider Monetization (Months 6-18)

**Goal:** 30 paying provider accounts, $25,000 ARR

**Tactics:**
- Reach out to established providers with engagement data
- "Your profile was viewed X times last month" conversion emails
- Offer 3-month Pro trial to top-rated providers
- Case studies from early Premium adopters
- Introduce smart suggestions (Pro feature)

**Conversion Funnel:**
```
Basic Listing → Profile Views Report → Premium Trial → Paid Conversion
                     ↓
              Lead Notification Preview → Pro Upgrade
```

#### Phase 3: Scale & Expand (Months 12-24)

**Goal:** 1,500 users, 100 paying providers, $55,000 ARR

**Tactics:**
- Expand to Yukon and Nunavut communities
- Housing authority partnerships (bulk licensing)
- Seasonal promotion packages
- Provider referral program
- Mobile app launch (increases engagement, provider value)

### 4.8 Provider Success Metrics

Track and share with providers to demonstrate value:

| Metric | Description | Shown To |
|--------|-------------|----------|
| Profile Views | Times profile viewed | Premium+ |
| Search Appearances | Times appeared in search results | Premium+ |
| Contact Clicks | Phone/email/website clicks | Premium+ |
| Direction Requests | Map/directions requested | Premium+ |
| Quote Requests | Direct quote inquiries | Pro |
| Suggestion Impressions | Times shown in smart suggestions | Pro |
| Suggestion Clicks | Clicks from smart suggestions | Pro |
| Conversion Rate | Quote requests / profile views | Pro |
| Category Rank | Position vs. competitors | Pro |

### 4.9 Competitive Moat

Why providers will pay for FurnaceLog vs. alternatives:

1. **Targeted Audience:** Only platform specifically for northern homeowners
2. **Intent Signal:** Users actively tracking home maintenance = high purchase intent
3. **Trust Transfer:** Platform verification transfers trust to providers
4. **Local Network Effects:** As more users join a community, provider value increases
5. **Data Advantage:** Know exactly what systems users have, what's due for service
6. **Low Competition:** No equivalent platforms serving this market

### 4.10 Financial Projections

#### Year 1-3 Revenue Forecast

| Year | Users | Paying Providers | ARR | Notes |
|------|-------|-----------------|-----|-------|
| 1 | 500 | 15 | $12,000 | Focus on user growth |
| 2 | 1,500 | 58 | $55,000 | Full monetization |
| 3 | 4,000 | 120 | $120,000 | Regional expansion |

#### Cost Structure (Year 2)

| Category | Monthly | Annual |
|----------|---------|--------|
| Hosting (Dedicated Server) | $150 | $1,800 |
| Domain & SSL | $5 | $60 |
| Email Service (Notifications) | $50 | $600 |
| Weather API | $25 | $300 |
| Backup Storage | $20 | $240 |
| Development Tools | $50 | $600 |
| **Total Infrastructure** | **$300** | **$3,600** |

**Gross Margin at $55K ARR:** ~93%

### 4.11 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Providers don't see value | Revenue = 0 | Build user base first; show engagement data before asking for payment |
| Users distrust paid suggestions | User churn | Strict transparency rules; quality gates; user controls |
| Small market size | Limited growth | Expand to northern provinces (ON, QC, MB, SK, AB northern regions) |
| Provider churn | Revenue instability | Annual discount; demonstrate ROI; continuous feature development |
| Competitor entry | Market share loss | Move fast; build community trust; leverage local knowledge |

---

## 5. Scope

### 5.1 In Scope

#### Core Features
- Home profile management (single and multiple properties)
- Maintenance task tracking with northern-specific schedules
- Component/system inventory with warranty tracking
- Service history logging
- Document storage (manuals, warranties, receipts)
- Reminder/notification system
- Service provider directory
- Basic reporting and analytics

#### Northern-Specific Features
- Seasonal maintenance checklists (freeze-up, break-up, etc.)
- Heat trace cable monitoring schedules
- HRV filter and maintenance tracking
- Propane/oil tank level tracking
- Furnace/boiler service scheduling
- Modular home specific maintenance
- Emergency preparedness checklists
- Extreme cold weather protocols

### 5.2 Out of Scope (V1)

- Integration with utility providers
- Automated parts ordering
- Contractor scheduling/booking system
- Home valuation tracking
- Insurance claim management
- Community forum (future consideration)

---

## 6. Functional Requirements

### 6.1 Home Profile Management

#### FR-1.1: Home Registration
- **Description:** Users can register one or more homes with detailed profiles
- **Fields Required:**
  - Home name/identifier
  - Physical address
  - Community/settlement
  - GPS coordinates (for remote locations without addresses)
  - Home type (modular, stick-built, log, mobile, other)
  - Year built/installed
  - Square footage
  - Number of bedrooms/bathrooms
  - Foundation type (piles, crawlspace, basement, slab-on-grade)
  - Primary heating system type
  - Secondary heating system (if applicable)
  - Water source (municipal, well, trucked)
  - Sewage system (municipal, septic, holding tank)
  - Electrical service (grid, generator, hybrid)
- **Acceptance Criteria:**
  - User can create home profile in under 5 minutes
  - All fields have appropriate validation
  - GPS coordinates can be entered manually or via map picker
  - Home type selection triggers relevant system templates

#### FR-1.2: Home Dashboard
- **Description:** Central view of home status, upcoming maintenance, and alerts
- **Components:**
  - Maintenance due summary (overdue, due this week, due this month)
  - Recent activity feed
  - System status overview (heating, plumbing, electrical, etc.)
  - Weather integration showing current conditions and alerts
  - Quick-add buttons for common tasks
  - Seasonal checklist progress
- **Acceptance Criteria:**
  - Dashboard loads in under 2 seconds
  - Critical alerts prominently displayed
  - Mobile-responsive layout
  - Customizable widget arrangement

#### FR-1.3: Multi-Property Support
- **Description:** Users can manage multiple properties with easy switching
- **Features:**
  - Property selector in navigation
  - Aggregate dashboard view across all properties
  - Per-property and aggregate reporting
  - Bulk maintenance scheduling
- **Acceptance Criteria:**
  - Support for unlimited properties per account
  - Clear visual distinction between properties
  - Cross-property search functionality

### 6.2 System & Component Management

#### FR-2.1: System Registration
- **Description:** Track major home systems with detailed specifications
- **Pre-defined System Categories:**
  - Heating (furnace, boiler, baseboards, in-floor)
  - Hot Water (tank, tankless/on-demand, boiler-fed)
  - Ventilation (HRV, ERV, exhaust fans)
  - Plumbing (supply lines, drains, fixtures)
  - Electrical (panel, circuits, fixtures)
  - Freeze Protection (heat trace, pipe insulation)
  - Fuel Storage (propane tanks, oil tanks)
  - Structure (foundation, siding, roofing, windows)
  - Appliances (range, refrigerator, washer/dryer, etc.)
- **Fields per System:**
  - System type and subtype
  - Make/manufacturer
  - Model number
  - Serial number
  - Installation date
  - Warranty expiration
  - Expected lifespan
  - Last service date
  - Service interval
  - Location in home
  - Associated documents
  - Notes
- **Acceptance Criteria:**
  - System templates with pre-populated maintenance schedules
  - Custom system types supported
  - Photo attachment capability
  - QR code generation for physical labeling

#### FR-2.2: Component Inventory
- **Description:** Track individual components within systems
- **Examples:**
  - HRV filters (core, pre-filters)
  - Furnace filters
  - Heat trace cables (by zone)
  - Smoke/CO detectors
  - Water filters
  - Anode rods
  - Belts and bearings
- **Fields per Component:**
  - Component name
  - Parent system
  - Part number
  - Replacement interval
  - Last replacement date
  - Quantity installed
  - Supplier/source
  - Cost
- **Acceptance Criteria:**
  - Link components to parent systems
  - Bulk replacement tracking
  - Replacement cost history
  - Low-stock warnings for consumables

#### FR-2.3: Warranty Tracking
- **Description:** Centralized warranty management with expiration alerts
- **Features:**
  - Warranty registration with coverage details
  - Document attachment (receipts, warranty cards)
  - Expiration notifications (90, 60, 30 days before)
  - Claim history logging
  - Manufacturer contact information
- **Acceptance Criteria:**
  - Calendar view of warranty expirations
  - Export warranty information
  - Search warranties by system/component

### 6.3 Maintenance Management

#### FR-3.1: Maintenance Task Library
- **Description:** Pre-built library of northern-specific maintenance tasks
- **Task Categories:**
  - Routine (regular interval maintenance)
  - Seasonal (tied to northern seasons)
  - Reactive (in response to issues)
  - Emergency (critical system failures)
- **Task Attributes:**
  - Task name and description
  - Applicable systems/components
  - Recommended interval
  - Seasonal timing (if applicable)
  - Difficulty level (DIY vs professional)
  - Estimated time
  - Tools required
  - Parts/supplies needed
  - Step-by-step instructions
  - Safety warnings
  - Cost estimate (DIY vs professional)
  - Related tasks
- **Pre-built Northern Tasks (examples):**
  - Heat trace cable inspection and testing
  - HRV core cleaning and balancing
  - Furnace combustion analysis
  - Propane regulator inspection
  - Roof vent snow clearance
  - Foundation pile inspection
  - Water line freeze protection verification
  - Tankless water heater descaling
  - Condensate line freeze prevention
- **Acceptance Criteria:**
  - 100+ pre-built northern-specific tasks at launch
  - Custom task creation supported
  - Task library searchable and filterable
  - Community task sharing (future)

#### FR-3.2: Maintenance Scheduling
- **Description:** Schedule and track maintenance activities
- **Scheduling Options:**
  - One-time tasks
  - Recurring by interval (days, weeks, months, years)
  - Recurring by season (freeze-up, winter, break-up, summer)
  - Recurring by date (annual inspections)
  - Triggered by meter readings (runtime hours, etc.)
- **Task States:**
  - Scheduled
  - Due
  - Overdue
  - In Progress
  - Completed
  - Skipped (with reason)
  - Deferred (rescheduled)
- **Notification Options:**
  - Email notifications
  - Push notifications (PWA)
  - SMS notifications (optional integration)
  - Calendar export (iCal)
- **Acceptance Criteria:**
  - Visual calendar view of scheduled maintenance
  - List view with filtering and sorting
  - Bulk task management
  - Snooze/defer functionality

#### FR-3.3: Maintenance Logging
- **Description:** Record completed maintenance with detailed logging
- **Log Entry Fields:**
  - Date and time
  - Task performed (from library or custom)
  - Systems/components serviced
  - Performed by (self, contractor, other)
  - Service provider (if applicable)
  - Duration
  - Parts used (with costs)
  - Labor cost
  - Total cost
  - Meter readings (before/after)
  - Photos (before/during/after)
  - Notes and observations
  - Issues discovered
  - Follow-up tasks created
- **Acceptance Criteria:**
  - Quick-log option for simple tasks
  - Detailed log option for complex maintenance
  - Photo attachment with annotation
  - Voice note transcription (future)
  - Offline logging with sync

#### FR-3.4: Seasonal Checklists
- **Description:** Pre-built checklists for northern seasonal transitions
- **Seasons:**
  - **Pre-Freeze-Up (September-October)**
    - Drain exterior faucets and hoses
    - Verify heat trace cables operational
    - Inspect pipe insulation
    - Service furnace before heating season
    - Test backup heating systems
    - Stock emergency fuel
    - Verify HRV operation
    - Clean gutters and downspouts
    - Inspect roof for ice dam prevention
    - Test smoke and CO detectors
    - Check weatherstripping
  - **Winter Operations (November-March)**
    - Monitor fuel levels
    - Check for ice dams
    - Clear roof vents of snow
    - Verify heat trace operation during cold snaps
    - HRV filter checks
    - Humidity management
    - Emergency kit verification
  - **Break-Up (April-May)**
    - Foundation drainage inspection
    - Check for frost heave damage
    - Inspect skirting for damage
    - Plan summer maintenance
    - Assess winter damage
  - **Summer (June-August)**
    - Major maintenance projects
    - Foundation work
    - Exterior repairs
    - System upgrades
    - Annual servicing of heating systems
- **Acceptance Criteria:**
  - Checklists tied to approximate local dates
  - Progress tracking
  - Year-over-year comparison
  - Customizable checklists

### 6.4 Service History & Records

#### FR-4.1: Service History Timeline
- **Description:** Comprehensive timeline of all home maintenance and services
- **Views:**
  - Chronological timeline
  - By system/component
  - By service provider
  - By cost
- **Filters:**
  - Date range
  - System category
  - Task type
  - Provider
  - Cost range
- **Acceptance Criteria:**
  - Infinite scroll or pagination for large histories
  - Export to PDF/CSV
  - Search within history
  - Visual cost trends

#### FR-4.2: Document Management
- **Description:** Store and organize home-related documents
- **Document Types:**
  - Manuals and guides
  - Warranties and guarantees
  - Receipts and invoices
  - Inspection reports
  - Permits and certificates
  - Insurance documents
  - Photos and videos
  - Contracts and agreements
- **Features:**
  - File upload with automatic categorization
  - OCR for receipt scanning (future)
  - Link documents to systems/components
  - Version history
  - Tagging and search
- **Acceptance Criteria:**
  - Support for PDF, images, common document formats
  - 10GB storage per home minimum
  - Bulk upload capability
  - Mobile camera integration

#### FR-4.3: Cost Tracking & Analytics
- **Description:** Track and analyze home maintenance costs
- **Metrics:**
  - Total maintenance spend (by period)
  - Cost by system/component
  - Cost by category (parts, labor, DIY supplies)
  - Cost trends over time
  - Projected costs based on scheduled maintenance
  - DIY vs professional cost comparison
- **Reports:**
  - Annual maintenance summary
  - Cost by system breakdown
  - Maintenance history export
  - Tax-relevant expense report
- **Acceptance Criteria:**
  - Dashboard widgets for key metrics
  - Exportable reports
  - Budget setting and tracking
  - Multi-year trend analysis

### 6.5 Reminders & Notifications

#### FR-5.1: Smart Reminders
- **Description:** Intelligent reminder system for maintenance activities
- **Reminder Types:**
  - Scheduled maintenance due
  - Overdue tasks
  - Warranty expirations
  - Seasonal checklist items
  - Supply reorder (consumables)
  - Weather-triggered alerts
- **Delivery Channels:**
  - In-app notifications
  - Email (daily digest or immediate)
  - Push notifications (PWA)
  - SMS (optional, future)
- **Customization:**
  - Notification preferences per category
  - Quiet hours
  - Reminder lead time
  - Snooze duration options
- **Acceptance Criteria:**
  - User-configurable notification preferences
  - No duplicate notifications
  - Timezone-aware scheduling
  - Notification history/log

#### FR-5.2: Weather Integration
- **Description:** Integration with weather services for proactive alerts
- **Features:**
  - Current conditions display
  - Extreme cold warnings (below -30°C, -40°C thresholds)
  - Rapid temperature change alerts
  - Wind chill warnings
  - Blizzard/storm alerts
  - Break-up flooding alerts (spring)
- **Weather-Triggered Maintenance:**
  - "Extreme cold expected - verify heat trace operation"
  - "Rapid warming - check for ice dam conditions"
  - "Extended power outage possible - verify backup heating"
- **Acceptance Criteria:**
  - Integration with Environment Canada weather data
  - Community-specific forecasts where available
  - Customizable alert thresholds
  - Offline caching of recent forecasts

### 6.6 Community Knowledge Base (Wiki)

#### FR-5.3: Wiki Article Creation
- **Description:** Community-driven knowledge base where users can share northern home maintenance expertise, tips, and guides
- **Purpose:** Preserve and share institutional knowledge about northern home maintenance challenges and solutions
- **Article Creation Features:**
  - WYSIWYG rich text editor (TipTap or similar)
  - Photo/image uploads with caption support
  - Video embedding (YouTube, Vimeo)
  - Code snippet formatting (for DIY instructions)
  - Table support for comparisons
  - Bulleted and numbered lists
  - Heading hierarchy
  - Hyperlinks and cross-references to other articles
- **Article Structure:**
  - Title (required)
  - Category/topic tags
  - Article summary/excerpt
  - Main content (rich text)
  - Related systems/components (optional linking)
  - Applicable seasons or conditions
  - Difficulty level
  - Estimated time to read
  - Author attribution
  - Last updated timestamp
- **Photo Management:**
  - Multiple image uploads per article
  - Drag-and-drop image insertion
  - Image gallery support
  - Before/after image comparisons
  - Image annotation tools (arrows, text, highlights)
  - Alt text for accessibility
  - Automatic image optimization
- **Acceptance Criteria:**
  - Intuitive WYSIWYG editor with formatting toolbar
  - Auto-save draft functionality
  - Preview mode before submission
  - Mobile-responsive article creation
  - Image upload limit: 20 images per article, max 5MB each

#### FR-5.4: Article Categories & Topics
- **Pre-defined Categories:**
  - Heating Systems (furnaces, boilers, heat trace)
  - Hot Water Systems
  - HRV/ERV Maintenance
  - Freeze Prevention
  - Seasonal Maintenance (freeze-up, break-up, etc.)
  - Modular Home Specific
  - Emergency Procedures
  - DIY Repairs & Troubleshooting
  - Cost-Saving Tips
  - Product Reviews & Recommendations
  - Community Spotlights (highlighting specific northern communities)
- **Tagging System:**
  - Applicable home types
  - Applicable systems
  - Geographic region (NWT, Nunavut, Yukon, specific communities)
  - Skill level required
  - Season/timing relevance
- **Acceptance Criteria:**
  - Hierarchical category structure
  - Multi-category assignment support
  - Tag autocomplete based on existing tags
  - Minimum 1 category required per article

#### FR-5.5: Admin Review & Publishing Workflow
- **Submission Workflow:**
  1. User creates article and submits for review
  2. Article enters "Pending Review" queue
  3. Admin receives notification of new submission
  4. Admin reviews content for quality, accuracy, appropriateness
  5. Admin can:
     - Approve → Article published to wiki
     - Request revisions → Sent back to author with feedback
     - Reject → Article declined with reason
  6. Published articles visible to all users
- **Admin Review Dashboard:**
  - Queue of pending articles
  - Article preview with metadata
  - Revision history view
  - Author information and contribution history
  - Quick approve/reject/request changes actions
  - Feedback form for revision requests
- **Review Criteria Checklist:**
  - Relevant to northern home maintenance
  - Factually accurate (to best of reviewer knowledge)
  - Clear and well-written
  - Appropriate images/media
  - No spam, promotional content, or inappropriate material
  - Safety information is accurate
  - Proper attribution if citing sources
- **Article States:**
  - Draft (author working, not submitted)
  - Pending Review (submitted, awaiting admin review)
  - Revisions Requested (sent back to author)
  - Approved/Published (live on wiki)
  - Rejected (declined with reason)
  - Archived (previously published, now outdated/removed)
- **Admin Capabilities:**
  - Edit articles post-publication (with change tracking)
  - Add editorial notes/warnings
  - Feature articles on homepage
  - Pin important articles to top of categories
  - Archive outdated content
  - Ban repeat spam submitters
- **Acceptance Criteria:**
  - Clear status indicators for authors
  - Email notifications at each workflow stage
  - Target review time: 48-72 hours for submissions
  - Revision request includes specific feedback
  - Published date and last updated date both tracked

#### FR-5.6: Wiki Discovery & Search
- **Discovery Features:**
  - Featured articles carousel
  - Most popular articles (by views)
  - Recently published articles
  - Trending articles (recent view spike)
  - Related articles recommendations
  - Articles by category browse
  - Articles by tag browse
  - Community contributor profiles
- **Search Functionality:**
  - Full-text search across article titles and content
  - Filter by category
  - Filter by tags
  - Filter by difficulty level
  - Filter by applicable season
  - Sort by relevance, date, popularity, rating
- **Article Display:**
  - Reading time estimate
  - View count
  - Helpful rating system
  - Comment/discussion section (optional, future)
  - Share functionality
  - Print-friendly view
  - Bookmark/save to personal library
- **Acceptance Criteria:**
  - Search results returned in under 1 second
  - Mobile-optimized reading experience
  - Breadcrumb navigation
  - Table of contents for long articles

#### FR-5.7: Community Engagement & Quality
- **Helpful Rating System:**
  - Users can mark articles as "Helpful" or "Not Helpful"
  - Helpful percentage displayed on articles
  - Influences search ranking
  - Threshold for admin review if consistently marked unhelpful
- **User Contributions Tracking:**
  - Author profile page with published articles
  - Contribution count and badges
  - Community reputation system
  - "Trusted Contributor" badge after X approved articles
- **Article Updates:**
  - Original authors can submit updates to their published articles
  - Updates go through review process
  - Version history maintained
  - Change log visible to readers
- **Quality Controls:**
  - Duplicate article detection
  - Plagiarism checking (basic keyword matching)
  - User reporting for inappropriate content
  - Admin moderation tools
- **Acceptance Criteria:**
  - Author can see all their submissions (all states)
  - Clear attribution on all articles
  - Transparent update history
  - Reporting mechanism with 24-hour response SLA

#### FR-5.8: Wiki Integration with Maintenance System
- **Smart Linking:**
  - Wiki articles can be linked to specific maintenance tasks
  - "Learn More" links from task library to relevant wiki articles
  - Suggested articles based on user's home systems
  - In-context article recommendations (e.g., "How to Clean Your HRV Core" when HRV service is due)
- **Article Suggestions:**
  - When logging maintenance, suggest related articles
  - When adding new system, suggest setup/maintenance articles
  - Seasonal checklist items link to how-to guides
- **Acceptance Criteria:**
  - Contextual article suggestions appear at relevant points
  - Users can navigate between maintenance tasks and wiki seamlessly
  - Wiki articles reference specific maintenance task IDs when applicable

---

## 7. Northern-Specific Features

### 7.1 Heating System Management

#### FR-6.1.1: Furnace/Boiler Tracking
- **Supported Types:**
  - Forced-air furnace (natural gas, propane, oil)
  - Boiler systems (hydronic, steam)
  - Electric baseboards
  - In-floor heating
  - Wood/pellet stoves
  - Combination systems
- **Tracking Features:**
  - Runtime hours (if accessible)
  - Service history
  - Combustion efficiency records
  - Filter change tracking
  - Ignitor/flame sensor maintenance
  - Heat exchanger inspection records
  - Blower motor service
  - Annual efficiency testing
- **Alerts:**
  - Service overdue
  - Unusual runtime patterns
  - Pre-season service reminder

#### FR-6.1.2: Fuel Level Tracking
- **Supported Fuel Types:**
  - Propane
  - Heating oil
  - Wood/pellet inventory
- **Features:**
  - Manual level entry
  - Consumption tracking
  - Estimated days remaining
  - Reorder point alerts
  - Delivery scheduling
  - Price per unit tracking
  - Annual consumption analysis
- **Integration (Future):**
  - Tank monitor devices
  - Supplier delivery notifications

#### FR-6.1.3: Backup Heating Systems
- **Purpose:** Track secondary/emergency heating
- **Systems:**
  - Portable heaters
  - Generator-powered heating
  - Wood stoves
  - Propane wall heaters
- **Tracking:**
  - Operational verification schedule
  - Fuel storage for emergency
  - Last test date
  - Location in home

### 7.2 Hot Water System Management

#### FR-6.2.1: Tankless/On-Demand Systems
- **Specific Maintenance:**
  - Descaling schedule (critical in hard water areas)
  - Filter cleaning
  - Freeze protection verification
  - Error code logging
  - Flow rate monitoring
  - Inlet filter inspection
  - Venting inspection
- **Freeze Protection:**
  - Heat trace on supply lines
  - Recirculation system maintenance
  - Freeze protection valve testing
  - Exterior venting protection

#### FR-6.2.2: Tank Water Heaters
- **Maintenance Tracking:**
  - Anode rod inspection/replacement
  - Tank flushing schedule
  - T&P valve testing
  - Element replacement (electric)
  - Thermostat calibration
  - Insulation inspection

### 7.3 HRV/ERV Management

#### FR-6.3.1: HRV System Tracking
- **Specific Features:**
  - Core cleaning schedule (typically quarterly)
  - Pre-filter replacement tracking
  - Balancing records
  - Condensate drain maintenance
  - Defrost cycle monitoring
  - Duct cleaning schedule
  - Control calibration
- **Seasonal Adjustments:**
  - Summer bypass mode reminders
  - Winter humidity targets
  - Recirculation mode guidance
- **Performance Tracking:**
  - Efficiency testing records
  - Airflow measurements
  - Static pressure readings

### 7.4 Freeze Protection Management

#### FR-6.4.1: Heat Trace Cable System
- **Tracking Features:**
  - Zone mapping (which cables protect which pipes)
  - Wattage per zone
  - Circuit breaker assignments
  - Installation date and warranty
  - Inspection schedule
- **Maintenance Tasks:**
  - Pre-season continuity testing
  - Visual inspection for damage
  - Thermostat/sensor verification
  - End seal inspection
  - Power consumption monitoring
- **Alerts:**
  - Extreme cold - verify operation
  - Annual inspection due
  - Warranty expiration

#### FR-6.4.2: Pipe Insulation Tracking
- **Features:**
  - Location mapping of insulated pipes
  - Insulation type and R-value
  - Inspection schedule
  - Damage/degradation logging
  - Roof penetration insulation

#### FR-6.4.3: Freeze Event Logging
- **Purpose:** Track and learn from freeze events
- **Log Fields:**
  - Date and conditions
  - Location of freeze
  - Damage assessment
  - Root cause analysis
  - Remediation performed
  - Prevention measures added
- **Analytics:**
  - Freeze event history
  - Vulnerable location identification
  - Cost of freeze damage over time

### 7.5 Modular Home Specific Features

#### FR-6.5.1: Modular Home Profile
- **Additional Fields:**
  - Manufacturer
  - Model/floor plan
  - Transport date (if different from install)
  - Setup contractor
  - Marriage wall locations (multi-section)
  - CSA certification number
- **Specific Maintenance:**
  - Marriage wall sealing inspection
  - Roof cap/marriage wall flashing
  - Skirting inspection and ventilation
  - Foundation pile inspection
  - Leveling verification
  - Axle/tongue removal verification
  - Belly board inspection

#### FR-6.5.2: Foundation Pile Tracking
- **Features:**
  - Number and location of piles
  - Pile type (wood, steel, concrete)
  - Installation depth
  - Frost heave monitoring
  - Releveling history
  - Pile cap condition

### 7.6 Emergency Preparedness

#### FR-6.6.1: Emergency Checklist
- **Categories:**
  - Heating system failure protocol
  - Power outage response
  - Water system freeze response
  - Evacuation planning
  - Emergency contacts
- **Supplies Tracking:**
  - Backup fuel quantities
  - Emergency water supply
  - Food supplies
  - Batteries and lighting
  - First aid supplies
  - Communication devices

#### FR-6.6.2: Emergency Response Guides
- **Scenario-Based Guides:**
  - "What to do when your furnace fails at -40°C"
  - "Emergency pipe freeze response"
  - "Power outage lasting 24+ hours"
  - "Carbon monoxide alarm response"
  - "No-heat emergency contacts"
- **Printable Versions:**
  - Quick reference cards
  - Emergency contact sheet
  - System shutdown procedures

---

## 8. Service Provider Directory

### 8.1 Provider Listings

#### FR-7.1.1: Provider Registration
- **Provider Types:**
  - Plumbers
  - Electricians
  - HVAC technicians
  - General contractors
  - Appliance repair
  - Propane/oil suppliers
  - Chimney services
  - Foundation specialists
  - Modular home specialists
  - Emergency services
- **Profile Fields:**
  - Business name
  - Contact information
  - Service areas (communities served)
  - Services offered
  - Certifications and licenses
  - Insurance verification
  - Years in business
  - Business hours
  - Emergency availability
  - Payment methods accepted
  - Website and social media
- **Verification Levels:**
  - Unverified (user-submitted)
  - Contact verified
  - License verified
  - Community endorsed

#### FR-7.1.2: Service Area Definition
- **Northern-Specific:**
  - Community-based service areas
  - Fly-in vs drive-in distinction
  - Seasonal accessibility notes
  - Travel charges/policies
- **Map Visualization:**
  - Service area overlay
  - Provider location markers
  - Community coverage gaps

### 8.2 Reviews & Ratings

#### FR-7.2.1: Review System
- **Review Fields:**
  - Overall rating (1-5 stars)
  - Work quality rating
  - Professionalism rating
  - Value rating
  - Would recommend (yes/no)
  - Service performed
  - Written review
  - Photos (optional)
- **Review Features:**
  - Verified customer badge
  - Provider response capability
  - Review filtering and sorting
  - Helpful vote system

#### FR-7.2.2: Community Endorsements
- **Purpose:** Recognize trusted providers in small communities
- **Features:**
  - Community member vouching
  - Long-standing relationship recognition
  - Local expertise badges

### 8.3 Search & Discovery

#### FR-7.3.1: Provider Search
- **Search Criteria:**
  - Service type needed
  - Location/community
  - Availability (emergency, same-day, scheduled)
  - Rating threshold
  - Specific certifications
- **Results Display:**
  - Distance/travel considerations
  - Availability indicator
  - Rating summary
  - Recent reviews preview
  - Quick contact options

#### FR-7.3.2: Emergency Provider Quick Access
- **Features:**
  - Pre-saved emergency contacts
  - One-tap calling
  - After-hours availability filter
  - Recently used providers

---

## 9. Technical Architecture

### 9.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  Progressive Web App (PWA)                                      │
│  - React.js Frontend                                            │
│  - Service Worker for Offline                                   │
│  - IndexedDB for Local Storage                                  │
│  - Push Notifications                                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  Node.js/Express REST API                                       │
│  - Authentication (JWT)                                         │
│  - Rate Limiting                                                │
│  - Request Validation                                           │
│  - File Upload Handling                                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Services                                        │
│  - Home Management Service                                      │
│  - Maintenance Service                                          │
│  - Notification Service                                         │
│  - Provider Directory Service                                   │
│  - Weather Integration Service                                  │
│  - Document Service                                             │
│  - Analytics Service                                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Database                                               │
│  - Document Storage                                             │
│  - Full-text Search                                             │
│  - Geospatial Queries                                           │
│  Redis Cache                                                    │
│  - Session Storage                                              │
│  - API Response Caching                                         │
│  MinIO Object Storage                                           │
│  - File/Document Storage                                        │
│  - Image Storage                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Technology Stack

#### 8.2.1 Frontend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | React 18+ | Component-based, large ecosystem |
| State Management | Zustand or Redux Toolkit | Lightweight, developer-friendly |
| UI Components | Tailwind CSS + shadcn/ui | Rapid development, customizable |
| Forms | React Hook Form + Zod | Type-safe validation |
| Data Fetching | TanStack Query | Caching, offline support |
| PWA | Workbox | Service worker management |
| Charts | Recharts | React-native charting |
| Calendar | react-big-calendar | Maintenance scheduling |

#### 8.2.2 Backend
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Node.js 20 LTS | JavaScript ecosystem, async I/O |
| Framework | Express.js or Fastify | Mature, well-documented |
| API Style | REST with OpenAPI spec | Standard, tooling support |
| Authentication | Passport.js + JWT | Flexible auth strategies |
| Validation | Zod | Shared with frontend |
| File Upload | Multer + Sharp | Image processing |
| Job Queue | BullMQ | Background tasks, scheduling |
| Email | Nodemailer | Notification delivery |

#### 8.2.3 Database & Storage
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Primary Database | MongoDB 7+ | Document flexibility, geospatial |
| ODM | Mongoose | Schema validation, middleware |
| Cache | Redis 7+ | Session, caching, job queue |
| Object Storage | MinIO | S3-compatible, self-hosted |
| Search | MongoDB Atlas Search or Meilisearch | Full-text search |

#### 8.2.4 Infrastructure
| Component | Technology | Rationale |
|-----------|------------|-----------|
| Containerization | Docker | Consistent deployment |
| Orchestration | Docker Compose | Simple multi-container |
| Deployment | Dokploy | Self-hosted PaaS |
| Reverse Proxy | Traefik or Caddy | Auto HTTPS, routing |
| Monitoring | Uptime Kuma | Self-hosted monitoring |
| Logging | Loki + Grafana | Log aggregation |

### 9.3 API Design

#### 8.3.1 API Structure
```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   └── POST /forgot-password
├── /users
│   ├── GET /me
│   ├── PATCH /me
│   └── DELETE /me
├── /homes
│   ├── GET /
│   ├── POST /
│   ├── GET /:homeId
│   ├── PATCH /:homeId
│   ├── DELETE /:homeId
│   └── /systems
│       ├── GET /
│       ├── POST /
│       ├── GET /:systemId
│       ├── PATCH /:systemId
│       └── DELETE /:systemId
├── /maintenance
│   ├── /tasks
│   │   ├── GET /library
│   │   ├── GET /scheduled
│   │   ├── POST /
│   │   ├── PATCH /:taskId
│   │   └── DELETE /:taskId
│   ├── /logs
│   │   ├── GET /
│   │   ├── POST /
│   │   └── GET /:logId
│   └── /checklists
│       ├── GET /seasonal
│       └── PATCH /:checklistId
├── /documents
│   ├── GET /
│   ├── POST /upload
│   ├── GET /:documentId
│   └── DELETE /:documentId
├── /providers
│   ├── GET /search
│   ├── GET /:providerId
│   ├── POST /:providerId/reviews
│   └── GET /emergency
├── /weather
│   ├── GET /current
│   └── GET /alerts
├── /reports
│   ├── GET /maintenance-summary
│   └── GET /cost-analysis
└── /wiki
    ├── /articles
    │   ├── GET / (public, published articles)
    │   ├── GET /featured
    │   ├── GET /trending
    │   ├── GET /search
    │   ├── GET /category/:category
    │   ├── GET /tag/:tag
    │   ├── GET /:slug (public article view)
    │   ├── POST / (create draft)
    │   ├── PATCH /:articleId (update draft/article)
    │   ├── DELETE /:articleId
    │   ├── POST /:articleId/submit (submit for review)
    │   ├── POST /:articleId/helpful (mark as helpful)
    │   ├── POST /:articleId/bookmark
    │   └── GET /my-articles (user's own articles)
    ├── /admin
    │   ├── GET /pending-review (admin only)
    │   ├── POST /:articleId/approve (admin only)
    │   ├── POST /:articleId/request-revisions (admin only)
    │   ├── POST /:articleId/reject (admin only)
    │   ├── PATCH /:articleId/feature (admin only)
    │   ├── PATCH /:articleId/pin (admin only)
    │   └── PATCH /:articleId/archive (admin only)
    └── /categories
        └── GET / (list all categories)
```

### 9.4 Offline-First Architecture

#### 8.4.1 Offline Capabilities
- **Data Sync:** Background sync when connectivity restored
- **Local Storage:** IndexedDB for structured data, Cache API for assets
- **Conflict Resolution:** Last-write-wins with user notification
- **Queued Actions:** Offline mutations queued for sync
- **Essential Data:** Core maintenance schedules cached locally

#### 8.4.2 Service Worker Strategy
```javascript
// Cache strategies by resource type
{
  'api-responses': 'NetworkFirst',      // API calls
  'static-assets': 'CacheFirst',        // JS, CSS, images
  'documents': 'CacheFirst',            // User documents
  'weather': 'NetworkOnly',             // Always fresh
  'maintenance-library': 'StaleWhileRevalidate',
  'wiki-articles': 'StaleWhileRevalidate' // Wiki content
}
```

---

## 10. Data Models

### 10.1 Core Collections

#### 9.1.1 User
```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    community: String,
    timezone: String,
    preferredUnits: 'metric' | 'imperial'
  },
  preferences: {
    notifications: {
      email: Boolean,
      push: Boolean,
      digestFrequency: 'daily' | 'weekly' | 'none'
    },
    defaultHome: ObjectId
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### 9.1.2 Home
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  address: {
    street: String,
    community: String,
    territory: String,
    postalCode: String,
    coordinates: {
      type: 'Point',
      coordinates: [Number, Number] // [lng, lat]
    }
  },
  details: {
    homeType: 'modular' | 'stick-built' | 'log' | 'mobile' | 'other',
    yearBuilt: Number,
    squareFootage: Number,
    bedrooms: Number,
    bathrooms: Number,
    foundationType: 'piles' | 'crawlspace' | 'basement' | 'slab',
    stories: Number
  },
  utilities: {
    waterSource: 'municipal' | 'well' | 'trucked',
    sewageSystem: 'municipal' | 'septic' | 'holding-tank',
    electricalService: 'grid' | 'generator' | 'hybrid',
    primaryHeatFuel: 'propane' | 'oil' | 'electric' | 'wood' | 'natural-gas',
    secondaryHeatFuel: String
  },
  modularInfo: {
    manufacturer: String,
    model: String,
    serialNumber: String,
    csaCertification: String,
    sections: Number,
    transportDate: Date,
    setupContractor: String
  },
  coverPhoto: String, // URL to MinIO
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.3 System
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  category: String, // 'heating', 'hot-water', 'ventilation', etc.
  type: String, // 'furnace', 'boiler', 'hrv', etc.
  subtype: String,
  details: {
    make: String,
    model: String,
    serialNumber: String,
    capacity: String,
    efficiency: String
  },
  installation: {
    date: Date,
    contractor: String,
    cost: Number
  },
  warranty: {
    provider: String,
    startDate: Date,
    endDate: Date,
    coverageDetails: String,
    documentIds: [ObjectId]
  },
  maintenance: {
    defaultIntervalDays: Number,
    lastServiceDate: Date,
    nextServiceDue: Date,
    serviceHistory: [ObjectId] // MaintenanceLog references
  },
  location: String, // Where in the home
  notes: String,
  photos: [String], // URLs to MinIO
  status: 'active' | 'inactive' | 'replaced',
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.4 Component
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  systemId: ObjectId,
  name: String,
  type: String, // 'filter', 'anode-rod', 'heat-trace-zone', etc.
  details: {
    partNumber: String,
    manufacturer: String,
    specifications: Object // Flexible for different component types
  },
  replacement: {
    intervalDays: Number,
    lastReplaced: Date,
    nextDue: Date,
    estimatedCost: Number
  },
  supplier: {
    name: String,
    partNumber: String,
    url: String
  },
  quantity: Number,
  location: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.5 MaintenanceTask (Library)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: 'routine' | 'seasonal' | 'reactive' | 'emergency',
  applicableSystems: [String], // System categories
  applicableHomeTypes: [String],
  scheduling: {
    intervalDays: Number,
    seasonal: {
      applicable: Boolean,
      seasons: ['pre-freeze-up', 'winter', 'break-up', 'summer']
    },
    triggerConditions: [String] // e.g., 'temperature below -30'
  },
  execution: {
    difficultyLevel: 'diy-easy' | 'diy-moderate' | 'professional',
    estimatedMinutes: Number,
    toolsRequired: [String],
    suppliesRequired: [String],
    instructions: [String], // Step-by-step
    safetyWarnings: [String],
    videoUrl: String
  },
  cost: {
    diyEstimate: Number,
    professionalEstimate: Number
  },
  relatedTasks: [ObjectId],
  isBuiltIn: Boolean, // System-provided vs user-created
  createdBy: ObjectId, // null for built-in
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.6 ScheduledMaintenance
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  systemId: ObjectId,
  componentId: ObjectId,
  taskId: ObjectId, // Reference to MaintenanceTask
  customTaskName: String, // If not using library task
  scheduling: {
    dueDate: Date,
    recurrence: {
      type: 'none' | 'interval' | 'seasonal' | 'annual',
      intervalDays: Number,
      season: String,
      dayOfYear: { month: Number, day: Number }
    }
  },
  status: 'scheduled' | 'due' | 'overdue' | 'in-progress' | 'completed' | 'skipped' | 'deferred',
  priority: 'low' | 'medium' | 'high' | 'critical',
  assignedTo: 'self' | 'provider',
  providerId: ObjectId,
  reminders: [{
    type: 'email' | 'push',
    daysBefore: Number,
    sent: Boolean,
    sentAt: Date
  }],
  completedAt: Date,
  completedLogId: ObjectId,
  skippedReason: String,
  deferredTo: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.7 MaintenanceLog
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  systemId: ObjectId,
  componentId: ObjectId,
  scheduledMaintenanceId: ObjectId,
  taskPerformed: {
    taskId: ObjectId,
    customDescription: String
  },
  execution: {
    date: Date,
    performedBy: 'self' | 'provider' | 'other',
    providerId: ObjectId,
    providerName: String,
    duration: Number // minutes
  },
  costs: {
    parts: [{
      description: String,
      partNumber: String,
      quantity: Number,
      unitCost: Number,
      totalCost: Number
    }],
    labor: Number,
    other: [{
      description: String,
      amount: Number
    }],
    totalCost: Number
  },
  readings: {
    before: Object, // Flexible for different reading types
    after: Object
  },
  photos: [{
    url: String,
    caption: String,
    stage: 'before' | 'during' | 'after'
  }],
  notes: String,
  issuesDiscovered: [String],
  followUpTasks: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.8 Document
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  systemId: ObjectId, // Optional association
  componentId: ObjectId, // Optional association
  type: 'manual' | 'warranty' | 'receipt' | 'inspection' | 'permit' | 'insurance' | 'photo' | 'other',
  name: String,
  description: String,
  file: {
    originalName: String,
    mimeType: String,
    size: Number,
    storageKey: String, // MinIO key
    url: String
  },
  metadata: {
    vendor: String,
    purchaseDate: Date,
    expirationDate: Date,
    amount: Number
  },
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.9 ServiceProvider
```javascript
{
  _id: ObjectId,
  businessName: String,
  contact: {
    phone: String,
    email: String,
    website: String,
    address: String
  },
  serviceTypes: [String], // 'plumbing', 'electrical', 'hvac', etc.
  serviceAreas: [{
    community: String,
    travelType: 'local' | 'drive-in' | 'fly-in',
    travelCharges: String,
    seasonalAccess: String
  }],
  business: {
    yearsInBusiness: Number,
    certifications: [String],
    insuranceVerified: Boolean,
    licenseNumber: String
  },
  availability: {
    businessHours: String,
    emergencyAvailable: Boolean,
    emergencyPhone: String
  },
  verification: {
    level: 'unverified' | 'contact-verified' | 'license-verified' | 'community-endorsed',
    verifiedAt: Date,
    verifiedBy: String
  },
  ratings: {
    overall: Number,
    count: Number,
    breakdown: {
      quality: Number,
      professionalism: Number,
      value: Number
    }
  },
  claimedBy: ObjectId, // User who owns this listing
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.10 Review
```javascript
{
  _id: ObjectId,
  providerId: ObjectId,
  userId: ObjectId,
  homeId: ObjectId,
  ratings: {
    overall: Number,
    quality: Number,
    professionalism: Number,
    value: Number
  },
  content: {
    servicePerformed: String,
    review: String,
    wouldRecommend: Boolean
  },
  photos: [String],
  verification: {
    isVerified: Boolean,
    maintenanceLogId: ObjectId
  },
  response: {
    content: String,
    respondedAt: Date
  },
  helpful: {
    count: Number,
    userIds: [ObjectId]
  },
  status: 'published' | 'hidden' | 'flagged',
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.11 SeasonalChecklist
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  season: 'pre-freeze-up' | 'winter' | 'break-up' | 'summer',
  year: Number,
  items: [{
    taskId: ObjectId,
    customDescription: String,
    status: 'pending' | 'completed' | 'skipped' | 'not-applicable',
    completedAt: Date,
    notes: String
  }],
  startDate: Date,
  targetEndDate: Date,
  completedAt: Date,
  progress: Number, // Percentage
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.12 FreezeEvent
```javascript
{
  _id: ObjectId,
  homeId: ObjectId,
  date: Date,
  conditions: {
    temperature: Number,
    windChill: Number,
    duration: String
  },
  location: {
    description: String,
    systemId: ObjectId,
    componentId: ObjectId
  },
  damage: {
    description: String,
    severity: 'minor' | 'moderate' | 'severe',
    repairCost: Number
  },
  rootCause: String,
  remediation: String,
  preventionMeasures: [String],
  photos: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### 9.1.13 WikiArticle
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String, // URL-friendly version of title
  summary: String, // Short excerpt/description
  content: String, // Rich text content (HTML from WYSIWYG)
  contentPlainText: String, // Plain text version for search
  author: {
    userId: ObjectId,
    displayName: String
  },
  categories: [String], // e.g., 'Heating Systems', 'Freeze Prevention'
  tags: [String], // e.g., 'HRV', 'Yellowknife', 'DIY', 'Winter'
  metadata: {
    applicableSystems: [String], // System categories this applies to
    applicableHomeTypes: [String], // Home types this applies to
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced',
    estimatedReadTime: Number, // minutes
    seasons: ['pre-freeze-up', 'winter', 'break-up', 'summer'], // Applicable seasons
    geographicRegion: [String] // NWT, Nunavut, Yukon, specific communities
  },
  images: [{
    url: String,
    caption: String,
    altText: String,
    order: Number
  }],
  relatedArticles: [ObjectId], // References to other wiki articles
  relatedMaintenanceTasks: [ObjectId], // References to MaintenanceTask library items
  status: 'draft' | 'pending-review' | 'revisions-requested' | 'published' | 'rejected' | 'archived',
  reviewInfo: {
    submittedAt: Date,
    reviewedBy: ObjectId, // Admin user
    reviewedAt: Date,
    reviewNotes: String, // Feedback for revisions or rejection
    approvedAt: Date
  },
  engagement: {
    viewCount: Number,
    helpfulCount: Number,
    notHelpfulCount: Number,
    helpfulPercentage: Number,
    bookmarkCount: Number
  },
  featured: Boolean, // Featured on homepage
  pinned: Boolean, // Pinned to top of category
  editorialNote: String, // Admin can add warnings/updates
  versionHistory: [{
    version: Number,
    updatedBy: ObjectId,
    updatedAt: Date,
    changeDescription: String,
    previousContent: String
  }],
  publishedAt: Date,
  lastUpdatedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 10.2 Indexes

```javascript
// Home collection indexes
{ userId: 1 }
{ 'address.community': 1 }
{ 'address.coordinates': '2dsphere' }

// System collection indexes
{ homeId: 1 }
{ homeId: 1, category: 1 }
{ 'warranty.endDate': 1 }

// ScheduledMaintenance indexes
{ homeId: 1, status: 1 }
{ homeId: 1, 'scheduling.dueDate': 1 }
{ status: 1, 'scheduling.dueDate': 1 }

// MaintenanceLog indexes
{ homeId: 1, 'execution.date': -1 }
{ systemId: 1 }
{ providerId: 1 }

// ServiceProvider indexes
{ 'serviceAreas.community': 1 }
{ serviceTypes: 1 }
{ 'ratings.overall': -1 }
{ businessName: 'text' }

// Document indexes
{ homeId: 1 }
{ systemId: 1 }
{ type: 1 }
{ tags: 1 }

// WikiArticle indexes
{ status: 1, publishedAt: -1 }
{ slug: 1 }
{ 'author.userId': 1, status: 1 }
{ categories: 1, status: 1 }
{ tags: 1 }
{ title: 'text', contentPlainText: 'text' } // Full-text search
{ featured: 1, publishedAt: -1 }
{ 'engagement.viewCount': -1 }
{ 'engagement.helpfulPercentage': -1 }
```

---

## 11. User Interface Requirements

### 11.1 Design Philosophy

**"Industrial Reliability"** — A design language that combines the robust dependability of a well-maintained furnace with the precision of critical systems monitoring. This isn't another bland SaaS dashboard. FurnaceLog should feel like a professional maintenance logbook and monitoring station built by people who understand that -40°C means your heating system isn't optional—it's survival.

#### 11.1.1 Design Pillars

| Pillar | Description | Expression |
|--------|-------------|------------|
| **Dependable & Robust** | Like cast iron and steel that won't fail | Strong typography, solid surfaces, industrial color palette, confident hierarchy |
| **Precision & Clarity** | Critical information, clearly displayed | High-contrast data displays, systematic layouts, status indicators, no ambiguity |
| **Engineered & Purposeful** | Every element serves a function | Utilitarian design, technical aesthetics, blueprint-inspired grids, schematic styling |
| **Northern Resilience** | Built for harsh conditions | Industrial materials, warning colors that matter, maintenance-log styling, technical vernacular |

#### 11.1.2 Anti-Patterns (What We Avoid)

- ❌ Soft, playful aesthetics (this is serious equipment)
- ❌ Overly rounded corners and "friendly" styling
- ❌ Decorative illustrations that don't serve function
- ❌ Pastel or muted color schemes
- ❌ Generic SaaS dashboard templates
- ❌ Excessive white space that wastes information density
- ❌ Animations that distract from critical data
- ❌ Minimalism that sacrifices information hierarchy
- ❌ Consumer app styling (this is a professional tool)

### 11.2 Visual Identity

#### 11.2.1 Color System

**Primary Palette — "Boiler Room"**

```
┌─────────────────────────────────────────────────────────────┐
│  CORE COLORS                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Graphite        Steel Gray       Concrete                  │
│  #1A1D23         #2C3440          #E8EAED                   │
│  ████████        ████████         ████████                  │
│  Primary BG      Secondary BG     Light surfaces            │
│                                                             │
│  Iron            Aluminum         Frost White               │
│  #4A5568         #94A3B8          #F8FAFC                   │
│  ████████        ████████         ████████                  │
│  Body text       Secondary text   Cards/Modals              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Accent Palette — "Heat & Function"**

```
┌─────────────────────────────────────────────────────────────┐
│  ACCENT COLORS                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  System Green    Tech Blue        Indicator Purple          │
│  #059669         #0284C7          #7C3AED                   │
│  ████████        ████████         ████████                  │
│  Success/Active  Info/Links       System status             │
│                                                             │
│  Heat Orange     Flame Red        Caution Yellow            │
│  #EA580C         #DC2626          #EAB308                   │
│  ████████        ████████         ████████                  │
│  Warnings/Temp   Critical/Fire    Maintenance due           │
│                                                             │
│  Emergency Red   Ice Blue                                   │
│  #B91C1C         #3B82F6                                    │
│  ████████        ████████                                   │
│  Urgent/Overdue  Cold/Freeze warnings                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Gradient System — "Northern Lights"**

```css
/* Hero gradients - use sparingly for impact */
--gradient-aurora: linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #8B5CF6 100%);
--gradient-night: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
--gradient-frost: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);

/* Interactive state gradients */
--gradient-glow: radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
```

#### 11.2.2 Typography

**Type Scale — Sharp & Technical**

```
Font Stack:
  Headings:    "Space Grotesk", system-ui    (Geometric, technical feel)
  Body:        "Inter", system-ui            (Highly readable, professional)
  Mono:        "JetBrains Mono", monospace   (Data, serial numbers, codes)
  Display:     "Instrument Sans", system-ui  (Large headlines, marketing)

Scale (Desktop):
  Display:     48px / 52px line-height / -0.02em tracking / Bold
  H1:          32px / 40px / -0.01em / Semibold
  H2:          24px / 32px / -0.01em / Semibold
  H3:          20px / 28px / 0 / Medium
  H4:          16px / 24px / 0 / Medium
  Body:        15px / 24px / 0 / Regular
  Small:       13px / 20px / 0.01em / Regular
  Micro:       11px / 16px / 0.02em / Medium (labels, badges)

Scale (Mobile):
  Display:     36px / 40px
  H1:          28px / 36px
  Body:        16px / 26px (larger for touch readability)
```

#### 11.2.3 Iconography

**Custom Icon Style — "Frost Line"**

- **Stroke weight:** 1.5px (crisp, not chunky)
- **Corner radius:** 1px (sharp, not rounded)
- **Style:** Outlined with selective fills for emphasis
- **Grid:** 24x24 base, pixel-aligned

**Custom Icon Set Required:**

```
Home Systems:          Actions:              Status:
🔥 Furnace            ➕ Add                ✓ Complete (animated check)
💧 Water heater       ✏️ Edit               ⚠ Warning (pulse)
❄️ Heat trace         🗑 Delete             🔴 Critical (glow)
🌀 HRV               📷 Photo              ⏰ Scheduled
⛽ Fuel tank          📄 Document           ❄ Freeze alert
🔌 Electrical         🔔 Reminder           
🏠 Structure          📊 Analytics          

Weather:              Navigation:
☀️ Clear              🏠 Dashboard
🌨 Snow               📋 Tasks
🌡 Temperature        📁 Documents
💨 Wind               👥 Providers
⚡ Alert              ⚙️ Settings
```

### 11.3 Component System

#### 11.3.1 Cards — "Elevation System"

Three distinct card levels for visual hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 1: Surface Cards                                     │
│  Background: #FFFFFF                                        │
│  Border: 1px solid #E2E8F0                                  │
│  Shadow: 0 1px 3px rgba(0,0,0,0.04)                        │
│  Border-radius: 8px                                         │
│  Use: List items, table rows, secondary content             │
├─────────────────────────────────────────────────────────────┤
│  LEVEL 2: Elevated Cards                                    │
│  Background: #FFFFFF                                        │
│  Border: 1px solid #E2E8F0                                  │
│  Shadow: 0 4px 12px rgba(0,0,0,0.08)                       │
│  Border-radius: 12px                                        │
│  Use: Primary content blocks, system cards, widgets         │
├─────────────────────────────────────────────────────────────┤
│  LEVEL 3: Floating Cards                                    │
│  Background: #FFFFFF                                        │
│  Border: none                                               │
│  Shadow: 0 12px 40px rgba(0,0,0,0.12)                      │
│  Border-radius: 16px                                        │
│  Use: Modals, dropdowns, popovers, feature spotlights       │
└─────────────────────────────────────────────────────────────┘
```

**Interactive Card States:**

```css
/* Hover - subtle lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-color: #CBD5E1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Active/Selected - aurora accent */
.card.selected {
  border: 2px solid #06B6D4;
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
}

/* Critical/Alert - pulsing border */
.card.critical {
  border: 2px solid #EF4444;
  animation: pulse-critical 2s infinite;
}
```

#### 11.3.2 Buttons — "Action Clarity"

**Primary Actions:**
```
┌──────────────────────────────────────┐
│  ████████████████████████████████    │  Primary Button
│  Background: #06B6D4                 │  - Bold, confident
│  Text: #FFFFFF                       │  - Slight shadow for depth
│  Padding: 12px 24px                  │  - Hover: brighten + lift
│  Border-radius: 8px                  │
│  Font: 14px Semibold                 │
│  Shadow: 0 2px 8px rgba(6,182,212,0.3)
└──────────────────────────────────────┘

Hover State:
  Background: #22D3EE
  Transform: translateY(-1px)
  Shadow: 0 4px 12px rgba(6,182,212,0.4)

Active State:
  Background: #0891B2
  Transform: translateY(0)
  Shadow: 0 1px 4px rgba(6,182,212,0.2)
```

**Secondary Actions:**
```
┌──────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    │  Secondary Button
│  Background: transparent             │  - Clean, professional
│  Border: 1.5px solid #CBD5E1         │  - Hover fills
│  Text: #475569                       │
│  Padding: 12px 24px                  │
└──────────────────────────────────────┘

Hover State:
  Background: #F1F5F9
  Border-color: #94A3B8
  Text: #1E293B
```

**Destructive Actions:**
```
┌──────────────────────────────────────┐
│  Background: #FEF2F2                 │  Destructive Button
│  Border: 1.5px solid #FECACA         │  - Warning appearance
│  Text: #DC2626                       │  - Hover intensifies
└──────────────────────────────────────┘

Hover State:
  Background: #FEE2E2
  Border-color: #F87171
```

**Icon Buttons:**
```
Size: 40x40px (touch-friendly)
Border-radius: 10px
Background: transparent
Hover: Background #F1F5F9, scale(1.05)
Active: Background #E2E8F0, scale(0.98)
```

#### 11.3.3 Form Controls — "Precision Input"

**Text Inputs:**
```css
.input {
  height: 48px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 150ms ease;
}

.input:hover {
  border-color: #CBD5E1;
}

.input:focus {
  border-color: #06B6D4;
  box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.1);
  outline: none;
}

.input.error {
  border-color: #EF4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}
```

**Select Dropdowns:**
```
- Custom styled (no native selects)
- Animated chevron rotation on open
- Smooth height transition for options
- Keyboard navigable with highlighted active option
- Search/filter for long lists
```

**Toggle Switches:**
```
- 48px wide, 28px tall (easy to tap)
- Smooth sliding animation (200ms spring)
- Color transition through aurora gradient when on
- Subtle haptic feedback indication (visual bounce)
```

#### 11.3.4 Data Visualization — "Living Data"

**Progress Indicators:**

```
Seasonal Checklist Progress:
┌─────────────────────────────────────────────────────────────┐
│  Pre-Freeze-Up Checklist                                    │
│                                                             │
│  ████████████████████████░░░░░░░░░░  72%                   │
│                                                             │
│  12 of 17 tasks complete                    [View Tasks →]  │
└─────────────────────────────────────────────────────────────┘

Animation: Progress bar fills with aurora gradient shimmer
           Percentage counter animates up on load
           Confetti burst at 100% completion
```

**System Health Rings:**

```
        ╭───────────╮
       ╱    ████     ╲        Heating System
      │   ██    ██    │       ● 94% Health
      │  ██  ✓   ██   │       Last service: 2 weeks ago
      │   ██    ██    │       Next due: 6 months
       ╲    ████     ╱
        ╰───────────╯

Ring animation: Draws clockwise on load
Color coding: Green (>80%), Yellow (50-80%), Red (<50%)
Interactive: Hover shows breakdown, click for details
```

**Cost Charts:**

```
Monthly Maintenance Spend:
                                          ┌───┐
                              ┌───┐       │   │
                    ┌───┐     │   │ ┌───┐ │   │
          ┌───┐     │   │     │   │ │   │ │   │
    ┌───┐ │   │     │   │ ┌───┤   │ │   │ │   │
────┴───┴─┴───┴─────┴───┴─┴───┴───┴─┴───┴─┴───┴────
    J   F   M   A   M   J   J   A   S   O   N   D

Interaction: Hover reveals tooltip with breakdown
             Click bar to see detailed transactions
             Drag to select range for comparison
Animation:   Bars grow from bottom on scroll-into-view
             Tooltip fades in with slight scale
```

**Temperature Timeline:**

```
Outdoor Temp (Last 7 Days)
  10°C ─┬─────────────────────────────────────────
        │                    ╭─╮
   0°C ─┼────────╭──────────╯  ╰───╮
        │    ╭──╯                   ╰──╮
 -10°C ─┼───╯                          ╰─────────
        │
 -20°C ─┼─────────────────────────────────────────
        Mon   Tue   Wed   Thu   Fri   Sat   Sun

Color: Line transitions blue → cyan → red based on value
       Gradient fill below line
       Threshold lines for alert temperatures
Interaction: Scrub to see exact temp at any point
             Tap day for detailed hourly view
```

### 11.4 Interaction & Motion Design

#### 11.4.1 Motion Principles

| Principle | Implementation |
|-----------|----------------|
| **Purposeful** | Every animation communicates state change or provides feedback |
| **Quick** | Most transitions 150-250ms; never delay the user |
| **Natural** | Use spring physics, not linear easing |
| **Consistent** | Same actions produce same animations throughout |

#### 11.4.2 Core Animations

**Page Transitions:**
```javascript
// Smooth fade + slide for page navigation
const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
};
```

**List Item Stagger:**
```javascript
// Cards/items appear in sequence
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};
```

**Micro-interactions:**

| Element | Interaction | Animation |
|---------|-------------|-----------|
| Checkboxes | Complete task | Check draws in, box briefly scales 1.1x, success color fills |
| Delete | Remove item | Item fades + shrinks, list items slide up smoothly |
| Add | Create item | New item expands from 0 height, fades in |
| Alerts | Appear | Slide down from top with bounce, attention pulse |
| Tooltips | Hover | Fade in with 100ms delay, slight scale from 0.95 |
| Modals | Open | Backdrop fades, modal scales from 0.95 + fades |
| Tabs | Switch | Content crossfades, indicator slides with spring |

**Loading States:**

```
Skeleton Screens (preferred over spinners):
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░  ← Shimmer animation   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░                        │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░                        │
└─────────────────────────────────────────────────────────────┘

Shimmer: Gradient slides left-to-right continuously
         #E2E8F0 → #F1F5F9 → #E2E8F0
```

**Success Celebration:**
```
Task Completion:
1. Checkbox animates check mark drawing (150ms)
2. Brief scale pulse on the row (100ms)
3. If checklist complete: confetti burst from checkbox
4. Row fades to completed state with strikethrough

Seasonal Checklist 100%:
1. Ring completes with aurora gradient
2. Checkmark appears in center
3. Subtle particle burst
4. "Season Ready" badge animates in
```

#### 11.4.3 Gesture Support (Mobile)

| Gesture | Action |
|---------|--------|
| Swipe right on task | Quick complete |
| Swipe left on task | Show actions (defer, skip, delete) |
| Pull down on list | Refresh |
| Long press on item | Multi-select mode |
| Pinch on calendar | Zoom month/week/day views |
| Two-finger swipe | Navigate between homes |

### 11.5 Layout System

#### 11.5.1 Grid Structure

**Desktop (1280px+):**
```
┌──────────────────────────────────────────────────────────────────┐
│  NAV  │                    MAIN CONTENT                          │
│  240px│                    1fr (fluid)                           │
│       │  ┌────────────────────────────────────────────────────┐  │
│  ┌─┐  │  │  Max content width: 1200px                         │  │
│  │ │  │  │  Padding: 32px                                     │  │
│  │ │  │  │  Gap between cards: 24px                           │  │
│  │ │  │  │                                                    │  │
│  │ │  │  │  12-column grid for complex layouts                │  │
│  │ │  │  │                                                    │  │
│  └─┘  │  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Tablet (768px - 1279px):**
```
┌─────────────────────────────────────────────────┐
│  ☰  FurnaceLog              [Home ▼]   👤    │  ← Collapsible nav
├─────────────────────────────────────────────────┤
│                                                 │
│    Content padding: 24px                        │
│    6-column grid                                │
│                                                 │
├─────────────────────────────────────────────────┤
│   🏠   📋   📁   👥   ⚙️                        │  ← Bottom tab bar
└─────────────────────────────────────────────────┘
```

**Mobile (< 768px):**
```
┌─────────────────────────────┐
│  ☰  FurnaceLog       👤   │
├─────────────────────────────┤
│                             │
│  Content padding: 16px      │
│  Single column              │
│  Full-width cards           │
│                             │
├─────────────────────────────┤
│  🏠  📋  ➕  📁  👥         │  ← Bottom nav with FAB
└─────────────────────────────┘
```

#### 11.5.2 Navigation — "Command Center"

**Desktop Sidebar:**

```
┌────────────────────────────┐
│                            │
│   ◆ NORTHERNNEST          │  ← Logo + wordmark
│                            │
│   ┌──────────────────────┐ │
│   │ 🏠 123 Willow Lane ▼ │ │  ← Home selector (dropdown)
│   └──────────────────────┘ │
│                            │
├────────────────────────────┤
│                            │
│   ● Dashboard              │  ← Active state: filled bg
│   ○ Maintenance            │    + accent left border
│   ○ Systems                │
│   ○ Documents              │
│   ○ Providers              │
│                            │
├────────────────────────────┤
│   QUICK ACTIONS            │  ← Section label
│                            │
│   ○ Log Maintenance        │
│   ○ Add Task               │
│   ○ Upload Document        │
│                            │
├────────────────────────────┤
│                            │
│   ⚠️ 3 tasks overdue       │  ← Contextual alert
│                            │
├────────────────────────────┤
│                            │
│   ⚙️ Settings              │
│   ❓ Help                  │
│                            │
│   ┌──────────────────────┐ │
│   │ 👤 Charles           │ │  ← User menu
│   │    charles@email.com │ │
│   └──────────────────────┘ │
│                            │
└────────────────────────────┘
```

**Mobile Bottom Navigation:**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│    🏠        📋        ╋        📁        👥    │
│   Home     Tasks    Add     Docs   Providers   │
│    ●                                           │  ← Active indicator dot
└─────────────────────────────────────────────────┘

Center "Add" button: 
  - Larger (56px), elevated
  - Aurora gradient background
  - Opens radial action menu:
    ┌─────────┐
    │ + Task  │
    │ + Log   │  (options fan out from center)
    │ + Doc   │
    └─────────┘
```

### 11.6 Key Screen Designs

#### 11.6.1 Dashboard — "Mission Control"

```
┌────────────────────────────────────────────────────────────────────────┐
│  ◆ NORTHERNNEST                                                        │
│  ────────────────                                                      │
│  🏠 123 Willow Lane ▼           Friday, January 2, 2026                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │           WEATHER ALERT: Extreme Cold Warning                   │   │
│  │           -42°C expected tonight. Verify heat trace operation.  │   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌──────────────────────┐  ┌──────────────────────┐                   │
│  │                      │  │                      │                   │
│  │    ╭───────────╮     │  │   MAINTENANCE DUE    │                   │
│  │   ╱    ████     ╲    │  │                      │                   │
│  │  │   ██    ██    │   │  │   🔴 3 Overdue       │                   │
│  │  │  ██  ✓   ██   │   │  │   🟡 5 This Week     │                   │
│  │  │   ██    ██    │   │  │   🟢 8 Upcoming      │                   │
│  │   ╲    ████     ╱    │  │                      │                   │
│  │    ╰───────────╯     │  │   [View All Tasks →] │                   │
│  │                      │  │                      │                   │
│  │   Home Health: 87%   │  └──────────────────────┘                   │
│  │   Great condition    │                                             │
│  │                      │  ┌──────────────────────┐                   │
│  └──────────────────────┘  │                      │                   │
│                            │  PRE-FREEZE CHECKLIST │                   │
│  ┌──────────────────────┐  │                      │                   │
│  │  YELLOWKNIFE         │  │  ████████████████░░░ │                   │
│  │  ─────────────────── │  │        81%           │                   │
│  │                      │  │                      │                   │
│  │    -28°C             │  │  13 of 16 complete   │                   │
│  │    Feels like -38°C  │  │                      │                   │
│  │                      │  │  [Continue →]        │                   │
│  │    ❄️ Snow           │  │                      │                   │
│  │    💨 15 km/h NW     │  └──────────────────────┘                   │
│  │                      │                                             │
│  └──────────────────────┘                                             │
│                                                                        │
│  RECENT ACTIVITY                                         [View All →] │
│  ─────────────────────────────────────────────────────────────────    │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  ✓  Furnace filter replaced                      Today, 2:30 PM│   │
│  │     Heating System • DIY • $45                                 │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  ✓  Heat trace cables tested                     Yesterday     │   │
│  │     Freeze Protection • DIY • All zones operational            │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  ✓  HRV core cleaning                            Dec 28        │   │
│  │     Ventilation • DIY • Quarterly maintenance                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  YOUR SYSTEMS                                            [Manage →]   │
│  ─────────────────────────────────────────────────────────────────    │
│                                                                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  │ 🔥          │ │ 💧          │ │ 🌀          │ │ ❄️          │     │
│  │ Furnace     │ │ Water       │ │ HRV         │ │ Heat Trace  │     │
│  │ ✓ OK        │ │ ✓ OK        │ │ ✓ OK        │ │ ⚠️ Check    │     │
│  │ Due: 6 mo   │ │ Due: 3 mo   │ │ Due: 2 mo   │ │ Due: Now    │     │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### 11.6.2 System Detail — "Deep Dive"

```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Systems                                                    ⚙️  ⋮   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────────────────────┬──────────────────────┐   │
│  │                                         │                      │   │
│  │  ┌─────────────────────────────────┐   │    Rinnai RU199iN    │   │
│  │  │                                 │   │    Tankless Water    │   │
│  │  │                                 │   │    Heater            │   │
│  │  │       [ System Photo ]          │   │                      │   │
│  │  │                                 │   │    Status: ✅ Active  │   │
│  │  │                                 │   │                      │   │
│  │  └─────────────────────────────────┘   │    ┌──────────────┐  │   │
│  │   ○ ○ ○ ●                              │    │ Log Service  │  │   │
│  │                                         │    └──────────────┘  │   │
│  └─────────────────────────────────────────┴──────────────────────┘   │
│                                                                        │
│  ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────┐  │
│  │  LAST SERVICE       │ │  NEXT SERVICE       │ │  WARRANTY       │  │
│  │                     │ │                     │ │                 │  │
│  │  Oct 1, 2026        │ │  Apr 1, 2027        │ │  ⚠️ 2.5 years   │  │
│  │  Annual descaling   │ │  183 days away      │ │  remaining      │  │
│  └─────────────────────┘ └─────────────────────┘ └─────────────────┘  │
│                                                                        │
│  ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│  SPECIFICATIONS                                                        │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Make             Rinnai                                       │   │
│  │  Model            RU199iN                                      │   │
│  │  Serial           RU199-12345678                               │   │
│  │  Capacity         199,000 BTU                                  │   │
│  │  Efficiency       96% UEF                                      │   │
│  │  Install Date     June 15, 2024                                │   │
│  │  Location         Utility Room - North Wall                    │   │
│  │  Fuel             Natural Gas                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  COMPONENTS                                            [+ Add] [Edit] │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🔘 Inlet Filter            Replace every 6 months  Due: Nov 15│   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  🔘 Heat Trace (Supply)     Inspect annually       ✓ OK        │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  🔘 Condensate Neutralizer  Check monthly          Due: Jan 15 │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  MAINTENANCE HISTORY                                    [Export PDF]   │
│                                                                        │
│       $200 ─┬─────────────────────────────────────────               │
│             │              ┌───┐                                      │
│       $150 ─┼──────────────┤   ├──────────────────────               │
│             │    ┌───┐     │   │     ┌───┐                           │
│       $100 ─┼────┤   ├─────┤   ├─────┤   ├───────────               │
│             │    │   │     │   │     │   │                           │
│        $50 ─┼────┤   ├─────┤   ├─────┤   ├───────────               │
│             │    └───┘     └───┘     └───┘                           │
│         $0 ─┴────────────────────────────────────────                │
│             2024        2025         2026                            │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Oct 1, 2026    Annual descaling                         $150  │   │
│  │                 Arctic Plumbing • Professional                 │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  Apr 15, 2026   Filter cleaned, freeze protection check   DIY  │   │
│  │                 All systems operational                        │   │
│  ├────────────────────────────────────────────────────────────────┤   │
│  │  Oct 3, 2025    Annual descaling                         $145  │   │
│  │                 Arctic Plumbing • Professional                 │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  DOCUMENTS                                                   [Upload]  │
│                                                                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                           │
│  │ 📄        │ │ 📄        │ │ 📄        │                           │
│  │           │ │           │ │           │                           │
│  │ Manual    │ │ Warranty  │ │ Install   │                           │
│  │           │ │           │ │ Receipt   │                           │
│  └───────────┘ └───────────┘ └───────────┘                           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

#### 11.6.3 Quick Log Modal — "Rapid Entry"

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │              LOG MAINTENANCE                  ✕    │   │
│  │                                                    │   │
│  │  ──────────────────────────────────────────────   │   │
│  │                                                    │   │
│  │  What did you do?                                 │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  🔍 Search or type...                      │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  SUGGESTIONS                                      │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  🔥 Furnace filter change          [+ Add] │   │   │
│  │  │  🌀 HRV core cleaning              [+ Add] │   │   │
│  │  │  ❄️ Heat trace inspection          [+ Add] │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  ──────────────────────────────────────────────   │   │
│  │                                                    │   │
│  │  System                                           │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  Heating System - Furnace              ▼   │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  Date                                             │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  📅 Today, Jan 2, 2026                 ▼   │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  Performed by                                     │   │
│  │  ┌──────────────────┐ ┌──────────────────┐       │   │
│  │  │   ● Me (DIY)     │ │   ○ Professional │       │   │
│  │  └──────────────────┘ └──────────────────┘       │   │
│  │                                                    │   │
│  │  Cost (optional)                                  │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  $                                         │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  ┌─────────────────┐                             │   │
│  │  │  📷 Add Photos  │                             │   │
│  │  └─────────────────┘                             │   │
│  │                                                    │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │                                            │   │   │
│  │  │           ████ Save Log ████               │   │   │
│  │  │                                            │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │  [+ Add more details]                             │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

#### 11.6.4 Provider Directory — "Find Help"

```
┌────────────────────────────────────────────────────────────────────────┐
│  ← Back                          Service Providers                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Search providers...                    📍 Yellowknife  ▼   │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │  All   │ │Plumbing│ │  HVAC  │ │Electric│ │  Fuel  │ │  More  │   │
│  │   ●    │ │        │ │        │ │        │ │        │ │    ▼   │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                                        │
│  ┌─ FEATURED ───────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │  🔧 ARCTIC PLUMBING & HEATING                    ⭐ 4.9     │ │ │
│  │  │      ═══════════════════════════════════════════            │ │ │
│  │  │                                                             │ │ │
│  │  │  ✓ Verified  •  Plumbing, HVAC  •  Yellowknife             │ │ │
│  │  │  "Best in the north - they saved our pipes last winter"     │ │ │
│  │  │                                                             │ │ │
│  │  │  🕐 Open now  •  24/7 Emergency                            │ │ │
│  │  │                                                             │ │ │
│  │  │  ┌──────────────┐  ┌──────────────┐                        │ │ │
│  │  │  │   📞 Call    │  │   View →     │                        │ │ │
│  │  │  └──────────────┘  └──────────────┘                        │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ALL PROVIDERS                                          Sort: Rating ▼ │
│  ─────────────────────────────────────────────────────────────────    │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  ⚡ NORTHERN ELECTRIC                               ⭐ 4.8     │   │
│  │  ✓ Verified  •  Electrical  •  Yellowknife, Behchokǫ̀          │   │
│  │  🕐 Mon-Fri 8am-5pm                                            │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🔥 TERRITORY FURNACE SERVICES                      ⭐ 4.7     │   │
│  │  ✓ Verified  •  HVAC, Furnace  •  Yellowknife                  │   │
│  │  🕐 Mon-Sat 7am-6pm  •  Emergency available                    │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  ⛽ SUPERIOR PROPANE                                 ⭐ 4.5     │   │
│  │  Fuel Delivery  •  NWT-wide                                    │   │
│  │  🕐 Mon-Fri 8am-5pm                                            │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  🔧 DAVE'S PLUMBING                                  ⭐ 4.3     │   │
│  │  Plumbing  •  Yellowknife, Dettah                              │   │
│  │  🕐 Call for availability                                      │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│  [Load More...]                                                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 11.7 Dark Mode

Full dark mode support — essential for long northern winter nights.

```
┌─────────────────────────────────────────────────────────────┐
│  DARK MODE PALETTE                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Background:      #0F172A (Midnight)                        │
│  Surface:         #1E293B (Deep North)                      │
│  Surface 2:       #334155 (Elevated surfaces)               │
│  Border:          #475569                                   │
│  Text Primary:    #F1F5F9                                   │
│  Text Secondary:  #94A3B8                                   │
│                                                             │
│  Accents remain the same (aurora colors shine on dark)      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Special Dark Mode Adjustments:
- Reduce shadow intensity (shadows less visible on dark)
- Add subtle glow effects on interactive elements
- Aurora gradient overlays become more prominent
- Cards have subtle border instead of shadow
- Success/warning colors slightly desaturated
```

**Auto Dark Mode:**
```javascript
// System preference detection
const prefersDark = window.matchMedia('(prefers-reduced-motion: reduce)');

// Time-based in northern latitudes (winter = mostly dark mode)
const hour = new Date().getHours();
const isWinterDark = (hour < 10 || hour > 15); // Yellowknife winter daylight
```

### 11.8 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile S | 320px | Single column, condensed cards |
| Mobile L | 414px | Single column, full cards |
| Tablet | 768px | Two columns, bottom nav |
| Desktop | 1024px | Sidebar nav, multi-column |
| Desktop L | 1440px | Expanded sidebar, 3+ columns |

### 11.9 Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | All text ≥ 4.5:1, large text ≥ 3:1 |
| Focus indicators | Visible 3px aurora-colored ring on all focusable elements |
| Reduced motion | Respect `prefers-reduced-motion`, provide toggle in settings |
| Screen readers | ARIA labels on all interactive elements, landmarks defined |
| Keyboard nav | Full keyboard navigation, logical tab order, skip links |
| Touch targets | Minimum 44×44px on mobile, 48px recommended |
| Error states | Never rely on color alone—include icons + text |
| Font scaling | Support up to 200% browser zoom without breaking layout |

### 11.10 Implementation Technology

**Recommended Stack:**
- **Animation:** Framer Motion (React) — for complex, physics-based animations
- **Charts:** Recharts with custom aurora theme — data visualization
- **Icons:** Custom "Frost Line" icon set + Lucide as fallback
- **Components:** Radix UI primitives + custom styling (NOT default shadcn)
- **CSS:** Tailwind CSS with extended design tokens
- **State:** Zustand for global state, React Query for server state

**Custom Tailwind Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        midnight: '#0F172A',
        'deep-north': '#1E293B',
        ice: '#F1F5F9',
        aurora: {
          green: '#10B981',
          cyan: '#06B6D4',
          violet: '#8B5CF6',
        },
        ember: '#F97316',
        solar: '#FBBF24',
        boreal: '#22D3EE',
        freeze: '#38BDF8',
      },
      fontFamily: {
        display: ['Instrument Sans', 'system-ui'],
        heading: ['Space Grotesk', 'system-ui'],
        body: ['Inter', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-critical': 'pulse-critical 2s infinite',
        'draw-check': 'draw-check 0.3s ease-out forwards',
      }
    }
  }
}
```

**Performance Targets:**
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Animation Frame Rate | 60fps maintained |
| Total Blocking Time | < 200ms |
| Time to Interactive | < 3s on 3G |

---

## 12. Non-Functional Requirements

### 12.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 3 seconds | Time to interactive on 3G |
| API Response | < 500ms | 95th percentile |
| Offline Load | < 1 second | Cached content |
| Search Results | < 1 second | Full-text search |
| Image Load | < 2 seconds | Optimized thumbnails |

### 12.2 Scalability

- **Users:** Support 1,000+ concurrent users
- **Homes:** Support 10,000+ registered homes
- **Documents:** Handle 1TB+ document storage
- **Data Retention:** Indefinite maintenance history

### 12.3 Reliability

- **Uptime:** 99.5% availability target
- **Backup:** Daily automated backups
- **Recovery:** < 4 hour recovery time objective
- **Data Integrity:** Transaction logging for all mutations

### 12.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios ≥ 4.5:1
- Focus indicators on all interactive elements
- Alt text for all images

### 12.5 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |
| iOS Safari | iOS 14+ |
| Chrome Android | Last 2 versions |

---

## 13. Deployment & Infrastructure

### 13.1 Docker Configuration

#### 12.1.1 Dockerfile (Application)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
```

#### 12.1.2 Docker Compose
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: northernnest-app
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/northernnest
      - REDIS_URL=redis://redis:6379
      - MINIO_ENDPOINT=minio
      - MINIO_PORT=9000
      - MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
      - MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - WEATHER_API_KEY=${WEATHER_API_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - mongo
      - redis
      - minio
    networks:
      - northernnest-network
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:7
    container_name: northernnest-mongo
    restart: unless-stopped
    environment:
      - MONGO_INITDB_DATABASE=northernnest
    volumes:
      - mongo-data:/data/db
      - ./mongo-init:/docker-entrypoint-initdb.d
    networks:
      - northernnest-network

  redis:
    image: redis:7-alpine
    container_name: northernnest-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - northernnest-network

  minio:
    image: minio/minio:latest
    container_name: northernnest-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    volumes:
      - minio-data:/data
    ports:
      - "9001:9001"
    networks:
      - northernnest-network

  # Background job worker
  worker:
    build:
      context: .
      dockerfile: Dockerfile.worker
    container_name: northernnest-worker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/northernnest
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    networks:
      - northernnest-network

networks:
  northernnest-network:
    driver: bridge

volumes:
  mongo-data:
  redis-data:
  minio-data:
```

### 13.2 Dokploy Configuration

#### 12.2.1 Environment Variables
```env
# Application
NODE_ENV=production
APP_URL=https://northernnest.yourdomain.com
JWT_SECRET=<generate-secure-secret>
SESSION_SECRET=<generate-secure-secret>

# MongoDB
MONGODB_URI=mongodb://mongo:27017/northernnest

# Redis
REDIS_URL=redis://redis:6379

# MinIO
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<generate-access-key>
MINIO_SECRET_KEY=<generate-secret-key>
MINIO_BUCKET=northernnest-documents

# Weather API (Environment Canada or alternative)
WEATHER_API_KEY=<your-api-key>

# Email (for notifications)
SMTP_HOST=<smtp-server>
SMTP_PORT=587
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-password>
EMAIL_FROM=noreply@yourdomain.com
```

#### 12.2.2 Deployment Checklist
- [ ] Configure domain and SSL in Dokploy
- [ ] Set up environment variables
- [ ] Initialize MongoDB with indexes
- [ ] Create MinIO buckets
- [ ] Configure backup schedule
- [ ] Set up monitoring alerts
- [ ] Test email notifications
- [ ] Verify weather API integration

### 13.3 Backup Strategy

```yaml
# Backup cron job configuration
backup:
  schedule: "0 2 * * *"  # Daily at 2 AM
  retention: 30  # Keep 30 days
  targets:
    - name: mongodb
      type: mongodump
      destination: /backups/mongo
    - name: minio
      type: mc-mirror
      destination: /backups/minio
    - name: config
      type: file
      source: /app/config
      destination: /backups/config
```

---

## 14. Security Requirements

### 14.1 Authentication & Authorization

| Requirement | Implementation |
|-------------|----------------|
| Password Requirements | Min 12 chars, complexity rules |
| Password Storage | bcrypt with cost factor 12 |
| Session Management | JWT with 15-min access, 7-day refresh |
| MFA Support | TOTP-based (optional for V1) |
| Account Lockout | 5 failed attempts = 15-min lockout |

### 14.2 Data Protection

- All data encrypted at rest (MongoDB encryption)
- All data encrypted in transit (TLS 1.3)
- PII handling compliant with PIPEDA
- Document uploads scanned for malware
- Regular security audits

### 14.3 API Security

- Rate limiting: 100 requests/minute per user
- Input validation on all endpoints
- SQL injection prevention (N/A with MongoDB, but sanitization applied)
- XSS protection via Content Security Policy
- CORS configured for specific origins

### 14.4 Infrastructure Security

- Container images scanned for vulnerabilities
- Non-root container execution
- Network segmentation between services
- Regular dependency updates
- Secrets managed via environment variables (not in code)

---

## 15. Future Considerations

### 15.1 Phase 2 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Mobile Native Apps | iOS and Android apps | High |
| Community Forum | Knowledge sharing between users | High |
| Smart Device Integration | IoT sensors for tanks, temperature | Medium |
| Parts Marketplace | Source hard-to-find northern parts | Medium |
| Insurance Integration | Share maintenance records with insurers | Medium |
| Multi-language | French, Indigenous languages | Medium |
| Housing Authority Dashboard | Fleet management view | High |

### 15.2 Integration Opportunities

- **Fuel Suppliers:** Automated tank monitoring and delivery scheduling
- **Utility Companies:** Energy consumption tracking
- **Insurance Providers:** Maintenance verification for discounts
- **Government Housing Programs:** Compliance reporting
- **Hardware Stores:** Parts availability and ordering

### 15.3 Technical Debt Considerations

- Plan for database sharding as data grows
- Consider GraphQL API for complex queries
- Evaluate microservices architecture for scale
- Implement comprehensive logging and tracing

---

## 16. Success Metrics

### 16.1 Key Performance Indicators (KPIs)

| Metric | Target (Year 1) | Measurement |
|--------|-----------------|-------------|
| Registered Users | 500 | User signups |
| Active Users (Monthly) | 60% of registered | Login activity |
| Homes Tracked | 750 | Home registrations |
| Maintenance Tasks Logged | 10,000 | Log entries |
| Service Provider Listings | 100 | Directory entries |
| User Satisfaction | 4.5/5 | In-app surveys |
| Emergency Incidents Prevented | Qualitative | User feedback |

### 16.2 Usage Analytics

Track and analyze:
- Feature adoption rates
- Task completion rates
- Seasonal checklist completion
- Provider directory usage
- Document upload patterns
- Offline usage frequency

### 16.3 Community Health

- Provider review submission rate
- Knowledge base contributions
- User referrals
- Community feedback themes

---

## 17. Appendices

### Appendix A: Northern Community List

Initial target communities for service provider directory:

**Northwest Territories:**
- Yellowknife
- Hay River
- Inuvik
- Fort Smith
- Behchokǫ̀
- Fort Simpson

**Nunavut:**
- Iqaluit
- Rankin Inlet
- Cambridge Bay
- Arviat
- Baker Lake

**Yukon:**
- Whitehorse
- Dawson City
- Watson Lake

### Appendix B: Maintenance Task Library (Sample)

| Task | System | Interval | Difficulty | Season |
|------|--------|----------|------------|--------|
| Heat trace cable continuity test | Freeze Protection | Annual | DIY | Pre-freeze |
| HRV core cleaning | Ventilation | 3 months | DIY | All |
| Furnace combustion analysis | Heating | Annual | Professional | Pre-freeze |
| Tankless water heater descaling | Hot Water | Annual | DIY/Pro | Summer |
| Propane regulator inspection | Fuel | Annual | Professional | Pre-freeze |
| Foundation pile leveling check | Structure | Annual | Professional | Break-up |
| Smoke detector battery replacement | Safety | 6 months | DIY | All |
| Condensate drain freeze check | Heating/HW | Monthly | DIY | Winter |
| Roof vent snow clearance | Structure | As needed | DIY | Winter |
| Anode rod inspection | Hot Water | 2 years | DIY | Any |

### Appendix C: Glossary

| Term | Definition |
|------|------------|
| Break-up | Spring season when ice melts and ground thaws |
| Freeze-up | Fall season when temperatures drop and water freezes |
| HRV | Heat Recovery Ventilator - exchanges stale indoor air with fresh outdoor air while recovering heat |
| Heat Trace | Electrical cables that provide heat to prevent pipes from freezing |
| Modular Home | Factory-built home transported in sections |
| Marriage Wall | Joint between sections of a modular home |
| Piles | Foundation posts driven into permafrost |
| Skirting | Panels enclosing the space under a raised home |

### Appendix D: Reference Documents

1. CMHC Northern Housing Resources
2. NWT Housing Corporation Maintenance Guides
3. Arctic Energy Alliance Efficiency Guidelines
4. Environment Canada Weather API Documentation
5. MongoDB Best Practices for Document Design

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-02 | Charles | Initial PRD creation |

---

*This document is a living specification and will be updated as requirements evolve through development and user feedback.*
