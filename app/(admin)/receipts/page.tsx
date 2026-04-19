// "use client";
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getAllReceiptsApi } from "@/lib/orders";
// import { Receipt } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// export default function AdminReceiptsPage() {
//   const [receipts, setReceipts] = useState<Receipt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   const fetchReceipts = useCallback(async () => {
//     try {
//       const res = await getAllReceiptsApi();
//       if (res.success && res.data) setReceipts(res.data);
//     } catch {
//       toast.error("Failed to load receipts");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchReceipts();
//   }, [fetchReceipts]);

//   const filtered = receipts.filter(
//     (r) =>
//       r.userName.toLowerCase().includes(search.toLowerCase()) ||
//       r.orderId.slice(-8).toLowerCase().includes(search.toLowerCase()) ||
//       r.userEmail.toLowerCase().includes(search.toLowerCase()),
//   );

//   const totalRevenue = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div>
//       {/* Header */}
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
//           Receipts
//         </h1>
//         <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//           {receipts.length} receipt{receipts.length !== 1 ? "s" : ""} generated
//           &middot; Total revenue:{" "}
//           <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
//             ₹{totalRevenue.toFixed(2)}
//           </span>
//         </p>
//       </div>

//       {/* Search */}
//       <div style={{ marginBottom: "20px", maxWidth: "360px" }}>
//         <input
//           className="input-field"
//           type="text"
//           placeholder="Search by name, email or order ID…"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState
//           icon="🧾"
//           title={search ? "No results found" : "No receipts yet"}
//           description={
//             search
//               ? "Try a different search term."
//               : "Generate receipts from the Orders page."
//           }
//         />
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {filtered.map((receipt) => {
//             const expanded = expandedId === receipt.id;
//             return (
//               <div
//                 key={receipt.id}
//                 className="card"
//                 style={{ overflow: "hidden" }}
//               >
//                 {/* Row */}
//                 <div
//                   onClick={() => setExpandedId(expanded ? null : receipt.id)}
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

//                   {/* Receipt icon */}
//                   <div
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "10px",
//                       background: "var(--color-accent-dim)",
//                       flexShrink: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "18px",
//                     }}
//                   >
//                     🧾
//                   </div>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         marginBottom: "3px",
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
//                         {receipt.userName}
//                       </span>
//                       <span
//                         style={{
//                           color: "var(--color-text-dim)",
//                           fontSize: "12px",
//                         }}
//                       >
//                         {receipt.userEmail}
//                       </span>
//                     </div>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "13px",
//                       }}
//                     >
//                       Order #{receipt.orderId.slice(-8).toUpperCase()} ·{" "}
//                       {new Date(receipt.generatedAt).toLocaleString("en-IN", {
//                         dateStyle: "medium",
//                         timeStyle: "short",
//                       })}
//                     </p>
//                   </div>

//                   <div style={{ textAlign: "right", flexShrink: 0 }}>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 800,
//                         fontSize: "20px",
//                         color: "var(--color-accent)",
//                       }}
//                     >
//                       ₹{receipt.totalAmount.toFixed(2)}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "12px",
//                         color: "var(--color-success)",
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                       }}
//                     >
//                       ✓ Paid
//                     </p>
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
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                           "repeat(auto-fill, minmax(180px, 1fr))",
//                         gap: "12px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       {[
//                         {
//                           label: "Receipt ID",
//                           value: `#${receipt.id.slice(-8).toUpperCase()}`,
//                         },
//                         {
//                           label: "Order ID",
//                           value: `#${receipt.orderId.slice(-8).toUpperCase()}`,
//                         },
//                         { label: "Customer", value: receipt.userName },
//                         { label: "Email", value: receipt.userEmail },
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
//                       {receipt.items.map((item) => (
//                         <div
//                           key={item.menuId}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "10px 14px",
//                             background: "var(--color-surface)",
//                             borderRadius: "8px",
//                             border: "1px solid var(--color-border)",
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
//                             <div>
//                               <p
//                                 style={{
//                                   fontFamily: "var(--font-display)",
//                                   fontWeight: 600,
//                                   fontSize: "14px",
//                                 }}
//                               >
//                                 {item.menuName}
//                               </p>
//                               <p
//                                 style={{
//                                   color: "var(--color-text-muted)",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 ₹{item.price} each
//                               </p>
//                             </div>
//                           </div>
//                           <span
//                             style={{
//                               fontFamily: "var(--font-display)",
//                               fontWeight: 700,
//                               fontSize: "15px",
//                             }}
//                           >
//                             ₹{item.subtotal.toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         alignItems: "center",
//                         gap: "10px",
//                         marginTop: "16px",
//                         paddingTop: "16px",
//                         borderTop: "1px dashed var(--color-border)",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 600,
//                           color: "var(--color-text-muted)",
//                         }}
//                       >
//                         Grand Total
//                       </span>
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 800,
//                           fontSize: "22px",
//                           color: "var(--color-accent)",
//                         }}
//                       >
//                         ₹{receipt.totalAmount.toFixed(2)}
//                       </span>
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
// import { getAllReceiptsApi } from "@/lib/orders";
// import { Receipt } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// const ORDER_TYPE_META: Record<
//   string,
//   { icon: string; label: string; sub: string }
// > = {
//   "dine-in": { icon: "🪑", label: "Dine In", sub: "Served at table" },
//   "take-away": { icon: "🥡", label: "Take Away", sub: "Picked up at counter" },
// };
// const PAYMENT_META: Record<
//   string,
//   { icon: string; label: string; sub: string }
// > = {
//   upi: { icon: "📲", label: "UPI", sub: "Paid via UPI" },
//   cash: { icon: "💵", label: "Cash", sub: "Paid at counter" },
// };

// export default function AdminReceiptsPage() {
//   const [receipts, setReceipts] = useState<Receipt[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [search, setSearch] = useState("");

//   const fetchReceipts = useCallback(async () => {
//     try {
//       const res = await getAllReceiptsApi();
//       if (res.success && res.data) setReceipts(res.data);
//     } catch {
//       toast.error("Failed to load receipts");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchReceipts();
//   }, [fetchReceipts]);

//   const filtered = receipts.filter(
//     (r) =>
//       r.userName.toLowerCase().includes(search.toLowerCase()) ||
//       r.orderId.slice(-8).toLowerCase().includes(search.toLowerCase()) ||
//       r.userEmail.toLowerCase().includes(search.toLowerCase()),
//   );

//   const totalRevenue = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div>
//       {/* Header */}
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
//           Receipts
//         </h1>
//         <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//           {receipts.length} receipt{receipts.length !== 1 ? "s" : ""} · Total
//           revenue:{" "}
//           <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
//             ₹{totalRevenue.toFixed(2)}
//           </span>
//         </p>
//       </div>

//       {/* Search */}
//       <div style={{ marginBottom: "20px", maxWidth: "360px" }}>
//         <input
//           className="input-field"
//           type="text"
//           placeholder="Search by name, email or order ID…"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {filtered.length === 0 ? (
//         <EmptyState
//           icon="🧾"
//           title={search ? "No results found" : "No receipts yet"}
//           description={
//             search
//               ? "Try a different search term."
//               : "Generate receipts from the Orders page."
//           }
//         />
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//           {filtered.map((receipt) => {
//             const expanded = expandedId === receipt.id;
//             const ot = ORDER_TYPE_META[receipt.orderType];
//             const pm = PAYMENT_META[receipt.paymentMethod];
//             return (
//               <div
//                 key={receipt.id}
//                 className="card"
//                 style={{ overflow: "hidden" }}
//               >
//                 {/* Collapsed row */}
//                 <div
//                   onClick={() => setExpandedId(expanded ? null : receipt.id)}
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

//                   <div
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "10px",
//                       background: "var(--color-accent-dim)",
//                       flexShrink: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: "18px",
//                     }}
//                   >
//                     🧾
//                   </div>

//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         marginBottom: "3px",
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
//                         {receipt.userName}
//                       </span>
//                       <span
//                         style={{
//                           color: "var(--color-text-dim)",
//                           fontSize: "12px",
//                         }}
//                       >
//                         {receipt.userEmail}
//                       </span>
//                     </div>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "13px",
//                       }}
//                     >
//                       Order #{receipt.orderId.slice(-8).toUpperCase()} ·{" "}
//                       {new Date(receipt.generatedAt).toLocaleString("en-IN", {
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

//                   <div style={{ textAlign: "right", flexShrink: 0 }}>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 800,
//                         fontSize: "20px",
//                         color: "var(--color-accent)",
//                       }}
//                     >
//                       ₹{receipt.totalAmount.toFixed(2)}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "12px",
//                         color: "var(--color-success)",
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                       }}
//                     >
//                       ✓ Paid
//                     </p>
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
//                     {/* Receipt meta */}
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
//                         {
//                           label: "Receipt ID",
//                           value: `#${receipt.id.slice(-8).toUpperCase()}`,
//                         },
//                         {
//                           label: "Order ID",
//                           value: `#${receipt.orderId.slice(-8).toUpperCase()}`,
//                         },
//                         { label: "Customer", value: receipt.userName },
//                         { label: "Email", value: receipt.userEmail },
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

//                     {/* Order type + payment cards */}
//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "10px",
//                         marginBottom: "20px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           flex: 1,
//                           padding: "12px",
//                           borderRadius: "10px",
//                           background: "var(--color-surface)",
//                           border: "1px solid var(--color-border)",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "10px",
//                         }}
//                       >
//                         <span style={{ fontSize: "20px" }}>{ot?.icon}</span>
//                         <div>
//                           <p
//                             style={{
//                               fontFamily: "var(--font-display)",
//                               fontWeight: 700,
//                               fontSize: "13px",
//                             }}
//                           >
//                             {ot?.label}
//                           </p>
//                           <p
//                             style={{
//                               fontSize: "11px",
//                               color: "var(--color-text-dim)",
//                             }}
//                           >
//                             {ot?.sub}
//                           </p>
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           flex: 1,
//                           padding: "12px",
//                           borderRadius: "10px",
//                           background: "var(--color-surface)",
//                           border: "1px solid var(--color-border)",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "10px",
//                         }}
//                       >
//                         <span style={{ fontSize: "20px" }}>{pm?.icon}</span>
//                         <div>
//                           <p
//                             style={{
//                               fontFamily: "var(--font-display)",
//                               fontWeight: 700,
//                               fontSize: "13px",
//                             }}
//                           >
//                             {pm?.label}
//                           </p>
//                           <p
//                             style={{
//                               fontSize: "11px",
//                               color: "var(--color-text-dim)",
//                             }}
//                           >
//                             {pm?.sub}
//                           </p>
//                         </div>
//                       </div>
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
//                       {receipt.items.map((item) => (
//                         <div
//                           key={item.menuId}
//                           style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             padding: "10px 14px",
//                             background: "var(--color-surface)",
//                             borderRadius: "8px",
//                             border: "1px solid var(--color-border)",
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
//                             <div>
//                               <p
//                                 style={{
//                                   fontFamily: "var(--font-display)",
//                                   fontWeight: 600,
//                                   fontSize: "14px",
//                                 }}
//                               >
//                                 {item.menuName}
//                               </p>
//                               <p
//                                 style={{
//                                   color: "var(--color-text-muted)",
//                                   fontSize: "12px",
//                                 }}
//                               >
//                                 ₹{item.price} each
//                               </p>
//                             </div>
//                           </div>
//                           <span
//                             style={{
//                               fontFamily: "var(--font-display)",
//                               fontWeight: 700,
//                               fontSize: "15px",
//                             }}
//                           >
//                             ₹{item.subtotal.toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>

//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         alignItems: "center",
//                         gap: "10px",
//                         marginTop: "16px",
//                         paddingTop: "16px",
//                         borderTop: "1px dashed var(--color-border)",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 600,
//                           color: "var(--color-text-muted)",
//                         }}
//                       >
//                         Grand Total
//                       </span>
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 800,
//                           fontSize: "22px",
//                           color: "var(--color-accent)",
//                         }}
//                       >
//                         ₹{receipt.totalAmount.toFixed(2)}
//                       </span>
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
import { getAllReceiptsApi } from "@/lib/orders";
import { Receipt } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import Loader from "@/components/ui/Loader";

const ORDER_TYPE_META: Record<
  string,
  { icon: string; label: string; sub: string }
> = {
  "dine-in": { icon: "🪑", label: "Dine In", sub: "Served at table" },
  "take-away": { icon: "🥡", label: "Take Away", sub: "Picked up at counter" },
};
const PAYMENT_META: Record<
  string,
  { icon: string; label: string; sub: string }
> = {
  upi: { icon: "📲", label: "UPI", sub: "Paid via UPI" },
  cash: { icon: "💵", label: "Cash", sub: "Paid at counter" },
};

export default function AdminReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchReceipts = useCallback(async () => {
    try {
      const res = await getAllReceiptsApi();
      if (res.success && res.data) setReceipts(res.data);
    } catch {
      toast.error("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const filtered = receipts.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.slice(-8).toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()),
  );

  const totalRevenue = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

  if (loading) return <Loader fullscreen />;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "4px",
          }}
        >
          Receipts
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
          {receipts.length} receipt{receipts.length !== 1 ? "s" : ""} · Revenue:{" "}
          <span style={{ color: "var(--color-accent)", fontWeight: 700 }}>
            ₹{totalRevenue.toFixed(2)}
          </span>
        </p>
      </div>

      {/* ── Search — full-width on mobile ── */}
      <div style={{ marginBottom: "18px" }}>
        <input
          className="input-field"
          type="text"
          placeholder="Search by name, email or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "360px", width: "100%" }}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🧾"
          title={search ? "No results found" : "No receipts yet"}
          description={
            search
              ? "Try a different search term."
              : "Generate receipts from the Orders page."
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((receipt) => {
            const expanded = expandedId === receipt.id;
            const ot = ORDER_TYPE_META[receipt.orderType];
            const pm = PAYMENT_META[receipt.paymentMethod];

            return (
              <div
                key={receipt.id}
                className="card"
                style={{ overflow: "hidden" }}
              >
                {/* ── Collapsed row ── */}
                <div
                  onClick={() => setExpandedId(expanded ? null : receipt.id)}
                  style={{ padding: "16px 18px", cursor: "pointer" }}
                >
                  {/* Top: arrow + icon + info + amount */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    {/* Expand arrow */}
                    <span
                      style={{
                        color: "var(--color-text-dim)",
                        fontSize: "11px",
                        marginTop: "4px",
                        transition: "transform 0.2s",
                        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      ▶
                    </span>

                    {/* Receipt icon */}
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "var(--color-accent-dim)",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                      }}
                    >
                      🧾
                    </div>

                    {/* Name + order info — flex: 1 + minWidth: 0 prevents overflow */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                          marginBottom: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "14px",
                            flexShrink: 0,
                          }}
                        >
                          {receipt.userName}
                        </span>
                        {/*
                          Email: hidden on very small screens via CSS class,
                          shown in expanded detail instead
                        */}
                        <span
                          className="receipt-email"
                          style={{
                            color: "var(--color-text-dim)",
                            fontSize: "11px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            minWidth: 0,
                          }}
                        >
                          {receipt.userEmail}
                        </span>
                      </div>
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          fontSize: "12px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Order #{receipt.orderId.slice(-8).toUpperCase()} ·{" "}
                        {new Date(receipt.generatedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    {/* Amount — always visible, right-aligned */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "17px",
                          color: "var(--color-accent)",
                        }}
                      >
                        ₹{receipt.totalAmount.toFixed(2)}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "var(--color-success)",
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                        }}
                      >
                        ✓ Paid
                      </p>
                    </div>
                  </div>

                  {/*
                    Chips row:
                    - Desktop: paddingLeft: 58px aligns with the text block
                    - Mobile: remove the left indent so chips don't overflow
                  */}
                  <div
                    className="receipt-chips"
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "10px",
                      flexWrap: "wrap",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        background: "var(--color-surface-high)",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ot?.icon} {ot?.label}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        background: "var(--color-surface-high)",
                        color: "var(--color-text-muted)",
                        border: "1px solid var(--color-border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {pm?.icon} {pm?.label}
                    </span>
                  </div>
                </div>

                {/* ── Expanded detail ── */}
                {expanded && (
                  <div
                    style={{
                      borderTop: "1px solid var(--color-border)",
                      background: "var(--color-surface-raised)",
                      padding: "16px 18px",
                    }}
                  >
                    {/*
                      Meta grid:
                      - Desktop: auto-fill minmax(140px) → 3-4 cols
                      - Mobile (<400px): forced to 1 col via .receipt-meta-grid CSS class
                    */}
                    <div
                      className="receipt-meta-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(140px, 1fr))",
                        gap: "10px",
                        marginBottom: "16px",
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
                        <div key={label} style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "10px",
                              fontFamily: "var(--font-display)",
                              color: "var(--color-text-dim)",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              marginBottom: "2px",
                            }}
                          >
                            {label}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 600,
                              fontSize: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order type + payment cards — flex wrap so they stack on tiny screens */}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      {[{ meta: ot }, { meta: pm }].map(({ meta }, i) => (
                        <div
                          key={i}
                          style={{
                            flex: "1 1 130px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            background: "var(--color-surface)",
                            border: "1px solid var(--color-border)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "18px", flexShrink: 0 }}>
                            {meta?.icon}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "12px",
                              }}
                            >
                              {meta?.label}
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "var(--color-text-dim)",
                              }}
                            >
                              {meta?.sub}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "11px",
                        color: "var(--color-text-dim)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: "8px",
                      }}
                    >
                      Items
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      {receipt.items.map((item) => (
                        <div
                          key={item.menuId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            background: "var(--color-surface)",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                width: "22px",
                                height: "22px",
                                borderRadius: "6px",
                                background: "var(--color-accent-dim)",
                                color: "var(--color-accent)",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                fontSize: "11px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {item.quantity}×
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <p
                                style={{
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 600,
                                  fontSize: "13px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.menuName}
                              </p>
                              <p
                                style={{
                                  color: "var(--color-text-muted)",
                                  fontSize: "11px",
                                }}
                              >
                                ₹{item.price} each
                              </p>
                            </div>
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: "13px",
                              flexShrink: 0,
                            }}
                          >
                            ₹{item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "14px",
                        paddingTop: "14px",
                        borderTop: "1px dashed var(--color-border)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          color: "var(--color-text-muted)",
                          fontSize: "13px",
                        }}
                      >
                        Grand Total
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 800,
                          fontSize: "20px",
                          color: "var(--color-accent)",
                        }}
                      >
                        ₹{receipt.totalAmount.toFixed(2)}
                      </span>
                    </div>
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
