import React from "react";
import {
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  AppstoreOutlined,
  CreditCardFilled,
  ShoppingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "../css/Sidebar.css";
import { logout } from "../services/UserService/AuthService";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (logout()) {
      navigate("/");
    } else {
      console.error("Çıkış işlemi başarısız.");
    }
  };
  // Rol durumuna göre filtrelenmiş menü öğeleri
  const items = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/Homepage">Anasayfaya </Link>,
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: <Link to="/user/Profile">Profilim</Link>,
    },
    {
      key: "3",
      icon: <LoginOutlined />,
      label: "Giriş/Kayıt",
      children: [
        {
          key: "31",
          label: <Link to="/user/EmailVerification">Kayıt Ol</Link>,
        },
        { key: "32", label: <Link to="/Login">Giriş</Link> },
        {
          key: "13",
          label: <span onClick={handleLogout}>Çıkış Yap</span>,
        },
      ],
    },
    {
      key: "4",
      icon: <AppstoreOutlined />,
      label: <Link to="/user/Products">Ürünler</Link>,
    },
    {
      key: "5",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/user/ShoppingCard">Sepetim</Link>,
    },
    {
      key: "7",
      icon: <ShoppingOutlined />,
      label: <Link to="/user/Orders">Siparişlerim</Link>,
    },
    {
      key: "8",
      icon: <WalletOutlined />,
      label: <Link to="/user/WalletPage">Cüzdanım</Link>,
    },
    {
      key: "9",
      icon: <CreditCardFilled />,
      label: <Link to="/user/Payment">Ödeme Bilgileri</Link>,
    },
  ].filter(Boolean); // undefined değerleri kaldırmak için filter(Boolean) kullanın

  return (
    <Sider
      style={{ background: "#46494e" }}
      className="sidebar"
      collapsible
      collapsed={collapsed}
      trigger={null}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
        className="sidebar-menu"
        theme="dark"
      />
    </Sider>
  );
};

export default Sidebar;
