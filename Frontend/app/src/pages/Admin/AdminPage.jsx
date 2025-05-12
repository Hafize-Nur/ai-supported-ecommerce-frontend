import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  List,
  Button,
  Tag,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  AppstoreOutlined,
  UserOutlined,
  StarFilled,
  FileTextOutlined,
  HeartFilled,
  PlusOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { logout } from "../../services/UserService/AuthService";
const { Title } = Typography;

const cardStyle = {
  textAlign: "center",
  borderRadius: "16px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  transition: "0.3s",
};
const iconStyle = {
  fontSize: "24px",
};

const COLORS = [
  "#1890ff",
  "#52c41a",
  "#fa8c16",
  "#722ed1",
  "#eb2f96",
  "#fadb14",
];

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [favouriteCount, setFavouriteCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryProduct, setCategoryProduct] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const [
        products,
        categories,
        users,
        favourites,
        reviews,
        categoryProductRes,
      ] = await Promise.all([
        axios.get("http://localhost:8082/api/admin/v1/product/count", config),
        axios.get("http://localhost:8082/api/admin/v1/category/count", config),
        // axios.get("/api/admin/v1/orders?page=0&size=5", config),
        axios.get("http://localhost:8082/api/admin/v1/user/count", config),
        axios.get(
          "http://localhost:8082/api/admin/v1/favourites/findAll",
          config
        ),
        axios.get("http://localhost:8082/api/admin/v1/reviews/findall", config),
        axios.get(
          "http://localhost:8082/api/admin/v1/category/count-product",
          config
        ),
      ]);

      setProductCount(products.data);
      setCategoryCount(categories.data);
      // setOrderList(orders.data.content);
      setUserCount(users.data);
      setFavouriteCount(favourites.data.content.length);
      setReviewCount(reviews.data.length);
      setCategoryProduct(categoryProduct.data);
      const categoryData = Object.entries(categoryProductRes.data).map(
        ([key, value]) => ({
          name: key,
          value: value,
        })
      );
      setChartData(categoryData);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleLogout = () => {
    if (logout()) {
      navigate("/");
    } else {
      console.error("Çıkış işlemi başarısız.");
    }
  };
  if (loading) {
    return (
      <Spin size="large" style={{ margin: "100px auto", display: "block" }} />
    );
  }

  const statCards = [
    {
      title: "Toplam Ürün",
      count: productCount,
      icon: <ShoppingOutlined style={{ ...iconStyle, color: "#1890ff" }} />,
    },
    {
      title: "Toplam Kategori",
      count: categoryCount,
      icon: <AppstoreOutlined style={{ ...iconStyle, color: "#52c41a" }} />,
    },
    {
      title: "Toplam Sipariş",
      count: orderList.length,
      icon: <FileTextOutlined style={{ ...iconStyle, color: "#fa8c16" }} />,
    },
    {
      title: "Kullanıcı Sayısı",
      count: userCount,
      icon: <UserOutlined style={{ ...iconStyle, color: "#722ed1" }} />,
    },
    {
      title: "Favoriler",
      count: favouriteCount,
      icon: <HeartFilled style={{ ...iconStyle, color: "#eb2f96" }} />,
    },
    {
      title: "Yorumlar",
      count: reviewCount,
      icon: <StarFilled style={{ ...iconStyle, color: "#fadb14" }} />,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        👨‍💼 Admin Paneli
      </Title>

      <Button
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        Çıkış Yap
      </Button>

      <Row gutter={[16, 16]}>
        {statCards.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={cardStyle}
              title={item.title}
              extra={item.icon}
            >
              <Title level={4} style={{ margin: 0, color: "#333" }}>
                {item.count}
              </Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="📊 Kategorik Ürün Dağılımı" style={cardStyle}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="vertical" // Dikey olarak yerleştirme
                  align="left" // Sol tarafta konumlandırma
                  verticalAlign="middle" // Ortalar
                  iconType="circle" // Yuvarlak renkler
                  wrapperStyle={{
                    paddingLeft: "10px", // Sol tarafta biraz boşluk bırakma
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="📈 Genel İstatistikler" style={cardStyle}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* <Col xs={24} md={12}>
          <Card
            title="📦 Son 5 Sipariş"
            style={cardStyle}
            extra={<FileTextOutlined />}
          >
            <List
              itemLayout="horizontal"
              dataSource={orderList}
              renderItem={(order) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Tooltip title={order.createdDate}>
                        <Tag color="blue">#{order.id}</Tag>
                      </Tooltip>
                    }
                    description={order.createdDate || "Tarih Yok"}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col> */}
        <Col xs={24} md={12}>
          <Card title="⚡ Hızlı İşlemler" style={cardStyle}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate("/admin/ProductManagement")}
            >
              Ürün İşlemleri
            </Button>
            <Button
              type="dashed"
              icon={<AppstoreOutlined />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate("/admin/CategoryManagement")}
            >
              Kategori İşlemleri
            </Button>
            <Button
              type="default"
              icon={<UserOutlined />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate("/admin/UserManagement")}
            >
              Kullanıcı İşlemleri
            </Button>
            <Button
              type="dashed"
              icon={<HeartFilled />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate("/admin/FavoriteManagement")}
            >
              Favori İşlemleri
            </Button>
            <Button
              type="dashed"
              icon={<StarFilled />}
              block
              style={{ marginBottom: 12 }}
              onClick={() => navigate("/admin/ReviewManagement")}
            >
              Yorum İşlemleri
            </Button>
            <Button
              type="dashed"
              icon={<FileTextOutlined />}
              block
              onClick={() => navigate("/admin/OrderManagement")}
            >
              Sipariş İşlemleri
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
