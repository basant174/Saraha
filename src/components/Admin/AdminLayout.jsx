import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
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