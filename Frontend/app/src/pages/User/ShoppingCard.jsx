import React, { useEffect, useState } from "react";
import { Button, Layout, Table, notification } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../User/UserCss/ShoppingCard.css";
import {
  getUserIdFromToken,
  isAuthenticated,
  getToken,
} from "../../utils/auth";
import {
  removeFromCart,
  getCartByUserId,
  clearCartByUserId,
  updateCartItemQuantity,
} from "../../services/ProductService/ShoppingCardService";
import { createOrder } from "../../services/ProductService/OrdersService";
import { fetchProductImages } from "../../services/ProductService/ProductService";
import { getOrderItemsByUser } from "../../services/ProductService/OrdersService";

const ShoppingCard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedRowDetails, setExpandedRowDetails] = useState({});

  const loadCartItems = async () => {
    if (!isAuthenticated()) {
      notification.warning({
        message: "Giriş Gerekli",
        description: "Lütfen önce giriş yapın.",
        placement: "topRight",
      });
      navigate("/login");
      return;
    }

    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Kullanıcı bilgisi alınamadı");

      setLoading(true);
      const cartItems = await getCartByUserId(userId);
      setData(cartItems || []);
    } catch (error) {
      notification.error({
        message: "Hata",
        description: error.message || "Sepet verisi alınamadı",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  const handleOrder = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        notification.warning({
          message: "Giriş Gerekli",
          description: "Lütfen önce giriş yapın.",
          placement: "topRight",
        });
        navigate("/login");
        return;
      }

      const cartItems = await getCartByUserId(userId);
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Sepet boş.");
      }

      const cartWithImages = await Promise.all(
        cartItems.map(async (item) => {
          const image = await fetchProductImages(item.product.id);
          return {
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            image,
            size: item.size, // size bilgisi de burada ekleniyor
          };
        })
      );

      const orderData = {
        userId,
        description: "Sepet üzerinden sipariş oluşturuldu.",
        sumPrice: cartWithImages.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
        saleDate: new Date().toISOString(),
        stockState: "Hazırlanıyor",
        products: cartWithImages.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
      };

      const response = createOrder(orderData);

      if (!response.ok) {
        throw new Error("Sipariş oluşturulamadı.");
      }

      notification.success({
        message: "Başarılı",
        description: "Siparişiniz başarıyla oluşturuldu.",
        placement: "topRight",
      });

      navigate("/user/orders");
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
      notification.error({
        message: "Hata",
        description: error.message || "Sipariş oluşturulurken hata oluştu.",
        placement: "topRight",
      });
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      notification.success({
        message: "Başarılı",
        description: "Ürün sepetten çıkarıldı",
        placement: "topRight",
      });
      loadCartItems();
    } catch {
      notification.error({
        message: "Hata",
        description: "Ürün sepetten çıkarılamadı",
        placement: "topRight",
      });
    }
  };
  const handleQuantityChange = async (productId, size, change) => {
    const item = data.find(
      (product) => product.id === productId && product.size === size
    );

    if (!item) {
      notification.error({
        message: "Hata",
        description: "Ürün ya da beden bilgisi bulunamadı",
        placement: "topRight",
      });
      return;
    }

    const currentQuantity = item.quantity;
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      notification.error({
        message: "Hata",
        description: "Miktar en az 1 olmalıdır",
        placement: "topRight",
      });
      return;
    }

    try {
      await updateCartItemQuantity(
        item.id,
        item.product.id,
        item.size,
        newQuantity
      );
      notification.success({
        message: "Başarılı",
        description: "Ürün miktarı güncellendi",
        placement: "topRight",
      });
      loadCartItems();
    } catch (error) {
      notification.error({
        message: "Hata",
        description: "Miktar güncellenemedi",
        placement: "topRight",
      });
    }
  };

  const columns = [
    {
      title: "Ürün Resmi",
      dataIndex: ["product", "images"],
      key: "image",
      render: (images) => (
        <img
          className="image"
          src={images && images.length > 0 ? images[0] : ""}
          alt="Ürün Resmi"
          onError={(e) => {
            console.log("Resim yüklenemedi");
            e.target.style.display = "none";
          }}
        />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: ["product", "name"],
      key: "name",
    },

    {
      title: "Miktar",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <div>
          <Button
            onClick={() => handleQuantityChange(record.id, record.size, -1)}
          >
            -
          </Button>
          <span style={{ margin: "0 8px" }}>{quantity}</span>
          <Button
            onClick={() => handleQuantityChange(record.id, record.size, +1)}
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Fiyat",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `${price?.toFixed(2)} TL`,
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          onClick={() => handleRemoveFromCart(record.id)}
        >
          Sepetten Çıkar
        </Button>
      ),
    },
  ];
  console.log("data:", data);
  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="shopping-card-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Table
          className="shopping-card-table"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          loading={loading}
          footer={() => (
            <div>
              <Button
                className="SiparisButon"
                type="primary"
                onClick={() => navigate("/user/Orders", { state: data })}
                disabled={data.length === 0}
              >
                Sepeti Onayla
              </Button>
            </div>
          )}
        />

        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ShoppingCard;
