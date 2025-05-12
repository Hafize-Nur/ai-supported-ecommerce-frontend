import React from "react";
import { Layout, theme, Input, Button } from "antd";
import "../css/Header.css";
import { logout } from "../services/UserService/AuthService";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (logout()) {
      navigate("/");
    } else {
      console.error("Çıkış işlemi başarısız.");
    }
  };

  const items = [
    {
      key: "1",
      icon: <UserOutlined />, // Profilim ikonu
      label: <Link to="/">Giriş Yap</Link>, // Profilim sayfasına yönlendirme
      children: [
        { key: "11", label: <Link to="/user/SignUp">Kayıt Ol</Link> },
        { key: "12", label: <Link to="/Login">Giriş Yap</Link> },
        {
          key: "13",
          label: <span onClick={handleLogout}>Çıkış Yap</span>,
        },
      ],
    },
  ];

  // Arama fonksiyonu
  const onSearch = (value) => {
    console.log("Arama sorgusu:", value);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      className="site-layout-header"
      style={{ background: colorBgContainer }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="toggle-button"
      />

      {/* Arama kutusu */}
      <Search
        className="header-search"
        placeholder="Ara..."
        allowClear
        onSearch={onSearch}
      />
    </Header>
  );
};

export default HeaderComponent;
