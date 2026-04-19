// "use client";
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getMenuApi } from "@/lib/menu";
// import { placeOrderApi } from "@/lib/orders";
// import { MenuItem, OrderItem } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// interface CartItem extends MenuItem {
//   quantity: number;
// }

// export default function MenuPage() {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [placing, setPlacing] = useState(false);
//   const [activeCategory, setActiveCategory] = useState("All");

//   const fetchMenu = useCallback(async () => {
//     try {
//       const res = await getMenuApi();
//       if (res.success && res.data) setItems(res.data);
//     } catch {
//       toast.error("Failed to load menu");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMenu();
//   }, [fetchMenu]);

//   const categories = [
//     "All",
//     ...Array.from(new Set(items.map((i) => i.category))),
//   ];
//   const filtered =
//     activeCategory === "All"
//       ? items
//       : items.filter((i) => i.category === activeCategory);

//   const addToCart = (item: MenuItem) => {
//     if (!item.isAvailable) return;
//     setCart((prev) => {
//       const existing = prev.find((c) => c.id === item.id);
//       if (existing)
//         return prev.map((c) =>
//           c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
//         );
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCart((prev) => {
//       const existing = prev.find((c) => c.id === id);
//       if (existing && existing.quantity > 1)
//         return prev.map((c) =>
//           c.id === id ? { ...c, quantity: c.quantity - 1 } : c,
//         );
//       return prev.filter((c) => c.id !== id);
//     });
//   };

//   const cartTotal = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );
//   const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

//   const placeOrder = async () => {
//     if (cart.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
//     setPlacing(true);
//     try {
//       const orderItems: OrderItem[] = cart.map((c) => ({
//         menuId: c.id,
//         quantity: c.quantity,
//       }));
//       const res = await placeOrderApi(orderItems);
//       if (res.success) {
//         toast.success("Order placed successfully! 🎉");
//         setCart([]);
//       }
//     } catch (err: unknown) {
//       const msg =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Failed to place order";
//       toast.error(msg);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (loading) return <Loader fullscreen />;

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "1fr 320px",
//         gap: "32px",
//         alignItems: "start",
//       }}
//     >
//       {/* Left: Menu */}
//       <div>
//         <div style={{ marginBottom: "28px" }}>
//           <h1
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: "28px",
//               fontWeight: 800,
//               marginBottom: "6px",
//               letterSpacing: "-0.03em",
//             }}
//           >
//             Today&apos;s Menu
//           </h1>
//           <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//             {items.length} items available
//           </p>
//         </div>

//         {/* Category filter */}
//         <div
//           style={{
//             display: "flex",
//             gap: "8px",
//             marginBottom: "24px",
//             flexWrap: "wrap",
//           }}
//         >
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               style={{
//                 padding: "6px 16px",
//                 borderRadius: "20px",
//                 border: "1px solid",
//                 fontFamily: "var(--font-display)",
//                 fontWeight: 600,
//                 fontSize: "13px",
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//                 background:
//                   activeCategory === cat
//                     ? "var(--color-accent)"
//                     : "transparent",
//                 color:
//                   activeCategory === cat
//                     ? "var(--color-ink)"
//                     : "var(--color-text-muted)",
//                 borderColor:
//                   activeCategory === cat
//                     ? "var(--color-accent)"
//                     : "var(--color-border)",
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {filtered.length === 0 ? (
//           <EmptyState
//             icon="🍽"
//             title="No items available"
//             description="Check back later for more options"
//           />
//         ) : (
//           <div
//             className="stagger"
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//               gap: "16px",
//             }}
//           >
//             {filtered.map((item) => {
//               const inCart = cart.find((c) => c.id === item.id);
//               return (
//                 <div
//                   key={item.id}
//                   className="animate-fade-up card"
//                   style={{
//                     padding: "20px",
//                     opacity: item.isAvailable ? 1 : 0.5,
//                     transition: "transform 0.2s, box-shadow 0.2s",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: "11px",
//                         fontWeight: 600,
//                         fontFamily: "var(--font-display)",
//                         color: "var(--color-text-dim)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                       }}
//                     >
//                       {item.category}
//                     </span>
//                     <span
//                       className={`badge ${item.isAvailable ? "badge-available" : "badge-unavailable"}`}
//                     >
//                       {item.isAvailable ? "Available" : "Sold out"}
//                     </span>
//                   </div>
//                   <h3
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 700,
//                       fontSize: "16px",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {item.name}
//                   </h3>
//                   <p
//                     style={{
//                       color: "var(--color-accent)",
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 800,
//                       fontSize: "18px",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     ₹{item.price.toFixed(2)}
//                   </p>
//                   {inCart ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                       }}
//                     >
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "8px",
//                           border: "1px solid var(--color-border)",
//                           background: "var(--color-surface-raised)",
//                           color: "var(--color-text)",
//                           fontSize: "18px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         −
//                       </button>
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "16px",
//                           minWidth: "24px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {inCart.quantity}
//                       </span>
//                       <button
//                         onClick={() => addToCart(item)}
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "8px",
//                           border: "none",
//                           background: "var(--color-accent)",
//                           color: "var(--color-ink)",
//                           fontSize: "18px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontWeight: 700,
//                         }}
//                       >
//                         +
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       className="btn-ghost"
//                       onClick={() => addToCart(item)}
//                       disabled={!item.isAvailable}
//                       style={{
//                         width: "100%",
//                         fontSize: "13px",
//                         padding: "8px 0",
//                       }}
//                     >
//                       Add to Cart
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Right: Cart */}
//       <div
//         className="card"
//         style={{ padding: "24px", position: "sticky", top: "80px" }}
//       >
//         <h2
//           style={{
//             fontFamily: "var(--font-display)",
//             fontWeight: 800,
//             fontSize: "18px",
//             marginBottom: "20px",
//             letterSpacing: "-0.02em",
//           }}
//         >
//           Cart{" "}
//           {cartCount > 0 && (
//             <span style={{ color: "var(--color-accent)", fontSize: "14px" }}>
//               ({cartCount})
//             </span>
//           )}
//         </h2>

//         {cart.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "32px 0",
//               color: "var(--color-text-dim)",
//             }}
//           >
//             <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
//             <p style={{ fontSize: "13px", fontFamily: "var(--font-display)" }}>
//               Your cart is empty
//             </p>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 marginBottom: "20px",
//               }}
//             >
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     gap: "12px",
//                   }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                         fontSize: "13px",
//                       }}
//                     >
//                       {item.name}
//                     </p>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "12px",
//                       }}
//                     >
//                       ₹{item.price} × {item.quantity}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         color: "var(--color-accent)",
//                       }}
//                     >
//                       ₹{(item.price * item.quantity).toFixed(2)}
//                     </span>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       style={{
//                         width: "24px",
//                         height: "24px",
//                         borderRadius: "6px",
//                         border: "1px solid var(--color-border)",
//                         background: "transparent",
//                         color: "var(--color-text-muted)",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       −
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div
//               style={{
//                 borderTop: "1px solid var(--color-border)",
//                 paddingTop: "16px",
//                 marginBottom: "16px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 600,
//                     color: "var(--color-text-muted)",
//                     fontSize: "14px",
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
//                   ₹{cartTotal.toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             <button
//               className="btn-primary"
//               onClick={placeOrder}
//               disabled={placing}
//               style={{ width: "100%", padding: "13px" }}
//             >
//               {placing ? (
//                 <>
//                   <span
//                     className="spinner"
//                     style={{
//                       width: "16px",
//                       height: "16px",
//                       borderWidth: "2px",
//                     }}
//                   />{" "}
//                   Placing…
//                 </>
//               ) : (
//                 "Place Order"
//               )}
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { getMenuApi } from "@/lib/menu";
// import { placeOrderApi } from "@/lib/orders";
// import { MenuItem, OrderItem } from "@/types";
// import EmptyState from "@/components/ui/EmptyState";
// import Loader from "@/components/ui/Loader";

// interface CartItem extends MenuItem {
//   quantity: number;
// }

// type OrderType = "dine-in" | "take-away";
// type PaymentMethod = "upi" | "cash";

// export default function MenuPage() {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("All");

//   // Confirmation modal
//   const [showModal, setShowModal] = useState(false);
//   const [orderType, setOrderType] = useState<OrderType>("dine-in");
//   const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
//   const [placing, setPlacing] = useState(false);

//   const fetchMenu = useCallback(async () => {
//     try {
//       const res = await getMenuApi();
//       if (res.success && res.data) setItems(res.data);
//     } catch {
//       toast.error("Failed to load menu");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMenu();
//   }, [fetchMenu]);

//   const categories = [
//     "All",
//     ...Array.from(new Set(items.map((i) => i.category))),
//   ];
//   const filtered =
//     activeCategory === "All"
//       ? items
//       : items.filter((i) => i.category === activeCategory);

//   const addToCart = (item: MenuItem) => {
//     if (!item.isAvailable) return;
//     setCart((prev) => {
//       const existing = prev.find((c) => c.id === item.id);
//       if (existing)
//         return prev.map((c) =>
//           c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
//         );
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setCart((prev) => {
//       const existing = prev.find((c) => c.id === id);
//       if (existing && existing.quantity > 1)
//         return prev.map((c) =>
//           c.id === id ? { ...c, quantity: c.quantity - 1 } : c,
//         );
//       return prev.filter((c) => c.id !== id);
//     });
//   };

//   const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
//   const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

//   const openModal = () => {
//     if (cart.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
//     setOrderType("dine-in");
//     setPaymentMethod("cash");
//     setShowModal(true);
//   };

//   const confirmOrder = async () => {
//     setPlacing(true);
//     try {
//       const orderItems: OrderItem[] = cart.map((c) => ({
//         menuId: c.id,
//         quantity: c.quantity,
//       }));
//       const res = await placeOrderApi(orderItems, orderType, paymentMethod);
//       if (res.success) {
//         toast.success("Order placed successfully! 🎉");
//         setCart([]);
//         setShowModal(false);
//       }
//     } catch (err: unknown) {
//       const msg =
//         (err as { response?: { data?: { message?: string } } })?.response?.data
//           ?.message || "Failed to place order";
//       toast.error(msg);
//     } finally {
//       setPlacing(false);
//     }
//   };

//   if (loading) return <Loader fullscreen />;

//   const pill = (active: boolean): React.CSSProperties => ({
//     flex: 1,
//     padding: "12px 8px",
//     borderRadius: "10px",
//     cursor: "pointer",
//     border: `2px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
//     background: active
//       ? "var(--color-accent-dim)"
//       : "var(--color-surface-raised)",
//     transition: "all 0.18s",
//     textAlign: "center",
//   });

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "1fr 320px",
//         gap: "32px",
//         alignItems: "start",
//       }}
//     >
//       {/* Left: Menu */}
//       <div>
//         <div style={{ marginBottom: "28px" }}>
//           <h1
//             style={{
//               fontFamily: "var(--font-display)",
//               fontSize: "28px",
//               fontWeight: 800,
//               marginBottom: "6px",
//               letterSpacing: "-0.03em",
//             }}
//           >
//             Today&apos;s Menu
//           </h1>
//           <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//             {items.length} items available
//           </p>
//         </div>

//         {/* Category filter */}
//         <div
//           style={{
//             display: "flex",
//             gap: "8px",
//             marginBottom: "24px",
//             flexWrap: "wrap",
//           }}
//         >
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               style={{
//                 padding: "6px 16px",
//                 borderRadius: "20px",
//                 border: "1px solid",
//                 fontFamily: "var(--font-display)",
//                 fontWeight: 600,
//                 fontSize: "13px",
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//                 background:
//                   activeCategory === cat
//                     ? "var(--color-accent)"
//                     : "transparent",
//                 color:
//                   activeCategory === cat
//                     ? "var(--color-ink)"
//                     : "var(--color-text-muted)",
//                 borderColor:
//                   activeCategory === cat
//                     ? "var(--color-accent)"
//                     : "var(--color-border)",
//               }}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {filtered.length === 0 ? (
//           <EmptyState
//             icon="🍽"
//             title="No items available"
//             description="Check back later for more options"
//           />
//         ) : (
//           <div
//             className="stagger"
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//               gap: "16px",
//             }}
//           >
//             {filtered.map((item) => {
//               const inCart = cart.find((c) => c.id === item.id);
//               return (
//                 <div
//                   key={item.id}
//                   className="animate-fade-up card"
//                   style={{
//                     padding: "20px",
//                     opacity: item.isAvailable ? 1 : 0.5,
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "flex-start",
//                       marginBottom: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: "11px",
//                         fontWeight: 600,
//                         fontFamily: "var(--font-display)",
//                         color: "var(--color-text-dim)",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                       }}
//                     >
//                       {item.category}
//                     </span>
//                     <span
//                       className={`badge ${item.isAvailable ? "badge-available" : "badge-unavailable"}`}
//                     >
//                       {item.isAvailable ? "Available" : "Sold out"}
//                     </span>
//                   </div>
//                   <h3
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 700,
//                       fontSize: "16px",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {item.name}
//                   </h3>
//                   <p
//                     style={{
//                       color: "var(--color-accent)",
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 800,
//                       fontSize: "18px",
//                       marginBottom: "16px",
//                     }}
//                   >
//                     ₹{item.price.toFixed(2)}
//                   </p>
//                   {inCart ? (
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "12px",
//                       }}
//                     >
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "8px",
//                           border: "1px solid var(--color-border)",
//                           background: "var(--color-surface-raised)",
//                           color: "var(--color-text)",
//                           fontSize: "18px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                         }}
//                       >
//                         −
//                       </button>
//                       <span
//                         style={{
//                           fontFamily: "var(--font-display)",
//                           fontWeight: 700,
//                           fontSize: "16px",
//                           minWidth: "24px",
//                           textAlign: "center",
//                         }}
//                       >
//                         {inCart.quantity}
//                       </span>
//                       <button
//                         onClick={() => addToCart(item)}
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "8px",
//                           border: "none",
//                           background: "var(--color-accent)",
//                           color: "var(--color-ink)",
//                           fontSize: "18px",
//                           cursor: "pointer",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontWeight: 700,
//                         }}
//                       >
//                         +
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       className="btn-ghost"
//                       onClick={() => addToCart(item)}
//                       disabled={!item.isAvailable}
//                       style={{
//                         width: "100%",
//                         fontSize: "13px",
//                         padding: "8px 0",
//                       }}
//                     >
//                       Add to Cart
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Right: Cart */}
//       <div
//         className="card"
//         style={{ padding: "24px", position: "sticky", top: "80px" }}
//       >
//         <h2
//           style={{
//             fontFamily: "var(--font-display)",
//             fontWeight: 800,
//             fontSize: "18px",
//             marginBottom: "20px",
//             letterSpacing: "-0.02em",
//           }}
//         >
//           Cart{" "}
//           {cartCount > 0 && (
//             <span style={{ color: "var(--color-accent)", fontSize: "14px" }}>
//               ({cartCount})
//             </span>
//           )}
//         </h2>

//         {cart.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "32px 0",
//               color: "var(--color-text-dim)",
//             }}
//           >
//             <div style={{ fontSize: "32px", marginBottom: "8px" }}>🛒</div>
//             <p style={{ fontSize: "13px", fontFamily: "var(--font-display)" }}>
//               Your cart is empty
//             </p>
//           </div>
//         ) : (
//           <>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 marginBottom: "20px",
//               }}
//             >
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     gap: "12px",
//                   }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 600,
//                         fontSize: "13px",
//                       }}
//                     >
//                       {item.name}
//                     </p>
//                     <p
//                       style={{
//                         color: "var(--color-text-muted)",
//                         fontSize: "12px",
//                       }}
//                     >
//                       ₹{item.price} × {item.quantity}
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         color: "var(--color-accent)",
//                       }}
//                     >
//                       ₹{(item.price * item.quantity).toFixed(2)}
//                     </span>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       style={{
//                         width: "24px",
//                         height: "24px",
//                         borderRadius: "6px",
//                         border: "1px solid var(--color-border)",
//                         background: "transparent",
//                         color: "var(--color-text-muted)",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       −
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div
//               style={{
//                 borderTop: "1px solid var(--color-border)",
//                 paddingTop: "16px",
//                 marginBottom: "16px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 600,
//                     color: "var(--color-text-muted)",
//                     fontSize: "14px",
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
//                   ₹{cartTotal.toFixed(2)}
//                 </span>
//               </div>
//             </div>
//             <button
//               className="btn-primary"
//               onClick={openModal}
//               style={{ width: "100%", padding: "13px" }}
//             >
//               Place Order
//             </button>
//           </>
//         )}
//       </div>

//       {/* Order Confirmation Modal */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             zIndex: 100,
//             background: "rgba(0,0,0,0.65)",
//             backdropFilter: "blur(6px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             padding: "24px",
//           }}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setShowModal(false);
//           }}
//         >
//           <div
//             className="card animate-fade-up"
//             style={{ width: "100%", maxWidth: "420px", padding: "32px" }}
//           >
//             {/* Header */}
//             <div style={{ marginBottom: "24px" }}>
//               <h2
//                 style={{
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 800,
//                   fontSize: "22px",
//                   letterSpacing: "-0.03em",
//                   marginBottom: "6px",
//                 }}
//               >
//                 Confirm Your Order
//               </h2>
//               <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
//                 Just two quick details before we send it in.
//               </p>
//             </div>

//             {/* Mini summary */}
//             <div
//               style={{
//                 background: "var(--color-surface-raised)",
//                 borderRadius: "10px",
//                 padding: "14px 16px",
//                 marginBottom: "24px",
//                 border: "1px solid var(--color-border)",
//               }}
//             >
//               <p
//                 style={{
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 700,
//                   fontSize: "11px",
//                   color: "var(--color-text-dim)",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Order Summary
//               </p>
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     fontSize: "13px",
//                     marginBottom: "5px",
//                   }}
//                 >
//                   <span style={{ color: "var(--color-text-muted)" }}>
//                     {item.name} × {item.quantity}
//                   </span>
//                   <span
//                     style={{
//                       fontFamily: "var(--font-display)",
//                       fontWeight: 600,
//                     }}
//                   >
//                     ₹{(item.price * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               ))}
//               <div
//                 style={{
//                   borderTop: "1px dashed var(--color-border)",
//                   paddingTop: "10px",
//                   marginTop: "8px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 700,
//                     fontSize: "14px",
//                   }}
//                 >
//                   Total
//                 </span>
//                 <span
//                   style={{
//                     fontFamily: "var(--font-display)",
//                     fontWeight: 800,
//                     fontSize: "18px",
//                     color: "var(--color-accent)",
//                   }}
//                 >
//                   ₹{cartTotal.toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             {/* Order Type */}
//             <div style={{ marginBottom: "20px" }}>
//               <p
//                 style={{
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 700,
//                   fontSize: "11px",
//                   color: "var(--color-text-muted)",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Order Type
//               </p>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {(["dine-in", "take-away"] as OrderType[]).map((type) => (
//                   <button
//                     key={type}
//                     onClick={() => setOrderType(type)}
//                     style={pill(orderType === type)}
//                   >
//                     <div style={{ fontSize: "24px", marginBottom: "6px" }}>
//                       {type === "dine-in" ? "🪑" : "🥡"}
//                     </div>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         color:
//                           orderType === type
//                             ? "var(--color-accent)"
//                             : "var(--color-text-muted)",
//                       }}
//                     >
//                       {type === "dine-in" ? "Dine In" : "Take Away"}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--color-text-dim)",
//                         marginTop: "3px",
//                       }}
//                     >
//                       {type === "dine-in"
//                         ? "Eat at the canteen"
//                         : "Pick up & go"}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div style={{ marginBottom: "28px" }}>
//               <p
//                 style={{
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 700,
//                   fontSize: "11px",
//                   color: "var(--color-text-muted)",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Payment Method
//               </p>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 {(["upi", "cash"] as PaymentMethod[]).map((method) => (
//                   <button
//                     key={method}
//                     onClick={() => setPaymentMethod(method)}
//                     style={pill(paymentMethod === method)}
//                   >
//                     <div style={{ fontSize: "24px", marginBottom: "6px" }}>
//                       {method === "upi" ? "📲" : "💵"}
//                     </div>
//                     <p
//                       style={{
//                         fontFamily: "var(--font-display)",
//                         fontWeight: 700,
//                         fontSize: "14px",
//                         color:
//                           paymentMethod === method
//                             ? "var(--color-accent)"
//                             : "var(--color-text-muted)",
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       {method === "upi" ? "UPI" : "Cash"}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "11px",
//                         color: "var(--color-text-dim)",
//                         marginTop: "3px",
//                       }}
//                     >
//                       {method === "upi"
//                         ? "Scan & pay via UPI"
//                         : "Pay at the counter"}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div style={{ display: "flex", gap: "12px" }}>
//               <button
//                 className="btn-ghost"
//                 onClick={() => setShowModal(false)}
//                 style={{ flex: 1 }}
//               >
//                 Back to Cart
//               </button>
//               <button
//                 className="btn-primary"
//                 onClick={confirmOrder}
//                 disabled={placing}
//                 style={{ flex: 1, padding: "13px" }}
//               >
//                 {placing ? (
//                   <>
//                     <span
//                       className="spinner"
//                       style={{
//                         width: "16px",
//                         height: "16px",
//                         borderWidth: "2px",
//                       }}
//                     />{" "}
//                     Placing…
//                   </>
//                 ) : (
//                   "Confirm Order"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
type OrderType = "dine-in" | "take-away";
type PaymentMethod = "upi" | "cash";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showCartPanel, setCartPanel] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [paymentMethod, setPayment] = useState<PaymentMethod>("cash");
  const [placing, setPlacing] = useState(false);

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
      const ex = prev.find((c) => c.id === item.id);
      if (ex)
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === id);
      if (ex && ex.quantity > 1)
        return prev.map((c) =>
          c.id === id ? { ...c, quantity: c.quantity - 1 } : c,
        );
      return prev.filter((c) => c.id !== id);
    });
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const openModal = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setOrderType("dine-in");
    setPayment("cash");
    setShowModal(true);
  };

  const confirmOrder = async () => {
    setPlacing(true);
    try {
      const orderItems: OrderItem[] = cart.map((c) => ({
        menuId: c.id,
        quantity: c.quantity,
      }));
      const res = await placeOrderApi(orderItems, orderType, paymentMethod);
      if (res.success) {
        toast.success("Order placed successfully! 🎉");
        setCart([]);
        setShowModal(false);
        setCartPanel(false);
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

  const pill = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "12px 8px",
    borderRadius: "10px",
    cursor: "pointer",
    border: `2px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
    background: active
      ? "var(--color-accent-dim)"
      : "var(--color-surface-raised)",
    transition: "all 0.18s",
    textAlign: "center",
  });

  const CartContent = () => (
    <>
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
                <div style={{ flex: 1, minWidth: 0 }}>
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
                    flexShrink: 0,
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
                      flexShrink: 0,
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
            onClick={openModal}
            style={{ width: "100%", padding: "13px" }}
          >
            Place Order
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      <div className="menu-layout">
        {/* ── Left: Menu list ── */}
        <div>
          <div style={{ marginBottom: "24px" }}>
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

          {/*
            Category filter — horizontal scroll on mobile so pills never wrap
            to a second line and push content down
          */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "4px" /* keeps scrollbar from clipping */,
              scrollbarWidth: "none" /* Firefox: hide thin scrollbar */,
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: "1px solid",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  flexShrink: 0 /* prevent pills from squishing */,
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
            /*
              Menu item grid:
              - Desktop (>900px): 3-4 cols via auto-fill minmax(180px)
              - Tablet (600-900px): 2-3 cols (grid still handles it)
              - Mobile (<480px): force exactly 2 columns so cards don't get too narrow
            */
            <div
              className="stagger menu-item-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
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
                      padding: "18px",
                      opacity: item.isAvailable ? 1 : 0.5,
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
                        fontSize: "15px",
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
                        fontSize: "17px",
                        marginBottom: "14px",
                      }}
                    >
                      ₹{item.price.toFixed(2)}
                    </p>
                    {inCart ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
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
                            flexShrink: 0,
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "16px",
                            minWidth: "20px",
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
                            flexShrink: 0,
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

        {/* ── Right: Desktop cart sidebar ── */}
        <div
          className="menu-cart-panel card"
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
          <CartContent />
        </div>
      </div>

      {/* ── Mobile sticky cart bar ── */}
      <div className="mobile-cart-bar">
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            🛒 Cart{" "}
            {cartCount > 0 && (
              <span style={{ color: "var(--color-accent)" }}>
                ({cartCount})
              </span>
            )}
          </p>
          {cartCount > 0 && (
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              ₹{cartTotal.toFixed(2)}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {cartCount > 0 && (
            <button
              className="btn-ghost"
              onClick={() => setCartPanel((o) => !o)}
              style={{ padding: "8px 14px", fontSize: "13px" }}
            >
              {showCartPanel ? "Hide" : "View"}
            </button>
          )}
          <button
            className="btn-primary"
            onClick={openModal}
            style={{ padding: "10px 18px" }}
          >
            Order
          </button>
        </div>
      </div>

      {/*
        ── Mobile cart drawer ──
        Slides up above the sticky bar.
        bottom offset accounts for the bar height (~64px) + iOS safe area.
      */}
      {showCartPanel && (
        <div
          style={{
            position: "fixed",
            bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
            left: 0,
            right: 0,
            zIndex: 39,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px 16px 0 0",
            padding: "20px",
            maxHeight: "60vh",
            overflowY: "auto",
            animation: "slideDown 0.2s ease both",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "16px",
              marginBottom: "16px",
            }}
          >
            Your Cart
          </h2>
          <CartContent />
        </div>
      )}

      {/* ── Order Confirmation Modal ── */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div
            className="card animate-fade-up"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.03em",
                  marginBottom: "4px",
                }}
              >
                Confirm Your Order
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
                Just two quick details before we send it in.
              </p>
            </div>

            {/* Mini order summary */}
            <div
              style={{
                background: "var(--color-surface-raised)",
                borderRadius: "10px",
                padding: "12px 14px",
                marginBottom: "20px",
                border: "1px solid var(--color-border)",
              }}
            >
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
                Order Summary
              </p>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    marginBottom: "4px",
                    gap: "8px",
                  }}
                >
                  {/* maxWidth as % so it scales on any viewport width */}
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {item.name} × {item.quantity}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  borderTop: "1px dashed var(--color-border)",
                  paddingTop: "8px",
                  marginTop: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "17px",
                    color: "var(--color-accent)",
                  }}
                >
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Order Type */}
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "10px",
                }}
              >
                Order Type
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {(["dine-in", "take-away"] as OrderType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={pill(orderType === type)}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                      {type === "dine-in" ? "🪑" : "🥡"}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "13px",
                        color:
                          orderType === type
                            ? "var(--color-accent)"
                            : "var(--color-text-muted)",
                      }}
                    >
                      {type === "dine-in" ? "Dine In" : "Take Away"}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-dim)",
                        marginTop: "2px",
                      }}
                    >
                      {type === "dine-in"
                        ? "Eat at the canteen"
                        : "Pick up & go"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: "10px",
                }}
              >
                Payment Method
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {(["upi", "cash"] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPayment(method)}
                    style={pill(paymentMethod === method)}
                  >
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>
                      {method === "upi" ? "📲" : "💵"}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "13px",
                        color:
                          paymentMethod === method
                            ? "var(--color-accent)"
                            : "var(--color-text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {method === "upi" ? "UPI" : "Cash"}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-dim)",
                        marginTop: "2px",
                      }}
                    >
                      {method === "upi" ? "Scan & pay" : "Pay at counter"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-ghost"
                onClick={() => setShowModal(false)}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                className="btn-primary"
                onClick={confirmOrder}
                disabled={placing}
                style={{ flex: 1, padding: "12px" }}
              >
                {placing ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        width: "15px",
                        height: "15px",
                        borderWidth: "2px",
                      }}
                    />{" "}
                    Placing…
                  </>
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
