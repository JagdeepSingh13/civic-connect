import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  addComment,
  deleteComplaint,
  getComplaintStats,
} from "../controllers/complaintController";
import { authenticate, authorize, optionalAuth } from "../middleware/auth";
import {
  validateComplaint,
  validateStatusUpdate,
  validateComment,
  validateObjectId,
  validatePagination,
} from "../middleware/validation";

const router = express.Router();

// Public routes (with optional auth)
router.get("/", optionalAuth, validatePagination, getAllComplaints);
router.get("/stats", getComplaintStats);
router.get("/:id", validateObjectId, optionalAuth, getComplaintById);

// Protected routes (require authentication)
router.post("/", authenticate, validateComplaint, createComplaint);
router.post(
  "/:id/comments",
  authenticate,
  validateObjectId,
  validateComment,
  addComment
);

// Admin/Staff routes
router.put(
  "/:id/status",
  authenticate,
  authorize("admin", "staff"),
  validateObjectId,
  validateStatusUpdate,
  updateComplaintStatus
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateObjectId,
  deleteComplaint
);

export default router;
