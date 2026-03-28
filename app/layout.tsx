import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canteen — Order Management",
  description: "Fast, fresh, and easy canteen ordering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a2e",
                color: "#f0ede8",
                border: "1px solid #2d2d4e",
                borderRadius: "8px",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#f4a435", secondary: "#1a1a2e" },
              },
              error: {
                iconTheme: { primary: "#e85d5d", secondary: "#1a1a2e" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
