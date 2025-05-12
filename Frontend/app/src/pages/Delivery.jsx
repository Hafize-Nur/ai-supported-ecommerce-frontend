import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import Footer from "../components/Footer";
import "../css/Delivery.css";

const Delivery = () => {
  const [collapsed, setCollapsed] = useState(false);
  // teslimat bilgileri
  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="Delivery-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content />
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Delivery;
