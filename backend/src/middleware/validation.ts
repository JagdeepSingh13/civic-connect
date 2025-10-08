import { body, param, query } from "express-validator";

// Auth validation
export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Address cannot exceed 300 characters"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

export const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Address cannot exceed 300 characters"),
];

export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

// Complaint validation
export const validateComplaint = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("category")
    .isIn([
      "Pothole",
      "Garbage Collection",
      "Waterlogging",
      "Street Lighting",
      "Traffic Signal",
      "Park Maintenance",
      "Noise Pollution",
      "Other",
    ])
    .withMessage("Please select a valid category"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 5, max: 300 })
    .withMessage("Location must be between 5 and 300 characters"),

  body("image").optional().isURL().withMessage("Image must be a valid URL"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each tag cannot exceed 50 characters"),

  body("coordinates.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("coordinates.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

export const validateStatusUpdate = [
  body("status")
    .isIn(["Pending", "In Progress", "Resolved"])
    .withMessage("Status must be Pending, In Progress, or Resolved"),

  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("AssignedTo must be a valid user ID"),

  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),
];

export const validateComment = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be between 1 and 500 characters"),
];

// Parameter validation
export const validateObjectId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

// Query validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["Pending", "In Progress", "Resolved"])
    .withMessage("Status must be Pending, In Progress, or Resolved"),

  query("category")
    .optional()
    .isIn([
      "Pothole",
      "Garbage Collection",
      "Waterlogging",
      "Street Lighting",
      "Traffic Signal",
      "Park Maintenance",
      "Noise Pollution",
      "Other",
    ])
    .withMessage("Invalid category"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "title", "status", "priority"])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),
];
