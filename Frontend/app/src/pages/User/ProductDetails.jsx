import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductDetailsCard from "../../components/ProductDetailsCard";
import "../User/UserCss/ProductDetails.css";
import { useParams } from "react-router-dom";
import {
  fetchProductById,
  fetchProductImages,
} from "../../services/ProductService/ProductService";

const ProductDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const { id } = useParams(); // URL parametrelerinden id'yi alıyoruz
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        const selectedProduct = await fetchProductById(id);
        setProduct(selectedProduct);
        console.log("Gelen ürün:", selectedProduct);
        const productImages = await fetchProductImages(id);

        const imageUrls = productImages.map((image) =>
          image.startsWith("data:image")
            ? image
            : `data:image/jpeg;base64,${image}`
        );

        setImages(imageUrls);
      } catch (error) {
        console.error("Ürün detayları alınırken hata:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="productdetails-content">
          {product ? (
            <ProductDetailsCard product={product} images={images} />
          ) : (
            <p>Ürün yükleniyor...</p>
          )}
        </div>

        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ProductDetails;
