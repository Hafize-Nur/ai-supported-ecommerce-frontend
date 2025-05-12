import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import AdminSidebar from "../../AdminComponents/AdminSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import FilterComponent from "../../components/FilterComponent";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const handleApplyFilter = (category) => {
    if (category) {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <Layout>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="homepage-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed}>
          <FilterComponent onApplyFilter={handleApplyFilter} />
        </Header>
        <div className="content">Sipariş İşlemleri Sayfası</div>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Homepage;
