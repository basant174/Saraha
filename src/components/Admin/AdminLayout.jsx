import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("AdminLogin") || location.pathname === "/admin";

  return (
    <div style={{ display: "flex" }}>
      {!isLoginPage && <Sidebar />} {/* Sidebar يظهر فقط في صفحات بعد تسجيل الدخول */}

      <div
        style={{
          marginLeft: !isLoginPage ? "260px" : "0",
          padding: "20px",
          width: "100%",
          minHeight: "100vh",
          background: "#f4f6f9",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}