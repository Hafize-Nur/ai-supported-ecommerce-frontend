import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Card,
  Modal,
  notification,
  Space,
  Input,
  Radio,
  Table,
} from "antd";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/Orders.css";
import { createOrder } from "../../services/ProductService/OrdersService";
import { getUserIdFromToken } from "../../utils/auth";

const API_BASE_URL = "http://localhost:8082";

const Orders = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state || [];

  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmOrder = () => {
    setIsModalOpen(true);
  };
  console.log(cartItems);
  const handleSubmitOrder = async () => {
    try {
      const userId = getUserIdFromToken();
      const address = useSavedAddress
        ? "Kullanıcının Kayıtlı Adresi" // backend'den getirebilirsin
        : newAddress;

      const sumPrice = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      const orderDto = {
        description: "Sipariş onay sayfasından oluşturuldu",
        name: "Sipariş",
        sale_date: new Date().toISOString(),
        sum_price: sumPrice,
        payment_state: "UNPAID",
        address: address,
        is_same_address: useSavedAddress,
        stock_state: "Hazırlanıyor",
        userId,
        orderItems: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      const response = await createOrder(orderDto);

      if (!response.ok) {
        throw new Error("Sipariş oluşturulamadı");
      }

      notification.success({
        message: "Sipariş oluşturuldu",
        description: "Ödeme sayfasına yönlendiriliyorsunuz...",
      });

      navigate("/user/Payment", { state: { cartItems, orderDto } });
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message,
      });
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="Orders-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div style={{ padding: 24 }}>
          <h2>Sipariş Onayı</h2>

          {/* Ürünleri gösteren tablo */}
          <Table
            dataSource={cartItems.map((item, index) => ({
              key: index,
              name: item.product.name,
              image: item.product.images?.[0] || "",
              quantity: item.quantity,
              size: item.size,
              price: item.product.price,
              total: item.quantity * item.product.price,
            }))}
            pagination={false}
            bordered
            style={{ marginBottom: 24 }}
          >
            <Table.Column
              title="Ürün Görseli"
              dataIndex="image"
              key="image"
              render={(text) => (
                <img
                  src={text}
                  alt="ürün"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              )}
            />
            <Table.Column title="Ürün Adı" dataIndex="name" key="name" />
            <Table.Column title="Adet" dataIndex="quantity" key="quantity" />
            <Table.Column title="Beden" dataIndex="size" key="size" />
            <Table.Column
              title="Birim Fiyat"
              dataIndex="price"
              key="price"
              render={(price) => `${price.toFixed(2)} ₺`}
            />
            <Table.Column
              title="Toplam"
              dataIndex="total"
              key="total"
              render={(total) => `${total.toFixed(2)} ₺`}
            />
          </Table>

          {/* Adres seçimi */}
          <Radio.Group
            onChange={(e) => setUseSavedAddress(e.target.value)}
            value={useSavedAddress}
          >
            <Space direction="vertical">
              <Radio value={true}>Kayıtlı adresi kullan</Radio>
              <Radio value={false}>Yeni adres gir</Radio>
            </Space>
          </Radio.Group>

          {!useSavedAddress && (
            <Input.TextArea
              rows={4}
              placeholder="Yeni adresinizi girin"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              style={{ marginTop: 12 }}
            />
          )}

          <Button
            type="primary"
            style={{ marginTop: 20 }}
            onClick={handleConfirmOrder}
          >
            Siparişi Onayla
          </Button>

          {/* Sipariş özeti modali */}
          <Modal
            title="Sipariş Özeti"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleSubmitOrder}
            okText="Siparişi Tamamla"
            cancelText="İptal"
            width={800}
          >
            <Table
              dataSource={cartItems.map((item, index) => ({
                key: index,
                name: item.product.name,
                image: item.product.images?.[0] || "",
                quantity: item.quantity,
                size: item.size,
                price: item.product.price,
                total: item.quantity * item.product.price,
              }))}
              pagination={false}
              bordered
              width={800}
            >
              <Table.Column
                title="Ürün Görseli"
                dataIndex="image"
                key="image"
                render={(text) => (
                  <img
                    src={text}
                    alt="ürün"
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                )}
              />
              <Table.Column title="Ürün Adı" dataIndex="name" key="name" />
              <Table.Column title="Adet" dataIndex="quantity" key="quantity" />
              <Table.Column
                title="Beden"
                dataIndex="size"
                key="size"
                render={(size) => size || "-"}
              />
              <Table.Column
                title="Birim Fiyat"
                dataIndex="price"
                key="price"
                render={(price) => `${price.toFixed(2)} ₺`}
              />
              <Table.Column
                title="Toplam"
                dataIndex="total"
                key="total"
                render={(total) => `${total.toFixed(2)} ₺`}
              />
            </Table>
          </Modal>
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

export default Orders;
