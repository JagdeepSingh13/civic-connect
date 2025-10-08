"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService, Complaint, ComplaintStats } from "@/lib/api";

interface ComplaintContextType {
  complaints: Complaint[];
  stats: ComplaintStats | null;
  isLoading: boolean;
  error: string | null;
  fetchComplaints: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
  createComplaint: (complaintData: {
    title: string;
    category: string;
    description: string;
    location: string;
    image?: string;
    priority?: "Low" | "Medium" | "High";
    tags?: string[];
  }) => Promise<Complaint>;
  updateComplaintStatus: (
    id: string,
    status: "Pending" | "In Progress" | "Resolved",
    assignedTo?: string,
    priority?: "Low" | "Medium" | "High"
  ) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
  deleteComplaint: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  refreshComplaints: () => Promise<void>;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(
  undefined
);

export function ComplaintProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<ComplaintStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getComplaints(params);
      setComplaints(response.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch complaints"
      );
      console.error("Failed to fetch complaints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createComplaint = async (complaintData: {
    title: string;
    category: string;
    description: string;
    location: string;
    image?: string;
    priority?: "Low" | "Medium" | "High";
    tags?: string[];
  }): Promise<Complaint> => {
    try {
      const newComplaint = await apiService.createComplaint(complaintData);
      setComplaints((prev) => [newComplaint, ...(prev || [])]);
      return newComplaint;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create complaint"
      );
      throw err;
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: "Pending" | "In Progress" | "Resolved",
    assignedTo?: string,
    priority?: "Low" | "Medium" | "High"
  ) => {
    try {
      await apiService.updateComplaintStatus(id, {
        status,
        assignedTo,
        priority,
      });
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === id
            ? { ...complaint, status, assignedTo, priority }
            : complaint
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update complaint status"
      );
      throw err;
    }
  };

  const addComment = async (id: string, text: string) => {
    try {
      const updatedComplaint = await apiService.addComment(id, text);
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === id ? updatedComplaint : complaint
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
      throw err;
    }
  };

  const deleteComplaint = async (id: string) => {
    try {
      await apiService.deleteComplaint(id);
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete complaint"
      );
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await apiService.getComplaintStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const refreshComplaints = async () => {
    await fetchComplaints();
  };

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, []);

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        stats,
        isLoading,
        error,
        fetchComplaints,
        createComplaint,
        updateComplaintStatus,
        addComment,
        deleteComplaint,
        fetchStats,
        refreshComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
}
