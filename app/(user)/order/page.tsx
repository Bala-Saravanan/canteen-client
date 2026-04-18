// "use client";
// import { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { getMyOrdersApi } from "@/lib/orders";
// import { Order } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// export default function MyOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await getMyOrdersApi();
//       if (res.success && res.data) setOrders(res.data);
//     } catch {
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div>
//       <div style={{ marginBottom: "32px" }}>
//         <h1
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: "28px",
//             fontWeight: 800,
//             letterSpacing: "-0.03em",
//             marginBottom: "6px",
//           }}
//         >
//           My Orders
//         </h1>
//         <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//           {orders.length} order{orders.length !== 1 ? "s" : ""} placed
//         </p>
//       </div>

//       {orders.length === 0 ? (
//         <EmptyState
//           icon="🧾"
//           title="No orders yet"
//           description="Head to the menu and place your first order!"
//         />
//       ) : (
//         <div
//           className="stagger"
//           style={{ display: "flex", flexDirection: "column", gap: "16px" }}
//         >
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="animate-fade-up card"
//               style={{ padding: "24px" }}
//             >
//               {/* Header */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <div>
//                   <p
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 700,
//                       fontSize: "15px",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     Order #{order.id.slice(-8).toUpperCase()}
//                   </p>
//                   <p
//                     style={{
//                       color: "var(--color-text-muted)",
//                       fontSize: "13px",
//                     }}
//                   >
//                     {new Date(order.createdAt).toLocaleString("en-IN", {
//                       dateStyle: "medium",
//                       timeStyle: "short",
//                     })}
//                   </p>
//                 </div>
//                 <div
//                   style={{ display: "flex", alignItems: "center", gap: "10px" }}
//                 >
//                   <span className={`badge badge-${order.status}`}>
//                     {order.status}
//                   </span>
//                   {order.status === "completed" && (
//                     <Link
//                       href={`/receipt?orderId=${order.id}`}
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                         fontSize: "13px",
//                         color: "var(--color-accent)",
//                         textDecoration: "none",
//                         padding: "4px 12px",
//                         borderRadius: "8px",
//                         border: "1px solid rgba(244,164,53,0.3)",
//                         background: "rgba(244,164,53,0.08)",
//                         transition: "all 0.15s",
//                       }}
//                     >
//                       View Receipt
//                     </Link>
//                   )}
//                 </div>
//               </div>

//               {/* Items */}
//               <div
//                 style={{
//                   background: "var(--color-surface-raised)",
//                   borderRadius: "10px",
//                   overflow: "hidden",
//                   border: "1px solid var(--color-border)",
//                   marginBottom: "16px",
//                 }}
//               >
//                 {order.items.map((item, idx) => (
//                   <div
//                     key={item.menuId}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       padding: "12px 16px",
//                       borderBottom:
//                         idx < order.items.length - 1
//                           ? "1px solid var(--color-border)"
//                           : "none",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           width: "24px",
//                           height: "24px",
//                           borderRadius: "6px",
//                           background: "var(--color-accent-dim)",
//                           color: "var(--color-accent)",
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "12px",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         {item.quantity}×
//                       </span>
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 600,
//                           fontSize: "14px",
//                         }}
//                       >
//                         {item.menuName}
//                       </span>
//                     </div>
//                     <span
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "14px",
//                       }}
//                     >
//                       ₹{item.subtotal.toFixed(2)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Footer */}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <span
//                   style={{
//                     color: "var(--color-text-muted)",
//                     fontFamily: "var(--font-display)",
//                     fontSize: "13px",
//                   }}
//                 >
//                   Total
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 800,
//                     fontSize: "20px",
//                     color: "var(--color-accent)",
//                   }}
//                 >
//                   ₹{order.totalAmount.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getMyOrdersApi } from "@/lib/orders";
import { Order } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

const ORDER_TYPE_LABEL: Record<string, { icon: string; label: string }> = {
  "dine-in": { icon: "🪑", label: "Dine In" },
  "take-away": { icon: "🥡", label: "Take Away" },
};

const PAYMENT_LABEL: Record<string, { icon: string; label: string }> = {
  upi: { icon: "📲", label: "UPI" },
  cash: { icon: "💵", label: "Cash" },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getMyOrdersApi();
      if (res.success && res.data) setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <Loader fullscreen />;

  return (
    <div>
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
          My Orders
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No orders yet"
          description="Head to the menu and place your first order!"
        />
      ) : (
        <div
          className="stagger"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {orders.map((order) => {
            const ot = ORDER_TYPE_LABEL[order.orderType];
            const pm = PAYMENT_LABEL[order.paymentMethod];
            return (
              <div
                key={order.id}
                className="animate-fade-up card"
                style={{ padding: "24px" }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "13px",
                      }}
                    >
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span className={`badge badge-${order.status}`}>
                      {order.status}
                    </span>
                    {order.status === "completed" && (
                      <Link
                        href={`/receipt?orderId=${order.id}`}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "13px",
                          color: "var(--color-accent)",
                          textDecoration: "none",
                          padding: "4px 12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(244,164,53,0.3)",
                          background: "rgba(244,164,53,0.08)",
                        }}
                      >
                        View Receipt
                      </Link>
                    )}
                  </div>
                </div>

                {/* Order type + payment chips */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      background: "var(--color-surface-high)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {ot?.icon} {ot?.label}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      background: "var(--color-surface-high)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {pm?.icon} {pm?.label}
                  </span>
                </div>

                {/* Items */}
                <div
                  style={{
                    background: "var(--color-surface-raised)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    marginBottom: "16px",
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div
                      key={item.menuId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderBottom:
                          idx < order.items.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "6px",
                            background: "var(--color-accent-dim)",
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.quantity}×
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          {item.menuName}
                        </span>
                      </div>
                      <span
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "14px",
                        }}
                      >
                        ₹{item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
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
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
