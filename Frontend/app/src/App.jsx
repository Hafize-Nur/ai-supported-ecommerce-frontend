import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/User/Login";
import Homepage from "./pages/User/Homepage";
import { decodeToken } from "./utils/auth";
import { Spin, ConfigProvider } from "antd";
import Chatbot from "./components/Chatbot";
import RedirectHandler from "./components/RedirectHandler";

const AppRoutes = ({ isAuthenticated, userRole, setLoadingState }) => {
  return (
    <Routes>
      <Route path="/" element={<RedirectHandler />} />
      <Route
        path="/homepage"
        element={<Homepage setLoading={setLoadingState} />}
      />
      <Route path="/login" element={<Login setLoading={setLoadingState} />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route
        path="/user/*"
        element={<UserRoutes setLoading={setLoadingState} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const setLoadingState = (state) => {
    setLoading(state);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserRole(decoded.roles);
        setIsAuthenticated(true);
      }
    }
    setAuthChecked(true);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#fd702d",
          colorLink: "#fd702d",
        },
      }}
    >
      <Router
        future={{
          v7_startTransition: false,
          v7_relativeSplatPath: false,
        }}
      >
        {/* Loading ekranı */}
        {(loading || !authChecked) && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
              position: "fixed",
              top: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 9999,
            }}
          >
            <Spin tip="Yükleniyor..." size="large" />
          </div>
        )}

        {/* Route'lar sadece auth kontrolü bittikten sonra gösterilir */}
        {authChecked && (
          <>
            <AppRoutes
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              setLoadingState={setLoadingState}
            />

            <div
              style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 999,
              }}
            >
              <Chatbot />
            </div>
          </>
        )}
      </Router>
    </ConfigProvider>
  );
};

export default App;
