"use client";

import { useState } from "react";
import {
  Building2,
  FileText,
  BarChart3,
  List,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface HeaderProps {
  activeTab: "file" | "dashboard" | "log" | "profile";
  setActiveTab: (tab: "file" | "dashboard" | "log" | "profile") => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  CivicConnect
                </h1>
                <p className="text-sm text-muted-foreground">
                  Report & Track Civic Issues
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-2">
                <Button
                  variant={activeTab === "file" ? "default" : "ghost"}
                  onClick={() => setActiveTab("file")}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  File Complaint
                </Button>

                <Button
                  variant={activeTab === "dashboard" ? "default" : "ghost"}
                  onClick={() => setActiveTab("dashboard")}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>

                <Button
                  variant={activeTab === "log" ? "default" : "ghost"}
                  onClick={() => setActiveTab("log")}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  Public Log
                </Button>

                {isAuthenticated && (
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    onClick={() => setActiveTab("profile")}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Profile
                  </Button>
                )}
              </nav>

              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user?.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        ({user?.role})
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
