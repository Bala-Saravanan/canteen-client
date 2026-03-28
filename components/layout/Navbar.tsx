"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavLink {
  href: string;
  label: string;
}

const userLinks: NavLink[] = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "My Orders" },
];

const adminLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/menus", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/receipts", label: "Receipts" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const links = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <nav
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <Link
          href={user?.role === "admin" ? "/dashboard" : "/menu"}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "20px",
            color: "var(--color-accent)",
            textDecoration: "none",
            letterSpacing: "-0.03em",
            flexShrink: 0,
          }}
        >
          🍽 Canteen
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "4px", flex: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  background: active
                    ? "var(--color-accent-dim)"
                    : "transparent",
                  color: active
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            {user?.name}
          </span>
          {user?.role === "admin" && (
            <span
              className="badge"
              style={{
                background: "rgba(244,164,53,0.15)",
                color: "var(--color-accent)",
              }}
            >
              Admin
            </span>
          )}
          <button
            className="btn-ghost"
            onClick={logout}
            style={{ padding: "6px 14px", fontSize: "13px" }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
