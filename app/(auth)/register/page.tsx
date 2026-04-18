"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerApi } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const set =
    (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi(form);
      if (res.success && res.data) {
        setUser(res.data);
        toast.success(res.message);
        router.push(res.data.role === "admin" ? "/dashboard" : "/menu");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    fontFamily: "var(--font-display)",
    color: "var(--color-text-muted)",
    marginBottom: "8px",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };

  return (
    <div className="auth-bg">
      <div
        className="animate-fade-up"
        style={{ width: "100%", maxWidth: "420px" }}
      >
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
            Create account
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "15px" }}>
            Join the canteen today
          </p>
        </div>

        <div className="card" style={{ padding: "32px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={set("password")}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="account-type">
                Account Type
              </label>
              <select
                id="account-type"
                className="input-field"
                value={form.role}
                onChange={set("role")}
                style={{ cursor: "pointer" }}
              >
                <option value="user">User</option>
                {/* <option value="admin">Admin</option> */}
              </select>
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
                  Creating account…
                </>
              ) : (
                "Create Account"
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
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
