import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  List,
  Typography,
  Divider,
  notification,
  Spin,
} from "antd";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Payment.css";

const Payment = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [walletBalance, setWalletBalance] = useState(200);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const { Title, Text } = Typography;

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/api/product/v1/${orderId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (!response.ok) throw new Error("Sipariş alınamadı");

        const data = await response.json();

        const productsWithImages = await Promise.all(
          data.products.map(async (product) => {
            const imageRes = await fetch(
              `http://localhost:8082/image/v1/infos/${product.id}`
            );
            const images = await imageRes.json();
            return {
              ...product,
              image:
                images?.length > 0
                  ? `data:image/jpeg;base64,${images[0]}`
                  : null,
            };
          })
        );

        setOrder({ ...data, products: productsWithImages });
        setLoading(false);
      } catch (error) {
        console.error("Sipariş verisi alınamadı:", error);
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const totalPrice = order?.sum_price || 0;

  const handlePayment = (values) => {
    if (walletBalance >= totalPrice) {
      setWalletBalance(walletBalance - totalPrice);
      notification.success({
        message: "Ödeme Başarılı",
        description: "Siparişiniz başarıyla alındı. Teşekkür ederiz!",
        duration: 3,
      });
    } else {
      notification.error({
        message: "Yetersiz Bakiye",
        description: "Cüzdan bakiyeniz yetersiz. Lütfen bakiye yükleyin.",
        duration: 4,
      });
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="payment-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout.Content className="payment-content">
          <div className="payment-page-container">
            <Title level={2}>Ödeme Sayfası</Title>

            {loading ? (
              <Spin size="large" />
            ) : order ? (
              <Form
                layout="vertical"
                onFinish={handlePayment}
                className="payment-form"
              >
                <Title level={4} className="payment-section-title">
                  Müşteri Bilgileri
                </Title>
                <Form.Item
                  label="Adınız Soyadınız"
                  name="fullName"
                  rules={[{ required: true, message: "Lütfen adınızı girin" }]}
                >
                  <Input placeholder="Adınızı girin" />
                </Form.Item>

                <Form.Item
                  label="Adres"
                  name="address"
                  rules={[
                    { required: true, message: "Lütfen adresinizi girin" },
                  ]}
                >
                  <Input placeholder="Adresinizi girin" />
                </Form.Item>

                <Divider />

                <Title level={4} className="payment-section-title">
                  Sipariş Özeti
                </Title>
                <List
                  bordered
                  dataSource={order.products}
                  renderItem={(item) => (
                    <List.Item className="product-list">
                      <div className="product-item">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 40, marginRight: 10 }}
                          />
                        )}
                        {item.name} - {item.price} TL (x{item.quantity})
                      </div>
                    </List.Item>
                  )}
                />

                <Divider />

                <div className="payment-summary">
                  <Text strong className="total-amount">
                    Toplam Tutar: {totalPrice} TL
                  </Text>
                  <br />
                  <Text>Cüzdan Bakiyesi: {walletBalance} TL</Text>
                </div>

                <Form.Item style={{ marginTop: "20px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="payment-button"
                  >
                    Ödemeyi Tamamla
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <Text>Geçerli bir sipariş bulunamadı.</Text>
            )}
          </div>
        </Layout.Content>
        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Payment;
