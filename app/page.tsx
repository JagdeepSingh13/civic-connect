"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ComplaintForm } from "@/components/complaint-form";
import { ComplaintDashboard } from "@/components/complaint-dashboard";
import { PublicLog } from "@/components/public-log";
import { UserProfile } from "@/components/user-profile";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<
    "file" | "dashboard" | "log" | "profile"
  >("file");

  return (
    <AuthProvider>
      <ComplaintProvider>
        <div className="min-h-screen bg-background">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="container mx-auto px-4 py-8">
            {activeTab === "file" && <ComplaintForm />}

            {activeTab === "dashboard" && <ComplaintDashboard />}

            {activeTab === "log" && <PublicLog />}

            {activeTab === "profile" && <UserProfile />}
          </main>
        </div>
      </ComplaintProvider>
    </AuthProvider>
  );
}
