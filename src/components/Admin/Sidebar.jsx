import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "linear-gradient(180deg, #2d2f36, #1a1c23)",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            background: isActive ? "#1976d2" : "transparent",
            outline: "none", // هذا يزيل الخط الخارجي
            boxShadow: "none", // يزيل أي ظل يمكن أن يظهر
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/createUser"
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            background: isActive ? "#1976d2" : "transparent",
            outline: "none",
            boxShadow: "none",
          })}
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/messages"
          style={({ isActive }) => ({
            padding: "10px",
            borderRadius: "8px",
            textDecoration: "none",
            color: "white",
            background: isActive ? "#1976d2" : "transparent",
            outline: "none",
            boxShadow: "none",
          })}
        >
          Messages
        </NavLink>
      </nav>
    </div>
  );
}