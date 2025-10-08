"use client";

import { ComplaintDetails } from "@/components/complaint-details";
import { AuthProvider } from "@/contexts/AuthContext";
import { ComplaintProvider } from "@/contexts/ComplaintContext";

export default function ComplaintDetailsPage() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <ComplaintDetails />
      </ComplaintProvider>
    </AuthProvider>
  );
}
