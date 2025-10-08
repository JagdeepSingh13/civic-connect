"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  MapPin,
  ImageIcon,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useComplaints } from "@/contexts/ComplaintContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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

export function ComplaintDashboard() {
  const { complaints, isLoading, updateComplaintStatus } = useComplaints();
  const { user } = useAuth();
  const router = useRouter();

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateComplaintStatus(
        id,
        status as "Pending" | "In Progress" | "Resolved"
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Complaints Yet
          </h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            {
              "When citizens file complaints, they'll appear here for tracking and management."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Complaint Dashboard
        </h2>
        <p className="text-muted-foreground text-pretty">
          Track and manage all reported civic issues. Total complaints:{" "}
          {complaints.length}
        </p>
      </div>

      <div className="grid gap-6">
        {complaints.map((complaint) => (
          <Card
            key={complaint._id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/complaint/${complaint._id}`)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-balance">
                    {complaint.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="font-medium">{complaint.category}</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-foreground text-pretty">
                {complaint.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{complaint.location}</span>
              </div>

              {complaint.image && (
                <div>
                  <img
                    src={complaint.image || "/placeholder.svg"}
                    alt="Complaint evidence"
                    className="w-32 h-24 object-cover rounded-md border"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/complaint/${complaint._id}`);
                    }}
                    className="gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Details
                  </Button>
                </div>

                {(user?.role === "admin" || user?.role === "staff") && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Update Status:</span>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(complaint._id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {complaint.priority && (
                    <Badge variant="outline" className="text-xs">
                      {complaint.priority} Priority
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground">
                    ID: {complaint._id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
