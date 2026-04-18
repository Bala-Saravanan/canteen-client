// "use client";
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import {
//   getAllOrdersApi,
//   updateOrderStatusApi,
//   generateReceiptApi,
// } from "@/lib/orders";
// import { Order } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<
//     "all" | "pending" | "completed"
//   >("all");
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await getAllOrdersApi();
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

//   const handleGenerateReceipt = async (orderId: string) => {
//     setProcessingId(orderId);
//     try {
//       const res = await generateReceiptApi(orderId);
//       if (res.success) {
//         toast.success("Receipt generated!");
//         setOrders((prev) =>
//           prev.map((o) =>
//             o.id === orderId ? { ...o, status: "completed" } : o,
//           ),
//         );
//       }
//     } catch (err: unknown) {
//       const msg =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Failed to generate receipt";
//       toast.error(msg);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const handleStatusUpdate = async (
//     orderId: string,
//     status: "pending" | "completed",
//   ) => {
//     setProcessingId(orderId);
//     try {
//       const res = await updateOrderStatusApi(orderId, status);
//       if (res.success && res.data) {
//         setOrders((prev) =>
//           prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
//         );
//         toast.success(`Order marked as ${status}`);
//       }
//     } catch {
//       toast.error("Failed to update status");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filters = [
//     { key: "all" as const, label: "All", count: orders.length },
//     {
//       key: "pending" as const,
//       label: "Pending",
//       count: orders.filter((o) => o.status === "pending").length,
//     },
//     {
//       key: "completed" as const,
//       label: "Completed",
//       count: orders.filter((o) => o.status === "completed").length,
//     },
//   ];

//   const filtered =
//     activeFilter === "all"
//       ? orders
//       : orders.filter((o) => o.status === activeFilter);

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div>
//       <div style={{ marginBottom: "28px" }}>
//         <h1
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: "28px",
//             fontWeight: 800,
//             letterSpacing: "-0.03em",
//             marginBottom: "6px",
//           }}
//         >
//           Orders
//         </h1>
//         <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//           Manage and fulfil all customer orders
//         </p>
//       </div>

//       {/* Filter tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: "4px",
//           marginBottom: "24px",
//           background: "var(--color-surface)",
//           borderRadius: "12px",
//           padding: "4px",
//           width: "fit-content",
//           border: "1px solid var(--color-border)",
//         }}
//       >
//         {filters.map(({ key, label, count }) => (
//           <button
//             key={key}
//             onClick={() => setActiveFilter(key)}
//             style={{
//               padding: "7px 18px",
//               borderRadius: "9px",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.15s",
//               fontFamily: "var(--font-display)",
//               fontWeight: 700,
//               fontSize: "13px",
//               background:
//                 activeFilter === key
//                   ? "var(--color-surface-high)"
//                   : "transparent",
//               color:
//                 activeFilter === key
//                   ? "var(--color-text)"
//                   : "var(--color-text-muted)",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             {label}
//             <span
//               style={{
//                 background:
//                   activeFilter === key
//                     ? "var(--color-accent)"
//                     : "var(--color-border)",
//                 color:
//                   activeFilter === key
//                     ? "var(--color-ink)"
//                     : "var(--color-text-muted)",
//                 borderRadius: "10px",
//                 padding: "1px 7px",
//                 fontSize: "11px",
//               }}
//             >
//               {count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState
//           icon="📋"
//           title="No orders"
//           description="Orders will appear here once customers start placing them."
//         />
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {filtered.map((order) => {
//             const expanded = expandedId === order.id;
//             const processing = processingId === order.id;
//             return (
//               <div
//                 key={order.id}
//                 className="card"
//                 style={{ overflow: "hidden" }}
//               >
//                 {/* Row header */}
//                 <div
//                   onClick={() => setExpandedId(expanded ? null : order.id)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "16px",
//                     padding: "18px 20px",
//                     cursor: "pointer",
//                     transition: "background 0.15s",
//                   }}
//                 >
//                   {/* Toggle arrow */}
//                   <span
//                     style={{
//                       color: "var(--color-text-dim)",
//                       fontSize: "12px",
//                       transition: "transform 0.2s",
//                       transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
//                       flexShrink: 0,
//                     }}
//                   >
//                     ▶
//                   </span>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "14px",
//                         }}
//                       >
//                         #{order.id.slice(-8).toUpperCase()}
//                       </span>
//                       <span className={`badge badge-${order.status}`}>
//                         {order.status}
//                       </span>
//                     </div>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "13px",
//                         marginTop: "2px",
//                       }}
//                     >
//                       {order.userName} · {order.items.length} item
//                       {order.items.length !== 1 ? "s" : ""} ·{" "}
//                       {new Date(order.createdAt).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>

//                   <span
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 800,
//                       fontSize: "18px",
//                       color: "var(--color-accent)",
//                       flexShrink: 0,
//                     }}
//                   >
//                     ₹{order.totalAmount.toFixed(2)}
//                   </span>

//                   {/* Action buttons */}
//                   <div
//                     style={{ display: "flex", gap: "8px", flexShrink: 0 }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {order.status === "pending" && (
//                       <button
//                         className="btn-primary"
//                         style={{ padding: "7px 14px", fontSize: "13px" }}
//                         onClick={() => handleGenerateReceipt(order.id)}
//                         disabled={processing}
//                       >
//                         {processing ? (
//                           <span
//                             className="spinner"
//                             style={{
//                               width: "14px",
//                               height: "14px",
//                               borderWidth: "2px",
//                             }}
//                           />
//                         ) : (
//                           "🧾 Generate Receipt"
//                         )}
//                       </button>
//                     )}
//                     {order.status === "completed" && (
//                       <span
//                         style={{
//                           color: "var(--color-success)",
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "13px",
//                         }}
//                       >
//                         ✓ Receipt Generated
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Expanded detail */}
//                 {expanded && (
//                   <div
//                     style={{
//                       borderTop: "1px solid var(--color-border)",
//                       background: "var(--color-surface-raised)",
//                       padding: "16px 20px",
//                     }}
//                   >
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "12px",
//                         color: "var(--color-text-dim)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.07em",
//                         marginBottom: "12px",
//                       }}
//                     >
//                       Order Items
//                     </p>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "8px",
//                       }}
//                     >
//                       {order.items.map((item) => (
//                         <div
//                           key={item.menuId}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "10px",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 width: "24px",
//                                 height: "24px",
//                                 borderRadius: "6px",
//                                 background: "var(--color-accent-dim)",
//                                 color: "var(--color-accent)",
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 700,
//                                 fontSize: "12px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               {item.quantity}×
//                             </span>
//                             <span
//                               style={{
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 600,
//                                 fontSize: "14px",
//                               }}
//                             >
//                               {item.menuName}
//                             </span>
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               gap: "16px",
//                               alignItems: "center",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 color: "var(--color-text-muted)",
//                                 fontSize: "13px",
//                               }}
//                             >
//                               ₹{item.price} each
//                             </span>
//                             <span
//                               style={{
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               ₹{item.subtotal.toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getAllOrdersApi, generateReceiptApi } from "@/lib/orders";
// import { Order } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// const ORDER_TYPE_META: Record<string, { icon: string; label: string }> = {
//   "dine-in": { icon: "🪑", label: "Dine In" },
//   "take-away": { icon: "🥡", label: "Take Away" },
// };
// const PAYMENT_META: Record<string, { icon: string; label: string }> = {
//   upi: { icon: "📲", label: "UPI" },
//   cash: { icon: "💵", label: "Cash" },
// };

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<
//     "all" | "pending" | "completed"
//   >("all");
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await getAllOrdersApi();
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

//   const handleGenerateReceipt = async (orderId: string) => {
//     setProcessingId(orderId);
//     try {
//       const res = await generateReceiptApi(orderId);
//       if (res.success) {
//         toast.success("Receipt generated!");
//         setOrders((prev) =>
//           prev.map((o) =>
//             o.id === orderId ? { ...o, status: "completed" } : o,
//           ),
//         );
//       }
//     } catch (err: unknown) {
//       const msg =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Failed to generate receipt";
//       toast.error(msg);
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filters = [
//     { key: "all" as const, label: "All", count: orders.length },
//     {
//       key: "pending" as const,
//       label: "Pending",
//       count: orders.filter((o) => o.status === "pending").length,
//     },
//     {
//       key: "completed" as const,
//       label: "Completed",
//       count: orders.filter((o) => o.status === "completed").length,
//     },
//   ];
//   const filtered =
//     activeFilter === "all"
//       ? orders
//       : orders.filter((o) => o.status === activeFilter);

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div>
//       <div style={{ marginBottom: "28px" }}>
//         <h1
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: "28px",
//             fontWeight: 800,
//             letterSpacing: "-0.03em",
//             marginBottom: "6px",
//           }}
//         >
//           Orders
//         </h1>
//         <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//           Manage and fulfil all customer orders
//         </p>
//       </div>

//       {/* Filter tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: "4px",
//           marginBottom: "24px",
//           background: "var(--color-surface)",
//           borderRadius: "12px",
//           padding: "4px",
//           width: "fit-content",
//           border: "1px solid var(--color-border)",
//         }}
//       >
//         {filters.map(({ key, label, count }) => (
//           <button
//             key={key}
//             onClick={() => setActiveFilter(key)}
//             style={{
//               padding: "7px 18px",
//               borderRadius: "9px",
//               border: "none",
//               cursor: "pointer",
//               transition: "all 0.15s",
//               fontFamily: "var(--font-display)",
//               fontWeight: 700,
//               fontSize: "13px",
//               background:
//                 activeFilter === key
//                   ? "var(--color-surface-high)"
//                   : "transparent",
//               color:
//                 activeFilter === key
//                   ? "var(--color-text)"
//                   : "var(--color-text-muted)",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             {label}
//             <span
//               style={{
//                 background:
//                   activeFilter === key
//                     ? "var(--color-accent)"
//                     : "var(--color-border)",
//                 color:
//                   activeFilter === key
//                     ? "var(--color-ink)"
//                     : "var(--color-text-muted)",
//                 borderRadius: "10px",
//                 padding: "1px 7px",
//                 fontSize: "11px",
//               }}
//             >
//               {count}
//             </span>
//           </button>
//         ))}
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState
//           icon="📋"
//           title="No orders"
//           description="Orders will appear here once customers start placing them."
//         />
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {filtered.map((order) => {
//             const expanded = expandedId === order.id;
//             const processing = processingId === order.id;
//             const ot = ORDER_TYPE_META[order.orderType];
//             const pm = PAYMENT_META[order.paymentMethod];
//             return (
//               <div
//                 key={order.id}
//                 className="card"
//                 style={{ overflow: "hidden" }}
//               >
//                 {/* Collapsed row */}
//                 <div
//                   onClick={() => setExpandedId(expanded ? null : order.id)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "16px",
//                     padding: "18px 20px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   <span
//                     style={{
//                       color: "var(--color-text-dim)",
//                       fontSize: "12px",
//                       transition: "transform 0.2s",
//                       transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
//                       flexShrink: 0,
//                     }}
//                   >
//                     ▶
//                   </span>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                         flexWrap: "wrap",
//                         marginBottom: "4px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "14px",
//                         }}
//                       >
//                         #{order.id.slice(-8).toUpperCase()}
//                       </span>
//                       <span className={`badge badge-${order.status}`}>
//                         {order.status}
//                       </span>
//                     </div>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "13px",
//                       }}
//                     >
//                       {order.userName} · {order.items.length} item
//                       {order.items.length !== 1 ? "s" : ""} ·{" "}
//                       {new Date(order.createdAt).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>

//                   {/* Order type + payment info columns */}
//                   <div
//                     style={{ display: "flex", gap: "8px", flexShrink: 0 }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <span
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: "5px",
//                         padding: "5px 12px",
//                         borderRadius: "20px",
//                         fontSize: "12px",
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                         background: "var(--color-surface-high)",
//                         color: "var(--color-text-muted)",
//                         border: "1px solid var(--color-border)",
//                       }}
//                     >
//                       {ot?.icon} {ot?.label}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: "5px",
//                         padding: "5px 12px",
//                         borderRadius: "20px",
//                         fontSize: "12px",
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                         background: "var(--color-surface-high)",
//                         color: "var(--color-text-muted)",
//                         border: "1px solid var(--color-border)",
//                       }}
//                     >
//                       {pm?.icon} {pm?.label}
//                     </span>
//                   </div>

//                   <span
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 800,
//                       fontSize: "18px",
//                       color: "var(--color-accent)",
//                       flexShrink: 0,
//                     }}
//                   >
//                     ₹{order.totalAmount.toFixed(2)}
//                   </span>

//                   {/* Action */}
//                   <div
//                     style={{ flexShrink: 0 }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {order.status === "pending" ? (
//                       <button
//                         className="btn-primary"
//                         style={{ padding: "7px 14px", fontSize: "13px" }}
//                         onClick={() => handleGenerateReceipt(order.id)}
//                         disabled={processing}
//                       >
//                         {processing ? (
//                           <span
//                             className="spinner"
//                             style={{
//                               width: "14px",
//                               height: "14px",
//                               borderWidth: "2px",
//                             }}
//                           />
//                         ) : (
//                           "🧾 Generate Receipt"
//                         )}
//                       </button>
//                     ) : (
//                       <span
//                         style={{
//                           color: "var(--color-success)",
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "13px",
//                         }}
//                       >
//                         ✓ Done
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Expanded detail */}
//                 {expanded && (
//                   <div
//                     style={{
//                       borderTop: "1px solid var(--color-border)",
//                       background: "var(--color-surface-raised)",
//                       padding: "20px",
//                     }}
//                   >
//                     {/* Order info row */}
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                           "repeat(auto-fill, minmax(160px, 1fr))",
//                         gap: "12px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       {[
//                         { label: "Customer", value: order.userName },
//                         {
//                           label: "Order Type",
//                           value: `${ot?.icon} ${ot?.label}`,
//                         },
//                         { label: "Payment", value: `${pm?.icon} ${pm?.label}` },
//                         {
//                           label: "Placed At",
//                           value: new Date(order.createdAt).toLocaleString(
//                             "en-IN",
//                             { dateStyle: "medium", timeStyle: "short" },
//                           ),
//                         },
//                       ].map(({ label, value }) => (
//                         <div key={label}>
//                           <p
//                             style={{
//                               fontSize: "11px",
//                               fontFamily: "var(--font-display)",
//                               color: "var(--color-text-dim)",
//                               textTransform: "uppercase",
//                               letterSpacing: "0.06em",
//                               marginBottom: "3px",
//                             }}
//                           >
//                             {label}
//                           </p>
//                           <p
//                             style={{
//                               fontFamily: "var(--font-display)",
//                               fontWeight: 600,
//                               fontSize: "13px",
//                             }}
//                           >
//                             {value}
//                           </p>
//                         </div>
//                       ))}
//                     </div>

//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "12px",
//                         color: "var(--color-text-dim)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.07em",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       Items
//                     </p>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "8px",
//                       }}
//                     >
//                       {order.items.map((item) => (
//                         <div
//                           key={item.menuId}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                           }}
//                         >
//                           <div
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "10px",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 width: "24px",
//                                 height: "24px",
//                                 borderRadius: "6px",
//                                 background: "var(--color-accent-dim)",
//                                 color: "var(--color-accent)",
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 700,
//                                 fontSize: "12px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                               }}
//                             >
//                               {item.quantity}×
//                             </span>
//                             <span
//                               style={{
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 600,
//                                 fontSize: "14px",
//                               }}
//                             >
//                               {item.menuName}
//                             </span>
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               gap: "16px",
//                               alignItems: "center",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 color: "var(--color-text-muted)",
//                                 fontSize: "13px",
//                               }}
//                             >
//                               ₹{item.price} each
//                             </span>
//                             <span
//                               style={{
//                                 fontFamily: "var(--font-display)",
//                                 fontWeight: 700,
//                               }}
//                             >
//                               ₹{item.subtotal.toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getAllOrdersApi,
  generateReceiptApi,
  notifyOrderReadyApi,
} from "@/lib/orders";
import { Order } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

const ORDER_TYPE_META: Record<string, { icon: string; label: string }> = {
  "dine-in": { icon: "🪑", label: "Dine In" },
  "take-away": { icon: "🥡", label: "Take Away" },
};
const PAYMENT_META: Record<string, { icon: string; label: string }> = {
  upi: { icon: "📲", label: "UPI" },
  cash: { icon: "💵", label: "Cash" },
};

type ActionType = "notify" | "receipt";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Track which button is processing per order: { orderId: 'notify' | 'receipt' }
  const [processing, setProcessing] = useState<Record<string, ActionType>>({});
  // Track which orders have had the notification sent this session
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const fetchOrders = useCallback(async () => {
    try {
      const res = await getAllOrdersApi();
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

  const setAction = (orderId: string, action: ActionType | null) => {
    setProcessing((prev) => {
      const next = { ...prev };
      if (action === null) delete next[orderId];
      else next[orderId] = action;
      return next;
    });
  };

  const handleNotify = async (orderId: string) => {
    setAction(orderId, "notify");
    try {
      const res = await notifyOrderReadyApi(orderId);
      if (res.success) {
        toast.success("📧 Email notification sent to customer!");
        setNotified((prev) => new Set(prev).add(orderId));
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to send notification";
      toast.error(msg);
    } finally {
      setAction(orderId, null);
    }
  };

  const handleGenerateReceipt = async (orderId: string) => {
    setAction(orderId, "receipt");
    try {
      const res = await generateReceiptApi(orderId);
      if (res.success) {
        toast.success("🧾 Receipt generated!");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "completed" } : o,
          ),
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to generate receipt";
      toast.error(msg);
    } finally {
      setAction(orderId, null);
    }
  };

  const filters = [
    { key: "all" as const, label: "All", count: orders.length },
    {
      key: "pending" as const,
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      key: "completed" as const,
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
  ];
  const filtered =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  if (loading) return <Loader fullscreen />;

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "6px",
          }}
        >
          Orders
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          Manage and fulfil all customer orders
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          background: "var(--color-surface)",
          borderRadius: "12px",
          padding: "4px",
          width: "fit-content",
          border: "1px solid var(--color-border)",
        }}
      >
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            style={{
              padding: "7px 18px",
              borderRadius: "9px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "13px",
              background:
                activeFilter === key
                  ? "var(--color-surface-high)"
                  : "transparent",
              color:
                activeFilter === key
                  ? "var(--color-text)"
                  : "var(--color-text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {label}
            <span
              style={{
                background:
                  activeFilter === key
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                color:
                  activeFilter === key
                    ? "var(--color-ink)"
                    : "var(--color-text-muted)",
                borderRadius: "10px",
                padding: "1px 7px",
                fontSize: "11px",
              }}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No orders"
          description="Orders will appear here once customers start placing them."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((order) => {
            const expanded = expandedId === order.id;
            const currentAction = processing[order.id];
            const hasBeenNotified = notified.has(order.id);
            const ot = ORDER_TYPE_META[order.orderType];
            const pm = PAYMENT_META[order.paymentMethod];

            return (
              <div
                key={order.id}
                className="card"
                style={{ overflow: "hidden" }}
              >
                {/* Row */}
                <div
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "18px 20px",
                    cursor: "pointer",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-dim)",
                      fontSize: "12px",
                      transition: "transform 0.2s",
                      transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  >
                    ▶
                  </span>

                  {/* Order info */}
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`badge badge-${order.status}`}>
                        {order.status}
                      </span>
                      {hasBeenNotified && order.status === "pending" && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            background: "rgba(61,214,140,0.12)",
                            color: "var(--color-success)",
                            border: "1px solid rgba(61,214,140,0.25)",
                          }}
                        >
                          ✉ Notified
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "13px",
                      }}
                    >
                      {order.userName} · {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""} ·{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Chips */}
                  <div
                    style={{ display: "flex", gap: "8px", flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 12px",
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
                        padding: "5px 12px",
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

                  {/* Total */}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 800,
                      fontSize: "18px",
                      color: "var(--color-accent)",
                      flexShrink: 0,
                    }}
                  >
                    ₹{order.totalAmount.toFixed(2)}
                  </span>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexShrink: 0,
                      flexWrap: "wrap",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.status === "pending" && (
                      <>
                        {/* Order Ready / Notify button */}
                        <button
                          onClick={() => handleNotify(order.id)}
                          disabled={!!currentAction}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "7px 14px",
                            borderRadius: "8px",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "13px",
                            cursor: currentAction ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            background: hasBeenNotified
                              ? "rgba(61,214,140,0.12)"
                              : "rgba(61,214,140,0.15)",
                            color: "var(--color-success)",
                            border: `1px solid rgba(61,214,140,${hasBeenNotified ? "0.2" : "0.3"})`,
                            opacity:
                              currentAction && currentAction !== "notify"
                                ? 0.5
                                : 1,
                          }}
                        >
                          {currentAction === "notify" ? (
                            <>
                              <span
                                className="spinner"
                                style={{
                                  width: "13px",
                                  height: "13px",
                                  borderWidth: "2px",
                                  borderTopColor: "var(--color-success)",
                                }}
                              />{" "}
                              Sending…
                            </>
                          ) : hasBeenNotified ? (
                            "✉ Resend Notification"
                          ) : (
                            "🔔 Order Ready"
                          )}
                        </button>

                        {/* Generate Receipt button */}
                        <button
                          className="btn-primary"
                          style={{
                            padding: "7px 14px",
                            fontSize: "13px",
                            opacity:
                              currentAction && currentAction !== "receipt"
                                ? 0.5
                                : 1,
                          }}
                          onClick={() => handleGenerateReceipt(order.id)}
                          disabled={!!currentAction}
                        >
                          {currentAction === "receipt" ? (
                            <>
                              <span
                                className="spinner"
                                style={{
                                  width: "13px",
                                  height: "13px",
                                  borderWidth: "2px",
                                }}
                              />{" "}
                              Processing…
                            </>
                          ) : (
                            "🧾 Generate Receipt"
                          )}
                        </button>
                      </>
                    )}

                    {order.status === "completed" && (
                      <span
                        style={{
                          color: "var(--color-success)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div
                    style={{
                      borderTop: "1px solid var(--color-border)",
                      background: "var(--color-surface-raised)",
                      padding: "20px",
                    }}
                  >
                    {/* Info grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: "12px",
                        marginBottom: "20px",
                      }}
                    >
                      {[
                        { label: "Customer", value: order.userName },
                        {
                          label: "Order Type",
                          value: `${ot?.icon} ${ot?.label}`,
                        },
                        { label: "Payment", value: `${pm?.icon} ${pm?.label}` },
                        {
                          label: "Placed At",
                          value: new Date(order.createdAt).toLocaleString(
                            "en-IN",
                            { dateStyle: "medium", timeStyle: "short" },
                          ),
                        },
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
                              fontSize: "13px",
                            }}
                          >
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "12px",
                        color: "var(--color-text-dim)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: "10px",
                      }}
                    >
                      Items
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {order.items.map((item) => (
                        <div
                          key={item.menuId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                          <div
                            style={{
                              display: "flex",
                              gap: "16px",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--color-text-muted)",
                                fontSize: "13px",
                              }}
                            >
                              ₹{item.price} each
                            </span>
                            <span
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                              }}
                            >
                              ₹{item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notification hint */}
                    {order.status === "pending" && (
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          background: "rgba(244,164,53,0.06)",
                          border: "1px solid rgba(244,164,53,0.15)",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>💡</span>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--color-text-muted)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          Click{" "}
                          <strong style={{ color: "var(--color-text)" }}>
                            Order Ready
                          </strong>{" "}
                          to send an email notification to{" "}
                          <strong style={{ color: "var(--color-accent)" }}>
                            {order.userName}
                          </strong>{" "}
                          that their order is prepared. Then click{" "}
                          <strong style={{ color: "var(--color-text)" }}>
                            Generate Receipt
                          </strong>{" "}
                          to mark it as completed.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
