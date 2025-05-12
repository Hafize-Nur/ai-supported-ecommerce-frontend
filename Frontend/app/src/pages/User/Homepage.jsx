import React, { useEffect, useState } from "react";
import { Layout, Spin, Pagination } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Homepage.css";
import ProductCard from "../../components/ProductCard";
import {
  fetchProducts,
  fetchProductImages,
  fetchFilteredProducts,
} from "../../services/ProductService/ProductService";
const Homepage = ({ setLoading }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const handlePageChange = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setSize(pageSize);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProducts(page - 1, size);
        // console.log("API'den dönen ürünler:", productsData); // Veriyi kontrol et

        const productList = productsData.content;

        if (!Array.isArray(productList)) {
          throw new Error("Ürün verisi dizisi bekleniyor.");
        }

        const productsWithImages = await Promise.all(
          productList.map(async (product) => {
            const images = await fetchProductImages(product.id);
            return { ...product, images };
          })
        );
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
        setTotal(productsData.totalElements);
      } catch (error) {
        setError(error.message);
        console.error("Ürünler yüklenirken hata oluştu:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [page, size]);

  if (error) return <div>Hata: {error}</div>;

  const handleApplyFilter = async (filters) => {
    console.log("filtreleme kriterleri:", filters);
    try {
      const data = await fetchFilteredProducts(filters);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Filtreleme sırasında hata:", error);
    }
  };

  return (
    <Layout
      style={{
        transition: "all 0.2s ease",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        trigger={null}
      />
      <Layout className="homepage-layout">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onFilterChange={handleApplyFilter}
        />

        <div
          className="content"
          style={{
            marginLeft: collapsed ? 0 : 200,
          }}
        >
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.images?.[0] || "default-image-path"}
                price={product.price}
                description={product.description}
                quantity={product.quantity}
                stock_state={product.stock_state}
                category_id={product.category_id}
              />
            ))
          ) : (
            <p></p>
          )}
        </div>

        <Footer>
          <div className="pagination-inside-footer">
            <Pagination
              current={page}
              pageSize={size}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
              total={total}
            />
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Homepage;
