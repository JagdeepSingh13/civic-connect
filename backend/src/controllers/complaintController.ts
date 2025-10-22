import { Request, Response } from "express";
import Complaint, { IComplaint } from "../models/Complaint";
import { validationResult } from "express-validator";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBAWbZEctICqunep-k5NklkinoHs6c1Nzs");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// In: complaintController.ts
// Replace your old analyzeImageWithGemini with this one.

export const analyzeImageWithGemini = async (
  imageDataUrl: string // The full "data:image/png;base64,..." string
): Promise<{ description: string; category: string }> => {
  try {
    // 1. Parse the Data URL to get mimeType and raw data
    const match = imageDataUrl.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
      console.error("Invalid image data URL format");
      return { description: "Invalid image format", category: "Other" };
    }
    if (!match || !match[1] || !match[2]) {
      // --- END FIX ---
      console.error("Invalid image data URL format");
      return { description: "Invalid image format", category: "Other" };
    }

    const mimeType = match[1]; // e.g., "image/png"
    const data = match[2]; // The raw base64 data (e.g., "iVBOR...")

    const prompt = `
      You are an AI civic complaint assistant.
      Analyze the given image related to a public issue.
      Provide a brief description of what it shows and predict the most relevant issue category.
      Categories: Pothole, Garbage Collection, Waterlogging, Street Lighting, Traffic Signal, Park Maintenance, Noise Pollution, Other.
      Return only JSON:
      {
        "description": "...",
        "category": "..."
      }
    `;

    const result = await geminiModel.generateContent([
      { text: prompt },
      // 2. Use the parsed mimeType and data
      { inlineData: { mimeType, data } },
    ]);

    const output = result.response.text();
    const jsonMatch = output.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    console.warn("Gemini did not return valid JSON:", output);
    return { description: output, category: "Other" };
  } catch (err) {
    console.error("Gemini analysis error:", err);
    return { description: "Analysis failed", category: "Other" };
  }
};

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const createComplaint = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const complaintData: any = {
      ...req.body,
      createdBy: req.user?.id || null,
    };

    // If image exists, analyze using Gemini
    if (req.body.image) {
      const analysis = await analyzeImageWithGemini(req.body.image);
      complaintData.analysis = analysis.description;
      console.log(analysis);

      // Auto-set category if AI detects it
      if (analysis.category && analysis.category !== "Other") {
        complaintData.category = analysis.category;
      }
    }

    const complaint = new Complaint(complaintData);
    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getAllComplaints = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query: any = {};

    // Filter by status
    if (
      status &&
      ["Pending", "In Progress", "Resolved"].includes(status as string)
    ) {
      query.status = status;
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const complaints = await Complaint.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getComplaintById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
      return;
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const updateComplaintStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedTo, priority } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const updateData: any = { status };
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (priority) updateData.priority = priority;

    const complaint = await Complaint.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Complaint status updated successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const comment = {
      text,
      author: req.user?.name || "Anonymous",
      createdAt: new Date(),
    };

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true, runValidators: true }
    )
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Comment added successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const deleteComplaint = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getComplaintStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status createdAt category");

    res.json({
      success: true,
      data: {
        statusStats: stats,
        categoryStats,
        recentComplaints,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
