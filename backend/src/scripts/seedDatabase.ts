import mongoose from "mongoose";
import User from "../models/User";
import Complaint from "../models/Complaint";
import { connectDatabase } from "../config/database";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  const users = [
    {
      name: "Admin User",
      email: "admin@civicconnect.com",
      password: "AdminPass123",
      role: "admin",
      phone: "+1234567890",
      address: "City Hall, Downtown",
    },
    {
      name: "Staff Member",
      email: "staff@civicconnect.com",
      password: "StaffPass123",
      role: "staff",
      phone: "+1234567891",
      address: "Public Works Department",
    },
    {
      name: "John Citizen",
      email: "john@example.com",
      password: "CitizenPass123",
      role: "citizen",
      phone: "+1234567892",
      address: "123 Main Street",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "CitizenPass123",
      role: "citizen",
      phone: "+1234567893",
      address: "456 Oak Avenue",
    },
  ];

  console.log("🌱 Seeding users...");

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.email}`);
    } else {
      console.log(`⚠️  User already exists: ${userData.email}`);
    }
  }
};

const seedComplaints = async () => {
  const admin = await User.findOne({ role: "admin" });
  const staff = await User.findOne({ role: "staff" });
  const citizen1 = await User.findOne({ email: "john@example.com" });
  const citizen2 = await User.findOne({ email: "jane@example.com" });

  const complaints = [
    {
      title: "Large Pothole on Main Street",
      category: "Pothole",
      description:
        "There is a large pothole on Main Street near the intersection with Oak Avenue. It has been getting worse over the past few weeks and is causing damage to vehicles.",
      location: "Main Street & Oak Avenue intersection",
      status: "In Progress",
      priority: "High",
      createdBy: citizen1?._id,
      assignedTo: staff?._id,
      tags: ["traffic", "vehicle-damage"],
      comments: [
        {
          text: "Thank you for reporting this issue. We have assigned it to our road maintenance team.",
          author: "Staff Member",
          createdAt: new Date(),
        },
      ],
    },
    {
      title: "Garbage Not Collected",
      category: "Garbage Collection",
      description:
        "Garbage collection was missed on our street this week. Bins are overflowing and creating a health hazard.",
      location: "456 Oak Avenue",
      status: "Pending",
      priority: "Medium",
      createdBy: citizen2?._id,
      tags: ["health", "sanitation"],
    },
    {
      title: "Street Light Out",
      category: "Street Lighting",
      description:
        "The street light at the corner of Elm Street and Pine Road has been out for three days. It makes the area very dark at night.",
      location: "Elm Street & Pine Road",
      status: "Resolved",
      priority: "Medium",
      createdBy: citizen1?._id,
      assignedTo: staff?._id,
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      tags: ["safety", "lighting"],
    },
    {
      title: "Waterlogging After Rain",
      category: "Waterlogging",
      description:
        "Heavy waterlogging occurs on Park Street after every rainfall. The drainage system seems to be blocked.",
      location: "Park Street, near the community center",
      status: "In Progress",
      priority: "High",
      createdBy: citizen2?._id,
      assignedTo: staff?._id,
      tags: ["drainage", "flooding"],
    },
    {
      title: "Noise from Construction Site",
      category: "Noise Pollution",
      description:
        "Construction work is happening during night hours (after 10 PM) which is disturbing the residents.",
      location: "Construction site near Maple Drive",
      status: "Pending",
      priority: "Medium",
      createdBy: citizen1?._id,
      tags: ["construction", "noise"],
    },
  ];

  console.log("🌱 Seeding complaints...");

  for (const complaintData of complaints) {
    const existingComplaint = await Complaint.findOne({
      title: complaintData.title,
    });
    if (!existingComplaint) {
      const complaint = new Complaint(complaintData);
      await complaint.save();
      console.log(`✅ Created complaint: ${complaintData.title}`);
    } else {
      console.log(`⚠️  Complaint already exists: ${complaintData.title}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    await connectDatabase();

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Complaint.deleteMany({});

    await seedUsers();
    await seedComplaints();

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📋 Created accounts:");
    console.log("👤 Admin: admin@civicconnect.com / AdminPass123");
    console.log("👤 Staff: staff@civicconnect.com / StaffPass123");
    console.log("👤 Citizen: john@example.com / CitizenPass123");
    console.log("👤 Citizen: jane@example.com / CitizenPass123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
