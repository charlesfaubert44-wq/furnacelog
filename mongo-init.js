// MongoDB Initialization Script for FurnaceLog
// This script runs when MongoDB container first starts

// Switch to the FurnaceLog database
db = db.getSiblingDB('furnacelog');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        passwordHash: {
          bsonType: 'string',
          description: 'must be a hashed password'
        }
      }
    }
  }
});

// Create indexes for users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });
db.users.createIndex({ 'profile.community': 1 });

// Create homes collection
db.createCollection('homes');
db.homes.createIndex({ userId: 1 });
db.homes.createIndex({ 'address.community': 1 });
db.homes.createIndex({ 'address.coordinates': '2dsphere' });

// Create systems collection
db.createCollection('systems');
db.systems.createIndex({ homeId: 1 });
db.systems.createIndex({ homeId: 1, category: 1 });
db.systems.createIndex({ 'warranty.endDate': 1 });

// Create components collection
db.createCollection('components');
db.components.createIndex({ homeId: 1 });
db.components.createIndex({ systemId: 1 });

// Create maintenance tasks library collection
db.createCollection('maintenancetasks');
db.maintenancetasks.createIndex({ category: 1 });
db.maintenancetasks.createIndex({ applicableSystems: 1 });
db.maintenancetasks.createIndex({ isBuiltIn: 1 });

// Create scheduled maintenance collection
db.createCollection('scheduledmaintenance');
db.scheduledmaintenance.createIndex({ homeId: 1, status: 1 });
db.scheduledmaintenance.createIndex({ homeId: 1, 'scheduling.dueDate': 1 });
db.scheduledmaintenance.createIndex({ status: 1, 'scheduling.dueDate': 1 });

// Create maintenance logs collection
db.createCollection('maintenancelogs');
db.maintenancelogs.createIndex({ homeId: 1, 'execution.date': -1 });
db.maintenancelogs.createIndex({ systemId: 1 });
db.maintenancelogs.createIndex({ providerId: 1 });

// Create documents collection
db.createCollection('documents');
db.documents.createIndex({ homeId: 1 });
db.documents.createIndex({ systemId: 1 });
db.documents.createIndex({ type: 1 });
db.documents.createIndex({ tags: 1 });

// Create seasonal checklists collection
db.createCollection('seasonalchecklists');
db.seasonalchecklists.createIndex({ homeId: 1, year: 1, season: 1 });

// Create freeze events collection
db.createCollection('freezeevents');
db.freezeevents.createIndex({ homeId: 1, date: -1 });

// Create service providers collection
db.createCollection('serviceproviders');
db.serviceproviders.createIndex({ 'serviceAreas.community': 1 });
db.serviceproviders.createIndex({ serviceTypes: 1 });
db.serviceproviders.createIndex({ 'ratings.overall': -1 });
db.serviceproviders.createIndex({ businessName: 'text' });

// Create reviews collection
db.createCollection('reviews');
db.reviews.createIndex({ providerId: 1, createdAt: -1 });
db.reviews.createIndex({ userId: 1 });
db.reviews.createIndex({ status: 1 });

// Create wiki articles collection
db.createCollection('wikiarticles');
db.wikiarticles.createIndex({ status: 1, publishedAt: -1 });
db.wikiarticles.createIndex({ slug: 1 }, { unique: true, sparse: true });
db.wikiarticles.createIndex({ 'author.userId': 1, status: 1 });
db.wikiarticles.createIndex({ categories: 1, status: 1 });
db.wikiarticles.createIndex({ tags: 1 });
db.wikiarticles.createIndex({ title: 'text', contentPlainText: 'text' });
db.wikiarticles.createIndex({ featured: 1, publishedAt: -1 });
db.wikiarticles.createIndex({ 'engagement.viewCount': -1 });
db.wikiarticles.createIndex({ 'engagement.helpfulPercentage': -1 });

print('FurnaceLog database initialized successfully!');
print('Collections created with indexes.');
