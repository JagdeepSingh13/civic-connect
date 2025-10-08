const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface Complaint {
  _id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  image?: string;
  status: "Pending" | "In Progress" | "Resolved";
  priority?: "Low" | "Medium" | "High";
  tags?: string[];
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  comments?: Array<{
    text: string;
    author: string;
    createdAt: string;
  }>;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "citizen" | "admin" | "staff";
  phone?: string;
  address?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ComplaintStats {
  statusStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
  recentComplaints: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    category: string;
  }>;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }

    return response.data!;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.token = response.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
    }

    return response.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.request<User>("/auth/profile");
    return response.data!;
  }

  async updateProfile(userData: {
    name?: string;
    phone?: string;
    address?: string;
  }): Promise<User> {
    const response = await this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    await this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  logout(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // Complaint methods
  async getComplaints(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    data: Complaint[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const response = await this.request<{
      data: Complaint[];
      pagination: any;
    }>(`/complaints?${searchParams.toString()}`);

    return response;
  }

  async getComplaintById(id: string): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}`);
    return response.data!;
  }

  async createComplaint(complaintData: {
    title: string;
    category: string;
    description: string;
    location: string;
    image?: string;
    priority?: "Low" | "Medium" | "High";
    tags?: string[];
  }): Promise<Complaint> {
    const response = await this.request<Complaint>("/complaints", {
      method: "POST",
      body: JSON.stringify(complaintData),
    });
    return response.data!;
  }

  async updateComplaintStatus(
    id: string,
    statusData: {
      status: "Pending" | "In Progress" | "Resolved";
      assignedTo?: string;
      priority?: "Low" | "Medium" | "High";
    }
  ): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    });
    return response.data!;
  }

  async addComment(id: string, text: string): Promise<Complaint> {
    const response = await this.request<Complaint>(
      `/complaints/${id}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ text }),
      }
    );
    return response.data!;
  }

  async deleteComplaint(id: string): Promise<void> {
    await this.request(`/complaints/${id}`, {
      method: "DELETE",
    });
  }

  async getComplaintStats(): Promise<ComplaintStats> {
    const response = await this.request<ComplaintStats>("/complaints/stats");
    return response.data!;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService(API_BASE_URL);
