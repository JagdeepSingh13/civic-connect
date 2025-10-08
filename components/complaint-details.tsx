"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  MapPin,
  User,
  ArrowLeft,
  MessageSquare,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useComplaints } from "@/contexts/ComplaintContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/lib/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  }
};

export function ComplaintDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { updateComplaintStatus, deleteComplaint } = useComplaints();

  const [complaint, setComplaint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const complaintData = await apiService.getComplaintById(id as string);
        setComplaint(complaintData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch complaint"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmittingComment(true);
    try {
      const updatedComplaint = await apiService.addComment(
        id as string,
        newComment
      );
      setComplaint(updatedComplaint);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateComplaintStatus(
        id as string,
        status as "Pending" | "In Progress" | "Resolved"
      );
      setComplaint((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this complaint? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteComplaint(id as string);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to delete complaint:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Complaint Not Found</h3>
          <p className="text-muted-foreground mb-4">
            {error || "The complaint you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {complaint.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-medium">{complaint.category}</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
              {complaint.createdBy && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {complaint.createdBy.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status}
            </Badge>
            {complaint.priority && (
              <Badge variant="outline">{complaint.priority} Priority</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {complaint.description}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{complaint.location}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments ({complaint.comments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment Form */}
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="space-y-3">
                  <Label htmlFor="comment">Add a comment</Label>
                  <Textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or updates..."
                    rows={3}
                  />
                  <Button
                    type="submit"
                    disabled={!newComment.trim() || isSubmittingComment}
                    size="sm"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    Add Comment
                  </Button>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-3">
                {complaint.comments && complaint.comments.length > 0 ? (
                  complaint.comments.map((comment: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-muted pl-4 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No comments yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          {(user?.role === "admin" || user?.role === "staff") && (
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {["Pending", "In Progress", "Resolved"].map((status) => (
                    <Button
                      key={status}
                      variant={
                        complaint.status === status ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      className="justify-start"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Complaint
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Complaint Info */}
          <Card>
            <CardHeader>
              <CardTitle>Complaint Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium">ID:</span>
                <span className="ml-2 font-mono text-xs">{complaint._id}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">
                  {new Date(complaint.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <span className="ml-2">
                  {new Date(complaint.updatedAt).toLocaleString()}
                </span>
              </div>
              {complaint.assignedTo && (
                <div>
                  <span className="font-medium">Assigned To:</span>
                  <span className="ml-2">{complaint.assignedTo.name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
