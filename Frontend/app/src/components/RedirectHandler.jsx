import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { decodeToken } from "../utils/auth";

const RedirectHandler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.roles?.includes("ADMIN")) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user", { replace: true });
      }
    } else {
      navigate("/homepage", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Yükleniyor..." size="large" />
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
