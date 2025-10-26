// src/pages/AdminPage.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Quản trị viên</h1>
      <p>Chào mừng <strong>{user.name}</strong> đến với trang quản trị!</p>
      <button onClick={() => navigate("/admin/products")}>Quản lý sản phẩm</button>
    </div>
  );
};

export default AdminPage;