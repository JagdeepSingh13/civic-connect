"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";

const CATEGORIES = [
  "Pothole",
  "Garbage Collection",
  "Waterlogging",
  "Street Lighting",
  "Traffic Signal",
  "Park Maintenance",
  "Noise Pollution",
  "Other",
];

export function ComplaintForm() {
  const { isAuthenticated } = useAuth();
  const { createComplaint } = useComplaints();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.trim().length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.trim().length < 5) {
      newErrors.location = "Location must be at least 5 characters";
    } else if (formData.location.trim().length > 300) {
      newErrors.location = "Location cannot exceed 300 characters";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Image must be a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setErrors({ general: "Please login to file a complaint" });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      await createComplaint({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        image: formData.image || "",
        priority: formData.priority,
      });

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        location: "",
        image: "",
        priority: "Medium",
      });
      setSuccess(true);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error ? error.message : "Failed to submit complaint",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Convert file to base64
      const base64String = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-balance">
            File a New Complaint
          </CardTitle>
          <CardDescription className="text-pretty">
            Report civic issues in your area to help improve your community.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Brief description of the issue"
                className={errors.title ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-xs">
                {errors.title && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Provide detailed information about the issue"
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-xs">
                {errors.description && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {formData.description.length}/1000
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Street address or landmark"
                className={errors.location ? "border-destructive" : ""}
              />
              <div className="flex justify-between text-xs">
                {errors.location && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.location}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {formData.location.length}/300
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "Low" | "Medium" | "High") =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Evidence (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Uploaded evidence"
                    className="w-32 h-24 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {errors.general}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <AlertCircle className="w-4 h-4" />
                Complaint submitted successfully!
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isAuthenticated}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground text-center">
                Please login to file a complaint
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
