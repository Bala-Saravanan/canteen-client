"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getAllOrdersApi, getAllReceiptsApi } from "@/lib/orders";
import { getMenuApi } from "@/lib/menu";
import { Order, Receipt, MenuItem } from "@/types";
import Loader from "@/components/ui/Loader";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className="card animate-fade-up"
      style={{
        padding: "24px",
        borderColor: accent ? "rgba(244,164,53,0.3)" : undefined,
        background: accent
          ? "linear-gradient(135deg, var(--color-surface), rgba(244,164,53,0.06))"
          : undefined,
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "32px",
          color: accent ? "var(--color-accent)" : "var(--color-text)",
          letterSpacing: "-0.04em",
          marginBottom: "4px",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "14px",
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-dim)",
            marginTop: "4px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [o, r, m] = await Promise.all([
        getAllOrdersApi(),
        getAllReceiptsApi(),
        getMenuApi(),
      ]);
      if (o.success && o.data) setOrders(o.data);
      if (r.success && r.data) setReceipts(r.data);
      if (m.success && m.data) setMenuItems(m.data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading) return <Loader fullscreen />;

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const totalRevenue = receipts.reduce((sum, r) => sum + r.totalAmount, 0);
  const availableItems = menuItems.filter((m) => m.isAvailable).length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "6px",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Welcome back,{" "}
          <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
            {user?.name}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div
        className="stagger"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          sub="From all receipts"
          accent
        />
        <StatCard
          icon="📋"
          label="Total Orders"
          value={orders.length}
          sub={`${pendingOrders.length} pending`}
        />
        <StatCard
          icon="✅"
          label="Completed"
          value={completedOrders.length}
          sub="Orders fulfilled"
        />
        <StatCard
          icon="🍴"
          label="Menu Items"
          value={menuItems.length}
          sub={`${availableItems} available`}
        />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--color-text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            {
              href: "/orders",
              label: "📋 Manage Orders",
              pending: pendingOrders.length,
            },
            { href: "/menus", label: "🍽 Edit Menu" },
            { href: "/receipts", label: "🧾 View Receipts" },
          ].map(({ href, label, pending }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                borderRadius: "10px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              {label}
              {pending !== undefined && pending > 0 && (
                <span
                  style={{
                    background: "var(--color-accent)",
                    color: "var(--color-ink)",
                    borderRadius: "10px",
                    padding: "2px 7px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {pending}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--color-text-muted)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Recent Orders
          </h2>
          <Link
            href="/orders"
            style={{
              color: "var(--color-accent)",
              fontSize: "13px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "32px",
              textAlign: "center",
              color: "var(--color-text-muted)",
              fontSize: "14px",
            }}
          >
            No orders yet
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "13px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                      }}
                    >
                      {order.userName}
                    </td>
                    <td style={{ color: "var(--color-text-muted)" }}>
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--color-accent)",
                      }}
                    >
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge badge-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "13px",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
