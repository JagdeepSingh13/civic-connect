import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, FileText, Loader2 } from "lucide-react";
import { useComplaints } from "@/contexts/ComplaintContext";

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

export function PublicLog() {
  const { complaints, isLoading, stats } = useComplaints();

  // Sort complaints by date (newest first)
  const sortedComplaints = [...(complaints || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Public Records
          </h3>
          <p className="text-muted-foreground mb-6 text-pretty">
            Once complaints are filed, they will be listed here chronologically
            for public transparency.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Public Complaint Log
        </h2>
        <p className="text-muted-foreground text-pretty">
          Transparent record of all civic issues reported by citizens, listed
          chronologically.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Transparency Report</CardTitle>
          <CardDescription>
            This public log promotes accountability and keeps citizens informed
            about community issues.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {complaints.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Issues</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.statusStats.find((s) => s._id === "Pending")?.count ||
                  0}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.statusStats.find((s) => s._id === "In Progress")
                  ?.count || 0}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats?.statusStats.find((s) => s._id === "Resolved")?.count ||
                  0}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedComplaints.map((complaint, index) => (
          <Card
            key={complaint._id}
            className="hover:bg-accent/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  {index + 1}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-balance">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="font-medium">
                          {complaint.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(
                            complaint.createdAt
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(complaint.createdAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(complaint.status)}>
                      {complaint.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground text-pretty">
                    {complaint.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {complaint.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      ID: {complaint._id}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
