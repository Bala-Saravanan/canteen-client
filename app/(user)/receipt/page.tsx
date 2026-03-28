"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getReceiptByOrderApi } from "@/lib/orders";
import { Receipt } from "@/types";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReceipt = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const res = await getReceiptByOrderApi(orderId);
      if (res.success && res.data) setReceipt(res.data);
    } catch {
      toast.error("Receipt not found");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchReceipt();
  }, [fetchReceipt]);

  if (loading) return <Loader fullscreen />;
  if (!orderId)
    return (
      <EmptyState
        icon="🔍"
        title="No order specified"
        description="Please navigate from your orders page."
      />
    );
  if (!receipt)
    return (
      <EmptyState
        icon="🧾"
        title="Receipt not found"
        description="This receipt hasn't been generated yet."
      />
    );

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ marginBottom: "28px" }}>
        <Link
          href="/orders"
          style={{
            color: "var(--color-text-muted)",
            fontSize: "13px",
            textDecoration: "none",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
          }}
        >
          ← Back to Orders
        </Link>
      </div>

      {/* Receipt card */}
      <div
        className="card animate-fade-up"
        style={{ padding: "36px", position: "relative", overflow: "hidden" }}
      >
        {/* Decorative top strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, var(--color-accent), #f4d03f)",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🍽</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "4px",
            }}
          >
            Canteen Receipt
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
            {new Date(receipt.generatedAt).toLocaleString("en-IN", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Receipt meta */}
        <div
          style={{
            background: "var(--color-surface-raised)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {[
            {
              label: "Receipt ID",
              value: `#${receipt.id.slice(-8).toUpperCase()}`,
            },
            {
              label: "Order ID",
              value: `#${receipt.orderId.slice(-8).toUpperCase()}`,
            },
            { label: "Customer", value: receipt.userName },
            { label: "Email", value: receipt.userEmail },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "3px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--color-text)",
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Dashed separator */}
        <div
          style={{
            borderTop: "2px dashed var(--color-border)",
            marginBottom: "20px",
          }}
        />

        {/* Items */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Item
            </span>
            <span
              style={{
                fontSize: "11px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text-dim)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Amount
            </span>
          </div>
          {receipt.items.map((item) => (
            <div
              key={item.menuId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {item.menuName}
                </p>
                <p
                  style={{ color: "var(--color-text-muted)", fontSize: "12px" }}
                >
                  ₹{item.price} × {item.quantity}
                </p>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                ₹{item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Dashed separator */}
        <div
          style={{
            borderTop: "2px dashed var(--color-border)",
            marginBottom: "20px",
          }}
        />

        {/* Total */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Total Paid
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "26px",
              color: "var(--color-accent)",
            }}
          >
            ₹{receipt.totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Footer stamp */}
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 20px",
              border: "2px solid var(--color-success)",
              borderRadius: "6px",
              color: "var(--color-success)",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ✓ Paid
          </span>
          <p
            style={{
              color: "var(--color-text-dim)",
              fontSize: "12px",
              marginTop: "12px",
            }}
          >
            Thank you for dining with us!
          </p>
        </div>
      </div>
    </div>
  );
}
