// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";

// interface NavLink {
//   href: string;
//   label: string;
// }

// const userLinks: NavLink[] = [
//   { href: "/menu", label: "Menu" },
//   { href: "/order", label: "My Orders" },
// ];

// const adminLinks: NavLink[] = [
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/menus", label: "Menu" },
//   { href: "/orders", label: "Orders" },
//   { href: "/receipts", label: "Receipts" },
// ];

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const pathname = usePathname();
//   const links = user?.role === "admin" ? adminLinks : userLinks;

//   return (
//     <nav
//       style={{
//         background: "var(--color-surface)",
//         borderBottom: "1px solid var(--color-border)",
//         position: "sticky",
//         top: 0,
//         zIndex: 50,
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "0 24px",
//           height: "60px",
//           display: "flex",
//           alignItems: "center",
//           gap: "32px",
//         }}
//       >
//         {/* Logo */}
//         <Link
//           href={user?.role === "admin" ? "/dashboard" : "/menu"}
//           style={{
//             fontFamily: "var(--font-display)",
//             fontWeight: 800,
//             fontSize: "20px",
//             color: "var(--color-accent)",
//             textDecoration: "none",
//             letterSpacing: "-0.03em",
//             flexShrink: 0,
//           }}
//         >
//           🍽 Canteen
//         </Link>

//         {/* Nav links */}
//         <div style={{ display: "flex", gap: "4px", flex: 1 }}>
//           {links.map((link) => {
//             const active = pathname === link.href;
//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 style={{
//                   padding: "6px 14px",
//                   borderRadius: "8px",
//                   fontFamily: "var(--font-display)",
//                   fontWeight: 600,
//                   fontSize: "14px",
//                   textDecoration: "none",
//                   transition: "all 0.15s",
//                   background: active
//                     ? "var(--color-accent-dim)"
//                     : "transparent",
//                   color: active
//                     ? "var(--color-accent)"
//                     : "var(--color-text-muted)",
//                 }}
//               >
//                 {link.label}
//               </Link>
//             );
//           })}
//         </div>

//         {/* User info + logout */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <span
//             style={{
//               fontSize: "13px",
//               color: "var(--color-text-muted)",
//               fontFamily: "var(--font-display)",
//             }}
//           >
//             {user?.name}
//           </span>
//           {user?.role === "admin" && (
//             <span
//               className="badge"
//               style={{
//                 background: "rgba(244,164,53,0.15)",
//                 color: "var(--color-accent)",
//               }}
//             >
//               Admin
//             </span>
//           )}
//           <button
//             className="btn-ghost"
//             onClick={logout}
//             style={{ padding: "6px 14px", fontSize: "13px" }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";
import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const homeHref = user?.role === "admin" ? "/dashboard" : "/menu";

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
      {/* ── Desktop / top bar ── */}
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
          href={homeHref}
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

        {/* Desktop nav links */}
        <div
          className="nav-desktop-links"
          style={{ display: "flex", gap: "4px", flex: 1 }}
        >
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

        {/* Desktop user info + logout */}
        <div
          className="nav-desktop-user"
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
        >
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

        {/* Mobile: name + hamburger */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
            }}
            className="nav-hamburger" // re-use display:none rule reversed below
          >
            {/* We show name next to hamburger on mobile via sibling */}
          </span>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
          >
            {/* Three bars, animate to X when open */}
            <span
              style={{
                transform: menuOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span
              style={{
                transform: menuOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px 10px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--color-accent-dim)",
              border: "1px solid rgba(244,164,53,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "14px",
              color: "var(--color-accent)",
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--color-text)",
              }}
            >
              {user?.name}
            </p>
            <p style={{ fontSize: "12px", color: "var(--color-text-dim)" }}>
              {user?.role === "admin" ? "Administrator" : "User"}
            </p>
          </div>
        </div>

        <div className="nav-mobile-divider" />

        {/* Nav links */}
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-mobile-link${active ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="nav-mobile-divider" />

        {/* Logout */}
        <button
          onClick={() => {
            setMenuOpen(false);
            logout();
          }}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-danger)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.15s",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
