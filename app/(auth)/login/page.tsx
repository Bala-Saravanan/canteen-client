"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginApi } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.success && res.data) {
        setUser(res.data);
        toast.success(res.message);
        if (res.data.role === "admin") {
          router.push("/dashboard");
        } else {
          router.replace("/menu");
        }
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div
        className="animate-fade-up"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🍽</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: "6px",
              letterSpacing: "-0.04em",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "15px" }}>
            Sign in to your canteen account
          </p>
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: "32px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-muted)",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-muted)",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "4px",
                fontSize: "15px",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderWidth: "2px",
                    }}
                  />{" "}
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "var(--color-text-muted)",
            fontSize: "14px",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
