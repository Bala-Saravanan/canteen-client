"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Loader from "@/components/ui/Loader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    // if (!loading && user?.role !== "user") router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading) return <Loader fullscreen />;
  if (!user || user.role !== "user") return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-ink)" }}>
      <Navbar />
      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}
      >
        {children}
      </main>
    </div>
  );
}
