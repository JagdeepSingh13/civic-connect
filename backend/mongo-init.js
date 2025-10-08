// MongoDB initialization script
db = db.getSiblingDB("civic-connect");

// Create collections with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role"],
      properties: {
        name: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        },
        password: {
          bsonType: "string",
          minLength: 6,
        },
        role: {
          bsonType: "string",
          enum: ["citizen", "admin", "staff"],
        },
      },
    },
  },
});

db.createCollection("complaints", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "category", "description", "location", "status"],
      properties: {
        title: {
          bsonType: "string",
          minLength: 5,
          maxLength: 200,
        },
        category: {
          bsonType: "string",
          enum: [
            "Pothole",
            "Garbage Collection",
            "Waterlogging",
            "Street Lighting",
            "Traffic Signal",
            "Park Maintenance",
            "Noise Pollution",
            "Other",
          ],
        },
        status: {
          bsonType: "string",
          enum: ["Pending", "In Progress", "Resolved"],
        },
      },
    },
  },
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1 });

db.complaints.createIndex({ status: 1 });
db.complaints.createIndex({ category: 1 });
db.complaints.createIndex({ createdAt: -1 });
db.complaints.createIndex({
  location: "text",
  title: "text",
  description: "text",
});
db.complaints.createIndex({ coordinates: "2dsphere" });

print("Database initialized successfully!");
