"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.role === "admin") router.replace("/dashboard");
    else router.replace("/menu");
  }, [user, loading, router]);

  return (
    <div className="auth-bg">
      <div className="spinner" />
    </div>
  );
}
