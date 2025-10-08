import mongoose, { Document, Schema } from "mongoose";

export interface IComplaint extends Document {
  title: string;
  category: string;
  description: string;
  location: string;
  image?: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdBy?: string; // User ID who created the complaint
  assignedTo?: string; // Admin/Staff ID assigned to handle the complaint
  priority: "Low" | "Medium" | "High";
  tags: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  comments: Array<{
    text: string;
    author: string;
    createdAt: Date;
  }>;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [300, "Location cannot exceed 300 characters"],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    createdBy: {
      type: String,
      default: null,
    },
    assignedTo: {
      type: String,
      default: null,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
          maxlength: [500, "Comment cannot exceed 500 characters"],
        },
        author: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
ComplaintSchema.index({ status: 1 });
ComplaintSchema.index({ category: 1 });
ComplaintSchema.index({ createdAt: -1 });
ComplaintSchema.index({ location: "text", title: "text", description: "text" });
ComplaintSchema.index({ coordinates: "2dsphere" });

// Virtual for complaint age
ComplaintSchema.virtual("ageInDays").get(function () {
  return Math.floor(
    (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );
});

// Pre-save middleware to set resolvedAt when status changes to Resolved
ComplaintSchema.pre<IComplaint>("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  next();
});

export default mongoose.model<IComplaint>("Complaint", ComplaintSchema);
