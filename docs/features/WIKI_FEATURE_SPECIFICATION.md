# Home Maintenance Wiki Feature - Complete Specification

## Overview

A user-generated wiki system that allows FurnaceLog users to create, submit, and browse home maintenance how-to articles. Articles go through an admin approval process before becoming publicly visible.

**Example Use Case:** A user wants to create a wiki article on "How to maintain your on-demand hot water system" with photos and step-by-step instructions.

---

## Table of Contents

1. [Feature Requirements](#feature-requirements)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Frontend Components](#frontend-components)
5. [WYSIWYG Editor Integration](#wysiwyg-editor-integration)
6. [Photo Upload System](#photo-upload-system)
7. [Admin Approval Workflow](#admin-approval-workflow)
8. [Browse & Navigation](#browse--navigation)
9. [Implementation Steps](#implementation-steps)

---

## Feature Requirements

### User Capabilities
- ✅ Create wiki articles using WYSIWYG editor
- ✅ Add photos inline within article content
- ✅ Categorize articles by system type (heating, water, electrical, etc.)
- ✅ Tag articles with keywords for searchability
- ✅ Save drafts before submission
- ✅ Submit articles for admin review
- ✅ Edit own articles (pending approval)
- ✅ View submission status (draft, pending, approved, rejected)

### Admin Capabilities
- ✅ Review submitted articles
- ✅ Approve or reject articles with feedback
- ✅ Edit articles before approval
- ✅ Feature articles on homepage
- ✅ Archive outdated articles
- ✅ Manage article categories

### Public Browse Features
- ✅ Browse articles by category
- ✅ Search articles by keyword/tags
- ✅ View article metadata (author, date, rating)
- ✅ Rate helpful articles (5-star system)
- ✅ Sort by popularity, date, relevance

---

## Database Schema

### 1. wiki_articles Table

**MongoDB Schema:**

```javascript
import mongoose from 'mongoose';

const WikiArticleSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200,
    index: 'text' // Full-text search
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  // Content
  content: {
    type: String, // HTML from WYSIWYG editor
    required: true,
    minlength: 100
  },

  excerpt: {
    type: String, // Auto-generated or manual (first 200 chars)
    maxlength: 300
  },

  // Categorization
  category: {
    type: String,
    required: true,
    enum: [
      'heating',
      'water',
      'sewage',
      'electrical',
      'appliances',
      'specialized-systems',
      'fuel-storage',
      'general-maintenance',
      'seasonal-preparation',
      'emergency-procedures'
    ],
    index: true
  },

  subcategory: {
    type: String,
    // Dynamic based on category
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],

  // Authorship
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  authorName: String, // Denormalized for performance

  // Approval Workflow
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'archived'],
    default: 'draft',
    index: true
  },

  submittedAt: Date,

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  reviewedAt: Date,

  rejectionReason: String,

  adminNotes: String, // Internal notes for admins

  // Media
  coverImage: {
    url: String,
    key: String, // MinIO object key
    alt: String
  },

  images: [{
    url: String,
    key: String,
    alt: String,
    caption: String
  }],

  // Engagement
  viewCount: {
    type: Number,
    default: 0
  },

  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  ratingCount: {
    type: Number,
    default: 0
  },

  // SEO
  metaDescription: String,

  // Features
  isFeatured: {
    type: Boolean,
    default: false
  },

  featuredOrder: Number, // Display order for featured articles

  // Version Control
  version: {
    type: Number,
    default: 1
  },

  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: Date,
    changeDescription: String
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  publishedAt: Date // When approved
}, {
  timestamps: true
});

// Indexes
WikiArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });
WikiArticleSchema.index({ category: 1, status: 1 });
WikiArticleSchema.index({ status: 1, publishedAt: -1 });
WikiArticleSchema.index({ isFeatured: 1, featuredOrder: 1 });
WikiArticleSchema.index({ averageRating: -1, ratingCount: -1 });

// Pre-save hook to generate slug
WikiArticleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Pre-save hook to generate excerpt
WikiArticleSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.excerpt) {
    // Strip HTML and take first 200 chars
    const plainText = this.content.replace(/<[^>]*>/g, '');
    this.excerpt = plainText.substring(0, 200) + '...';
  }
  next();
});

// Calculate average rating
WikiArticleSchema.methods.updateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.ratingCount = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = sum / this.ratings.length;
    this.ratingCount = this.ratings.length;
  }
};

export default mongoose.model('WikiArticle', WikiArticleSchema);
```

### 2. wiki_categories Table (Optional - for dynamic categories)

```javascript
const WikiCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  description: String,

  icon: String, // Icon name or URL

  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WikiCategory'
  },

  articleCount: {
    type: Number,
    default: 0
  },

  sortOrder: Number,

  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('WikiCategory', WikiCategorySchema);
```

---

## API Endpoints

### Public Endpoints (No Auth Required)

#### GET /api/v1/wiki/articles
Get published wiki articles (public browse)

**Query Parameters:**
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated tags
- `search` (optional): Full-text search query
- `sort` (optional): `popular`, `recent`, `rating` (default: `recent`)
- `featured` (optional): `true` to get only featured articles
- `limit` (optional): Results per page (default: 20, max: 100)
- `offset` (optional): Pagination offset

**Response 200:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-uuid",
        "title": "How to Maintain Your On-Demand Hot Water System",
        "slug": "how-to-maintain-on-demand-hot-water-system",
        "excerpt": "Regular maintenance of your tankless water heater ensures optimal performance...",
        "coverImage": {
          "url": "https://minio.../cover.jpg",
          "alt": "Tankless water heater"
        },
        "category": "water",
        "subcategory": "hot-water",
        "tags": ["hot-water", "tankless", "maintenance"],
        "authorName": "John Doe",
        "publishedAt": "2024-01-04T12:00:00Z",
        "viewCount": 245,
        "averageRating": 4.5,
        "ratingCount": 12,
        "isFeatured": false
      }
    ],
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET /api/v1/wiki/articles/:slug
Get specific article by slug

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "title": "How to Maintain Your On-Demand Hot Water System",
      "slug": "how-to-maintain-on-demand-hot-water-system",
      "content": "<h2>Introduction</h2><p>Regular maintenance...</p>",
      "coverImage": { ... },
      "images": [
        {
          "url": "https://minio.../step1.jpg",
          "alt": "Turn off power",
          "caption": "First, turn off the power supply"
        }
      ],
      "category": "water",
      "subcategory": "hot-water",
      "tags": ["hot-water", "tankless", "maintenance"],
      "authorId": "user-uuid",
      "authorName": "John Doe",
      "publishedAt": "2024-01-04T12:00:00Z",
      "viewCount": 246,
      "averageRating": 4.5,
      "ratingCount": 12,
      "version": 1
    }
  }
}
```

#### GET /api/v1/wiki/categories
Get all article categories with counts

**Response 200:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "Heating Systems",
        "slug": "heating",
        "description": "Furnaces, boilers, heat pumps, and more",
        "icon": "fire",
        "articleCount": 24
      },
      {
        "name": "Water Systems",
        "slug": "water",
        "description": "Wells, pumps, hot water heaters",
        "icon": "droplet",
        "articleCount": 18
      }
    ]
  }
}
```

---

### Authenticated User Endpoints

#### POST /api/v1/wiki/articles
Create new wiki article (draft)

**Auth Required:** Yes
**CSRF Required:** Yes

**Request Body:**
```json
{
  "title": "How to Maintain Your On-Demand Hot Water System",
  "content": "<h2>Introduction</h2><p>Content here...</p>",
  "category": "water",
  "subcategory": "hot-water",
  "tags": ["hot-water", "tankless", "maintenance"],
  "coverImage": {
    "url": "https://minio.../cover.jpg",
    "key": "wiki/images/uuid.jpg",
    "alt": "Tankless water heater"
  },
  "images": [
    {
      "url": "https://minio.../step1.jpg",
      "key": "wiki/images/uuid2.jpg",
      "alt": "Turn off power",
      "caption": "First, turn off the power supply"
    }
  ],
  "status": "draft"
}
```

**Validation Rules:**
- `title`: required, 10-200 chars
- `content`: required, min 100 chars
- `category`: required, valid enum
- `tags`: optional, max 10 tags
- `status`: must be 'draft' (can't create as 'approved')

**Response 201:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "title": "How to Maintain Your On-Demand Hot Water System",
      "slug": "how-to-maintain-on-demand-hot-water-system",
      "status": "draft",
      "createdAt": "2024-01-04T12:00:00Z"
    }
  },
  "message": "Article draft created successfully"
}
```

#### PATCH /api/v1/wiki/articles/:id
Update existing article (own articles only)

**Auth Required:** Yes
**CSRF Required:** Yes
**Authorization:** User must be article author OR admin

**Request Body:** (same as POST, partial updates allowed)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": { ... }
  },
  "message": "Article updated successfully"
}
```

#### POST /api/v1/wiki/articles/:id/submit
Submit article for admin review

**Auth Required:** Yes
**CSRF Required:** Yes
**Authorization:** User must be article author

**Request Body:**
```json
{
  "message": "I've completed this article and would like it reviewed for publication."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "status": "pending",
      "submittedAt": "2024-01-04T12:30:00Z"
    }
  },
  "message": "Article submitted for review. You'll be notified when it's reviewed."
}
```

#### POST /api/v1/wiki/articles/:slug/rate
Rate an article (1-5 stars)

**Auth Required:** Yes
**CSRF Required:** Yes

**Request Body:**
```json
{
  "rating": 5
}
```

**Validation Rules:**
- `rating`: required, integer, 1-5
- User can only rate once per article (update if already rated)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "rating": 5,
    "averageRating": 4.6,
    "ratingCount": 13
  },
  "message": "Thank you for rating this article!"
}
```

#### GET /api/v1/wiki/my-articles
Get current user's articles (all statuses)

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status
- `limit`, `offset`: Pagination

**Response 200:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-uuid",
        "title": "How to Maintain Your On-Demand Hot Water System",
        "slug": "...",
        "status": "pending",
        "submittedAt": "2024-01-04T12:30:00Z",
        "viewCount": 0,
        "createdAt": "2024-01-03T10:00:00Z"
      }
    ],
    "total": 3,
    "byStatus": {
      "draft": 1,
      "pending": 1,
      "approved": 1,
      "rejected": 0
    }
  }
}
```

#### DELETE /api/v1/wiki/articles/:id
Delete own article (drafts and rejected only)

**Auth Required:** Yes
**CSRF Required:** Yes
**Authorization:** User must be article author, status must be 'draft' or 'rejected'

**Response 200:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

---

### Admin Endpoints

#### GET /api/v1/admin/wiki/pending
Get all pending articles for review

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`

**Query Parameters:**
- `limit`, `offset`: Pagination

**Response 200:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "article-uuid",
        "title": "How to Maintain Your On-Demand Hot Water System",
        "excerpt": "...",
        "category": "water",
        "authorId": "user-uuid",
        "authorName": "John Doe",
        "submittedAt": "2024-01-04T12:30:00Z",
        "status": "pending"
      }
    ],
    "total": 5
  }
}
```

#### GET /api/v1/admin/wiki/articles/:id
Get article for admin review (full details including admin notes)

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "title": "...",
      "content": "...",
      "category": "water",
      "tags": [...],
      "authorId": "user-uuid",
      "authorName": "John Doe",
      "submittedAt": "2024-01-04T12:30:00Z",
      "status": "pending",
      "adminNotes": "",
      "editHistory": [...]
    }
  }
}
```

#### POST /api/v1/admin/wiki/articles/:id/approve
Approve article for publication

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`
**CSRF Required:** Yes

**Request Body:**
```json
{
  "adminNotes": "Great article, approved!",
  "isFeatured": false
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "status": "approved",
      "publishedAt": "2024-01-04T13:00:00Z",
      "reviewedBy": "admin-uuid",
      "reviewedAt": "2024-01-04T13:00:00Z"
    }
  },
  "message": "Article approved and published"
}
```

**Side Effects:**
- Email notification sent to article author
- Article becomes publicly visible
- Author gains contribution badge (future feature)

#### POST /api/v1/admin/wiki/articles/:id/reject
Reject article with feedback

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`
**CSRF Required:** Yes

**Request Body:**
```json
{
  "rejectionReason": "Please add more detail to the maintenance steps and include safety warnings.",
  "adminNotes": "Good start but needs more work"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "status": "rejected",
      "rejectionReason": "Please add more detail...",
      "reviewedBy": "admin-uuid",
      "reviewedAt": "2024-01-04T13:00:00Z"
    }
  },
  "message": "Article rejected with feedback"
}
```

**Side Effects:**
- Email notification sent to article author with rejection reason
- Author can edit and resubmit

#### PATCH /api/v1/admin/wiki/articles/:id
Admin edit article (any article, any field)

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`
**CSRF Required:** Yes

**Request Body:** (same as user PATCH, but admins can edit any field)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": { ... }
  },
  "message": "Article updated successfully"
}
```

#### PATCH /api/v1/admin/wiki/articles/:id/feature
Feature or unfeature article

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`
**CSRF Required:** Yes

**Request Body:**
```json
{
  "isFeatured": true,
  "featuredOrder": 1
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "article-uuid",
      "isFeatured": true,
      "featuredOrder": 1
    }
  },
  "message": "Article featured successfully"
}
```

#### POST /api/v1/admin/wiki/articles/:id/archive
Archive outdated article

**Auth Required:** Yes
**Role Required:** `admin` or `super-admin`
**CSRF Required:** Yes

**Request Body:**
```json
{
  "reason": "Outdated information, replaced by newer article"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Article archived successfully"
}
```

---

## Frontend Components

### 1. Wiki Browse Page (`/wiki`)

**Component:** `WikiBrowsePage.tsx`

**Features:**
- Category sidebar navigation
- Search bar with autocomplete
- Filter by tags
- Sort options (popular, recent, rating)
- Grid/list view toggle
- Article cards showing:
  - Cover image
  - Title
  - Excerpt
  - Category badge
  - Author name
  - Average rating
  - View count
- Featured articles section at top
- Pagination

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Header with Search Bar                    │
├─────────┬───────────────────────────────────┤
│         │  Featured Articles (Carousel)     │
│ Category│  ┌──┬──┬──┐                       │
│ Sidebar │  │1 │2 │3 │                       │
│         │  └──┴──┴──┘                       │
│ - All   │                                   │
│ - Heat  │  Filter: [Tags] [Sort ▼]         │
│ - Water │                                   │
│ - Sewage│  ┌────────┐ ┌────────┐ ┌────────┐│
│ - Elect │  │ Article│ │ Article│ │ Article││
│ - etc.  │  │  Card  │ │  Card  │ │  Card  ││
│         │  └────────┘ └────────┘ └────────┘│
│         │  ┌────────┐ ┌────────┐ ┌────────┐│
│         │  │ Article│ │ Article│ │ Article││
│         │  │  Card  │ │  Card  │ │  Card  ││
│         │  └────────┘ └────────┘ └────────┘│
│         │                                   │
│         │  [← Previous] [1 2 3 4] [Next →] │
└─────────┴───────────────────────────────────┘
```

### 2. Article View Page (`/wiki/:slug`)

**Component:** `WikiArticlePage.tsx`

**Features:**
- Full article content rendered from HTML
- Cover image
- Breadcrumb navigation (Home > Wiki > Category > Article)
- Article metadata (author, date, category, tags)
- Rating component (5-star)
- Related articles sidebar
- Table of contents (auto-generated from H2/H3 headings)
- Print/Share buttons
- Report issue button

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Breadcrumb: Home > Wiki > Water > Article │
├───────────────────────────┬─────────────────┤
│                           │                 │
│  Cover Image              │  Table of       │
│                           │  Contents       │
│  # Article Title          │  - Section 1    │
│  By John Doe | Jan 4, 2024│  - Section 2    │
│  ★★★★★ 4.5 (12 ratings)  │  - Section 3    │
│  Category: Water          │                 │
│                           │                 │
│  ## Introduction          │  Related        │
│  Lorem ipsum dolor sit... │  Articles       │
│                           │  ┌───────────┐  │
│  [Image with caption]     │  │  Article  │  │
│                           │  └───────────┘  │
│  ## Step 1: Preparation   │  ┌───────────┐  │
│  Instructions here...     │  │  Article  │  │
│                           │  └───────────┘  │
│  ## Step 2: Maintenance   │                 │
│  More content...          │                 │
│                           │                 │
│  ---                      │                 │
│  Rate this article:       │                 │
│  ☆☆☆☆☆                   │                 │
│  [Share] [Print] [Report] │                 │
└───────────────────────────┴─────────────────┘
```

### 3. Article Editor Page (`/wiki/new`, `/wiki/edit/:id`)

**Component:** `WikiEditorPage.tsx`

**Features:**
- WYSIWYG editor (TipTap or similar)
- Cover image upload
- Inline image upload
- Category dropdown
- Tag input (autocomplete)
- Save as draft button
- Submit for review button
- Preview mode toggle
- Auto-save functionality
- Character count
- SEO preview

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [Save Draft] [Preview] [Submit for Review]│
├─────────────────────────────────────────────┤
│  Title: [                                 ] │
│  Category: [Water        ▼]                │
│  Tags: [hot-water] [tankless] [+]          │
│  Cover Image: [Upload] [preview thumbnail] │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │ [B] [I] [U] [H2] [H3] [•] [1] [🖼]  │   │
│  ├─────────────────────────────────────┤   │
│  │                                     │   │
│  │  # How to Maintain Your On-Demand  │   │
│  │    Hot Water System                │   │
│  │                                     │   │
│  │  ## Introduction                   │   │
│  │  Start typing here...              │   │
│  │                                     │   │
│  │  [Drag image here or click to add] │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  Characters: 245 | Words: 52               │
└─────────────────────────────────────────────┘
```

### 4. My Articles Dashboard (`/wiki/my-articles`)

**Component:** `MyWikiArticlesPage.tsx`

**Features:**
- Table view of user's articles
- Status badges (draft, pending, approved, rejected)
- Quick actions (Edit, Delete, View)
- Submission status tracking
- Rejection feedback display
- Article stats (views, ratings)

**Layout:**
```
┌─────────────────────────────────────────────┐
│  My Wiki Articles          [+ New Article] │
├─────────────────────────────────────────────┤
│  Filter: [All ▼] [Status ▼]      Search: □│
├─────────────────────────────────────────────┤
│  Title                    Status    Actions│
│  ────────────────────────────────────────  │
│  How to Maintain...       [APPROVED]  ⋮   │
│    Views: 245 | Rating: 4.5              │
│                                            │
│  Winterizing Your...      [PENDING]   ⋮   │
│    Submitted: Jan 3, 2024                 │
│                                            │
│  Furnace Filter Guide     [DRAFT]     ⋮   │
│    Last edited: Jan 2, 2024               │
│                                            │
│  Hot Water Basics         [REJECTED]  ⋮   │
│    Reason: Please add more detail...      │
│    [Edit and Resubmit]                    │
└─────────────────────────────────────────────┘
```

### 5. Admin Review Dashboard (`/admin/wiki`)

**Component:** `AdminWikiReviewPage.tsx`

**Features:**
- Queue of pending articles
- Quick review interface
- Approve/Reject actions
- Edit before approval
- Bulk actions
- Filter by category
- Article preview pane

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Wiki Articles - Admin Review              │
├─────────────────────────────────────────────┤
│  [Pending (5)] [Approved] [Rejected] [All] │
├───────────────────┬─────────────────────────┤
│  Article Queue    │  Preview Pane           │
│                   │                         │
│  ┌─────────────┐ │  How to Maintain Your   │
│  │ How to Main │ │  On-Demand Hot Water    │
│  │ ...         │ │                         │
│  │ By John Doe │ │  ## Introduction        │
│  │ Jan 4, 2024 │ │  Lorem ipsum dolor...   │
│  │ [Review]    │ │                         │
│  └─────────────┘ │  [Image]                │
│                   │                         │
│  ┌─────────────┐ │  More content here...   │
│  │ Winterizing │ │                         │
│  │ ...         │ │  ---                    │
│  │ By Jane S.  │ │  Category: Water        │
│  │ Jan 3, 2024 │ │  Tags: hot-water, tank  │
│  │ [Review]    │ │                         │
│  └─────────────┘ │  [✓ Approve] [✗ Reject] │
│                   │  [✏ Edit]               │
│                   │  Feature: ☐             │
└───────────────────┴─────────────────────────┘
```

---

## WYSIWYG Editor Integration

### Recommended Editor: **TipTap**

**Why TipTap:**
- Modern, headless WYSIWYG editor
- Built on ProseMirror
- React integration (`@tiptap/react`)
- Extensible and customizable
- Good image handling
- Clean HTML output
- Active development

**Installation:**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
```

### Editor Configuration

**File:** `/frontend/src/components/wiki/WikiEditor.tsx`

```tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';

interface WikiEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<{ url: string; key: string }>;
}

export function WikiEditor({ initialContent, onChange, onImageUpload }: WikiEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3] // H1 is reserved for article title
        }
      }),
      Image.configure({
        inline: true,
        allowBase64: false
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...'
      })
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-4'
      }
    }
  });

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const { url } = await onImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : '🖼 Image'}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter link URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
```

### Usage in Form

```tsx
import { WikiEditor } from './WikiEditor';
import { uploadWikiImage } from '@/services/wiki.service';

function CreateArticlePage() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File) => {
    // Upload to MinIO via API
    const formData = new FormData();
    formData.append('image', file);

    const response = await uploadWikiImage(formData);
    return response.data;
  };

  return (
    <form>
      <WikiEditor
        initialContent={content}
        onChange={setContent}
        onImageUpload={handleImageUpload}
      />
    </form>
  );
}
```

---

## Photo Upload System

### MinIO Integration

**Storage Structure:**
```
furnacelog-bucket/
├── wiki/
│   ├── covers/
│   │   ├── {article-uuid}-cover.jpg
│   │   └── ...
│   └── images/
│       ├── {uuid}-image1.jpg
│       ├── {uuid}-image2.png
│       └── ...
```

### Backend Upload Endpoint

**Endpoint:** `POST /api/v1/wiki/upload/image`

**File:** `/backend/src/controllers/wikiController.js`

```javascript
import { uploadToMinio, deleteFromMinio } from '../utils/minioClient.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.'));
    }
  }
}).single('image');

export const uploadWikiImage = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          error: { message: err.message }
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No file uploaded' }
        });
      }

      // Generate unique filename
      const fileExt = path.extname(req.file.originalname);
      const filename = `${uuidv4()}${fileExt}`;
      const objectKey = `wiki/images/${filename}`;

      // Upload to MinIO
      const result = await uploadToMinio(
        objectKey,
        req.file.buffer,
        req.file.mimetype
      );

      // Generate presigned URL (7 days expiry) or public URL
      const url = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${objectKey}`;

      res.status(201).json({
        success: true,
        data: {
          url,
          key: objectKey,
          filename,
          size: req.file.size,
          mimeType: req.file.mimetype
        }
      });
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to upload image' }
    });
  }
};
```

### Frontend Upload Service

**File:** `/frontend/src/services/wiki.service.ts`

```typescript
import axios from 'axios';

export const uploadWikiImage = async (formData: FormData) => {
  const response = await axios.post('/api/v1/wiki/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};
```

### Image Optimization

**Backend Processing (Optional):**
- Use `sharp` library to resize/optimize images before upload
- Generate thumbnails for cover images
- Convert to WebP for smaller file sizes

```javascript
import sharp from 'sharp';

// Optimize image before upload
const optimizedBuffer = await sharp(req.file.buffer)
  .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 85 })
  .toBuffer();
```

---

## Admin Approval Workflow

### Workflow States

```
┌─────────┐
│  DRAFT  │ ← User creates article
└────┬────┘
     │ User clicks "Submit for Review"
     ▼
┌─────────┐
│ PENDING │ ← Awaits admin review
└────┬────┘
     │
     ├─────► Admin Approves ──► ┌──────────┐
     │                          │ APPROVED │ ← Publicly visible
     │                          └──────────┘
     │
     └─────► Admin Rejects ───► ┌──────────┐
                                 │ REJECTED │ ← User can edit & resubmit
                                 └──────────┘
```

### Email Notifications

**1. Article Submitted (To Admins)**

**Trigger:** User submits article for review
**Recipients:** All users with `role: 'admin'` or `role: 'super-admin'`

**Template:**
```
Subject: New Wiki Article Pending Review

Hi Admin,

A new wiki article has been submitted for review:

Title: "How to Maintain Your On-Demand Hot Water System"
Author: John Doe
Category: Water Systems
Submitted: January 4, 2024

Review it here: https://furnacelog.com/admin/wiki/articles/article-uuid

Thanks,
FurnaceLog Team
```

**2. Article Approved (To Author)**

**Trigger:** Admin approves article
**Recipients:** Article author

**Template:**
```
Subject: Your Wiki Article Has Been Approved!

Hi John,

Great news! Your article "How to Maintain Your On-Demand Hot Water System" has been approved and is now live on FurnaceLog!

View your published article: https://furnacelog.com/wiki/how-to-maintain-on-demand-hot-water-system

Thank you for contributing to the FurnaceLog community!

Best regards,
FurnaceLog Team
```

**3. Article Rejected (To Author)**

**Trigger:** Admin rejects article
**Recipients:** Article author

**Template:**
```
Subject: Wiki Article Needs Revisions

Hi John,

Your article "How to Maintain Your On-Demand Hot Water System" needs some revisions before it can be published.

Reviewer Feedback:
"Please add more detail to the maintenance steps and include safety warnings."

You can edit and resubmit your article here: https://furnacelog.com/wiki/edit/article-uuid

If you have questions, feel free to reply to this email.

Best regards,
FurnaceLog Team
```

### Admin Dashboard Statistics

**Display on Admin Panel:**
- Total pending articles
- Total approved articles
- Total rejected articles
- Average review time
- Top contributors (by approved articles)

---

## Browse & Navigation

### Category Navigation

**Sidebar Categories:**
- All Articles
- Heating Systems
  - Furnaces
  - Boilers
  - Heat Pumps
  - Wood/Pellet Stoves
- Water Systems
  - Wells & Pumps
  - Hot Water Heaters
  - Water Treatment
- Sewage Systems
  - Septic Tanks
  - Holding Tanks
- Electrical Systems
  - Generators
  - Panels
- Appliances
- Specialized Systems
- Fuel Storage
- General Maintenance
- Seasonal Preparation
- Emergency Procedures

### Search Functionality

**Full-Text Search:**
- Search across title, content, and tags
- MongoDB text index for performance
- Autocomplete suggestions based on popular tags

**Search Query:**
```javascript
const results = await WikiArticle.find(
  {
    $text: { $search: searchQuery },
    status: 'approved'
  },
  {
    score: { $meta: 'textScore' }
  }
).sort({ score: { $meta: 'textScore' } });
```

### Sorting Options

- **Most Recent:** `publishedAt DESC`
- **Most Popular:** `viewCount DESC`
- **Highest Rated:** `averageRating DESC, ratingCount DESC`
- **Most Helpful:** `ratingCount DESC, averageRating DESC`

### Filtering

- By category
- By tags
- By author (if logged in)
- Featured only

---

## Implementation Steps

### Phase 1: Database & Backend API (Week 1)

**Tasks:**
1. ✅ Create WikiArticle Mongoose model
2. ✅ Create WikiCategory model (optional)
3. ✅ Set up text indexes for search
4. ✅ Implement public API endpoints:
   - GET /api/v1/wiki/articles
   - GET /api/v1/wiki/articles/:slug
   - GET /api/v1/wiki/categories
5. ✅ Implement authenticated user endpoints:
   - POST /api/v1/wiki/articles
   - PATCH /api/v1/wiki/articles/:id
   - POST /api/v1/wiki/articles/:id/submit
   - POST /api/v1/wiki/articles/:slug/rate
   - GET /api/v1/wiki/my-articles
   - DELETE /api/v1/wiki/articles/:id
6. ✅ Implement admin endpoints:
   - GET /api/v1/admin/wiki/pending
   - GET /api/v1/admin/wiki/articles/:id
   - POST /api/v1/admin/wiki/articles/:id/approve
   - POST /api/v1/admin/wiki/articles/:id/reject
   - PATCH /api/v1/admin/wiki/articles/:id
   - PATCH /api/v1/admin/wiki/articles/:id/feature
   - POST /api/v1/admin/wiki/articles/:id/archive
7. ✅ Implement image upload endpoint (MinIO)
8. ✅ Add middleware for authorization checks
9. ✅ Write API integration tests

**Deliverable:** Fully functional REST API with documentation

---

### Phase 2: Frontend - Browse & View (Week 2)

**Tasks:**
1. ✅ Create WikiBrowsePage component
2. ✅ Create WikiArticlePage component
3. ✅ Create ArticleCard component
4. ✅ Create CategorySidebar component
5. ✅ Create SearchBar component with autocomplete
6. ✅ Create RatingDisplay component (stars)
7. ✅ Create RatingInput component (interactive stars)
8. ✅ Implement pagination
9. ✅ Implement filtering and sorting
10. ✅ Add breadcrumb navigation
11. ✅ Create related articles logic
12. ✅ Add table of contents auto-generation
13. ✅ Style with Tailwind CSS
14. ✅ Add loading skeletons

**Deliverable:** Public-facing wiki browse and view pages

---

### Phase 3: Frontend - Editor & User Dashboard (Week 3)

**Tasks:**
1. ✅ Install and configure TipTap editor
2. ✅ Create WikiEditor component
3. ✅ Create CreateArticlePage component
4. ✅ Create EditArticlePage component
5. ✅ Create MyWikiArticlesPage component
6. ✅ Implement cover image upload
7. ✅ Implement inline image upload
8. ✅ Add tag autocomplete input
9. ✅ Add draft auto-save functionality
10. ✅ Add preview mode toggle
11. ✅ Create article submission flow
12. ✅ Display rejection feedback
13. ✅ Implement edit and resubmit
14. ✅ Add form validation with Zod

**Deliverable:** Complete article creation and management for users

---

### Phase 4: Admin Panel (Week 4)

**Tasks:**
1. ✅ Create AdminWikiReviewPage component
2. ✅ Create ArticleReviewCard component
3. ✅ Create ReviewPreviewPane component
4. ✅ Implement approve/reject actions
5. ✅ Add bulk actions (approve multiple)
6. ✅ Create admin edit interface
7. ✅ Implement feature article toggle
8. ✅ Add admin statistics dashboard
9. ✅ Create rejection feedback form
10. ✅ Add admin notes field
11. ✅ Implement archive functionality

**Deliverable:** Full admin review and management interface

---

### Phase 5: Email Notifications & Polish (Week 5)

**Tasks:**
1. ✅ Set up email templates (Nodemailer)
2. ✅ Implement submission notification to admins
3. ✅ Implement approval notification to author
4. ✅ Implement rejection notification to author
5. ✅ Add view count tracking
6. ✅ Optimize images with Sharp
7. ✅ Add SEO meta tags to article pages
8. ✅ Implement social sharing buttons
9. ✅ Add print stylesheet
10. ✅ Performance optimization (lazy loading images)
11. ✅ Add analytics tracking
12. ✅ Write user documentation
13. ✅ Final QA testing

**Deliverable:** Production-ready wiki feature with notifications

---

### Phase 6: Testing & Deployment (Week 6)

**Tasks:**
1. ✅ Write unit tests for controllers
2. ✅ Write integration tests for API
3. ✅ Write E2E tests for user flows
4. ✅ Test admin approval workflow
5. ✅ Test image uploads
6. ✅ Test email notifications
7. ✅ Cross-browser testing
8. ✅ Mobile responsiveness testing
9. ✅ Accessibility audit (WCAG 2.1)
10. ✅ Load testing
11. ✅ Security audit
12. ✅ Deploy to staging
13. ✅ User acceptance testing
14. ✅ Deploy to production

**Deliverable:** Tested and deployed wiki feature

---

## Additional Features (Future Enhancements)

### Version History
- Track all article edits
- Display changelog to users
- Rollback to previous versions

### Comments & Discussion
- Allow users to comment on articles
- Nested comment threads
- Comment moderation

### Bookmarks & Favorites
- Users can bookmark articles
- Personal collections

### Contributor Badges
- Award badges to top contributors
- Display badge count on profile

### Article Templates
- Pre-built templates for common maintenance tasks
- Guided article creation

### Multi-Language Support
- Translate articles to French (for Canadian users)
- Language selector

### Video Embeds
- Allow YouTube/Vimeo embeds
- Upload video tutorials

### PDF Export
- Export articles as PDF
- Print-friendly formatting

---

## Security Considerations

### Input Validation
- Sanitize HTML from WYSIWYG editor (use DOMPurify)
- Validate image file types and sizes
- Rate limit article submissions (max 5 per day per user)
- Validate tags (max length, allowed characters)

### Content Moderation
- Admin review required before publication
- Report inappropriate content button
- Blacklist spam keywords

### Authorization
- Users can only edit own articles
- Admins can edit any article
- Ownership validation middleware

### Image Security
- Scan uploaded images for malware
- Strip EXIF data from images
- Validate image dimensions

---

## Performance Optimization

### Caching
- Cache featured articles in Redis (TTL: 1 hour)
- Cache popular articles (TTL: 15 minutes)
- Cache category counts (TTL: 30 minutes)

### Database Indexes
- Text index on title, content, tags
- Compound index on (category, status, publishedAt)
- Index on (status, submittedAt) for admin queue

### Image Optimization
- Lazy load images in articles
- Use WebP format with JPEG fallback
- Generate responsive image sizes (small, medium, large)
- CDN for image delivery

### Pagination
- Limit results to 20 per page
- Cursor-based pagination for large datasets

---

## Monitoring & Analytics

### Metrics to Track
- Total articles (by status)
- Article views (top 10 most viewed)
- Average rating per article
- User engagement (ratings, time on page)
- Admin review time (average, median)
- Submission to approval time

### Admin Dashboard Stats
- Pending articles count
- Articles approved today/week/month
- Top contributors (by approved articles)
- Most popular categories

---

## Accessibility (WCAG 2.1)

### Requirements
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Alt text for all images
- Color contrast ratio >= 4.5:1
- Focus indicators on all interactive elements

---

## Success Metrics

### Launch Goals (First 3 Months)
- 50+ approved articles
- 20+ active contributors
- 1000+ total article views
- Average rating >= 4.0 stars
- Admin review time <= 48 hours

### Long-Term Goals (Year 1)
- 200+ approved articles
- 100+ active contributors
- 10,000+ total article views
- Top 10 most viewed articles have >= 500 views each
- User satisfaction rating >= 4.5 stars

---

## Conclusion

This wiki feature will transform FurnaceLog into a community-driven knowledge base for home maintenance in northern climates. By leveraging user-generated content with admin quality control, we create a valuable resource that scales with our user base.

The WYSIWYG editor makes article creation accessible to non-technical users, while the approval workflow ensures content quality. The categorized browse experience and powerful search make it easy for users to find the information they need.

**Next Steps:**
1. Review and approve this specification
2. Begin Phase 1: Database & Backend API implementation
3. Set up project board for task tracking
4. Assign developers to phases
5. Schedule weekly progress reviews

---

**Document Version:** 1.0
**Last Updated:** January 4, 2024
**Author:** AI Assistant
**Status:** Draft - Pending Review
