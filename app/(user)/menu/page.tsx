"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getMenuApi } from "@/lib/menu";
import { placeOrderApi } from "@/lib/orders";
import { MenuItem, OrderItem } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

interface CartItem extends MenuItem {
  quantity: number;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchMenu = useCallback(async () => {
    try {
      const res = await getMenuApi();
      if (res.success && res.data) setItems(res.data);
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing && existing.quantity > 1)
        return prev.map((c) =>
          c.id === id ? { ...c, quantity: c.quantity - 1 } : c,
        );
      return prev.filter((c) => c.id !== id);
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setPlacing(true);
    try {
      const orderItems: OrderItem[] = cart.map((c) => ({
        menuId: c.id,
        quantity: c.quantity,
      }));
      const res = await placeOrderApi(orderItems);
      if (res.success) {
        toast.success("Order placed successfully! 🎉");
        setCart([]);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to place order";
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader fullscreen />;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "32px",
        alignItems: "start",
      }}
    >
      {/* Left: Menu */}
      <div>
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 800,
              marginBottom: "6px",
              letterSpacing: "-0.03em",
            }}
          >
            Today&apos;s Menu
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
            {items.length} items available
          </p>
        </div>

        {/* Category filter */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: "1px solid",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.15s",
                background:
                  activeCategory === cat
                    ? "var(--color-accent)"
                    : "transparent",
                color:
                  activeCategory === cat
                    ? "var(--color-ink)"
                    : "var(--color-text-muted)",
                borderColor:
                  activeCategory === cat
                    ? "var(--color-accent)"
                    : "var(--color-border)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="🍽"
            title="No items available"
            description="Check back later for more options"
          />
        ) : (
          <div
            className="stagger"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {filtered.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="animate-fade-up card"
                  style={{
                    padding: "20px",
                    opacity: item.isAvailable ? 1 : 0.5,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "var(--font-display)",
                        color: "var(--color-text-dim)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`badge ${item.isAvailable ? "badge-available" : "badge-unavailable"}`}
                    >
                      {item.isAvailable ? "Available" : "Sold out"}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "18px",
                      marginBottom: "16px",
                    }}
                  >
                    ₹{item.price.toFixed(2)}
                  </p>
                  {inCart ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface-raised)",
                          color: "var(--color-text)",
                          fontSize: "18px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "16px",
                          minWidth: "24px",
                          textAlign: "center",
                        }}
                      >
                        {inCart.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "none",
                          background: "var(--color-accent)",
                          color: "var(--color-ink)",
                          fontSize: "18px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-ghost"
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        padding: "8px 0",
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Cart */}
      <div
        className="card"
        style={{ padding: "24px", position: "sticky", top: "80px" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "18px",
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}
        >
          Cart{" "}
          {cartCount > 0 && (
            <span style={{ color: "var(--color-accent)", fontSize: "14px" }}>
              ({cartCount})
            </span>
          )}
        </h2>

        {cart.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--color-text-dim)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
            <p style={{ fontSize: "13px", fontFamily: "var(--font-display)" }}>
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "12px",
                      }}
                    >
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "var(--color-accent)",
                      }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "16px",
                marginBottom: "16px",
              }}
            >
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
                    fontWeight: 600,
                    color: "var(--color-text-muted)",
                    fontSize: "14px",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "20px",
                    color: "var(--color-accent)",
                  }}
                >
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={placeOrder}
              disabled={placing}
              style={{ width: "100%", padding: "13px" }}
            >
              {placing ? (
                <>
                  <span
                    className="spinner"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderWidth: "2px",
                    }}
                  />{" "}
                  Placing…
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
