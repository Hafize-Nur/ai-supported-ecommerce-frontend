import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Drawer,
  Button,
  Form,
  Input,
  message,
  Upload,
  Select,
  Statistic,
  Modal,
  Table,
  Tag,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  UploadOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import {
  getAllProducts,
  createProduct,
  uploadProductImage,
  Categories,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService/AdminProductService";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "0.3s",
  textAlign: "center",
};

const iconStyle = {
  fontSize: "36px",
  marginBottom: 12,
};

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawerType, setDrawerType] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [productDataOverTimes, setProductDataOverTime] = useState();
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  const productDataOverTime = [
    {
      productName: "İnce uzun desenli bluz",
      stockHistory: [
        { date: "2024-12", stock: 50 },
        { date: "2025-01", stock: 70 },
        { date: "2025-02", stock: 90 },
        { date: "2025-03", stock: 100 },
        { date: "2025-03", stock: 0 },
      ],
    },
    {
      productName: "Kısa kollu tişört",
      stockHistory: [
        { date: "2024-12", stock: 200 },
        { date: "2025-01", stock: 180 },
        { date: "2025-02", stock: 160 },
        { date: "2025-03", stock: 150 },
        { date: "2025-04", stock: 60 },
      ],
    },
  ];

  // Stok durumu için tablo
  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Stok",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => {
        if (!quantity) return "Bilinmiyor";

        return Object.entries(quantity).map(([size, count]) => (
          <Tag
            color={count < 20 ? "red" : count < 100 ? "orange" : "green"}
            key={size}
          >
            {size}: {count}
          </Tag>
        ));
      },
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (category) => category?.name || "Kategori Yok",
    },
  ];

  const fetchAllProducts = async () => {
    try {
      const products = await getAllProducts();
      const categories = await Categories();

      const productsWithCategory = products.map((product) => ({
        ...product,
        category: categories.find((cat) => cat.id === product.category_id) || {
          name: "Kategori Yok",
        },
      }));

      const timeData = productsWithCategory.map((product, index) => ({
        name: `Ürün ${index + 1}`,
        ürünler: index + 1,
      }));
      setProductDataOverTime(timeData);

      const categoryCount = {};
      productsWithCategory.forEach((product) => {
        const categoryName = product.category.name || "Kategori Yok";
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });
      const categoryData = Object.keys(categoryCount).map((key) => ({
        name: key,
        value: categoryCount[key],
      }));
      setCategoryDistribution(categoryData);

      setAllProducts(productsWithCategory);
    } catch (err) {
      console.error("Tüm ürünleri çekme hatası:", err);
    }
  };
  //ürün sayısın çekmek için kullanılan fetch
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const products = await axios.get(
        "http://localhost:8082/api/admin/v1/product/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductCount(products.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await Categories();
      setCategories(res || []);
    } catch (err) {
      message.error("Kategori bilgileri alınamadı");
    }
  };

  const openDrawer = (type) => {
    setDrawerType(type);
    setDrawerOpen(true);
    form.resetFields();
    setFileList([]);
    fetchCategories();
    fetchAllProducts();
  };

  const handleFileChange = ({ file, fileList: newFileList }) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Sadece görüntü dosyaları yüklenebilir!");
      return;
    }
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    try {
      if (drawerType === "add") {
        const productData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: values.quantity,
          category_id: parseInt(values.category),
        };
        const created = await createProduct(productData);

        for (const file of fileList) {
          await uploadProductImage(created.id, file.originFileObj);
        }

        message.success("Ürün ve resimler başarıyla eklendi!");
      } else if (drawerType === "edit" && selectedProduct) {
        const updatedProductData = {
          name: values.productName,
          description: values.description,
          price: parseFloat(values.price),
          quantity: values.quantity,
          category_id: parseInt(values.category),
        };
        await updateProduct(selectedProduct.id, updatedProductData);

        for (const file of fileList) {
          await uploadProductImage(selectedProduct.id, file.originFileObj);
        }

        message.success("Ürün başarıyla güncellendi!");
      }

      form.resetFields();
      setFileList([]);
      setSelectedProduct(null);
      setDrawerOpen(false);
      fetchData();
      fetchAllProducts();
    } catch (error) {
      message.error(
        "Ekleme veya güncelleme sırasında hata oluştu: " + error.message
      );
    }
  };

  const handleProductSelect = (value) => {
    const product = allProducts.find((p) => p.id === value);
    if (product) {
      setSelectedProduct(product);
      form.setFieldsValue({
        productName: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category?.id,
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      message.success("Ürün başarıyla silindi!");
      setDeleteModalOpen(false);
      fetchData();
      fetchAllProducts();
    } catch (error) {
      message.error("Ürün silinirken hata oluştu!");
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <Spin size="large" style={{ margin: "100px auto", display: "block" }} />
    );
  }

  const actionCards = [
    {
      title: "Ürün Ekle",
      icon: <PlusOutlined style={{ ...iconStyle, color: "#52c41a" }} />,
      onClick: () => openDrawer("add"),
    },
    {
      title: "Ürün Güncelle",
      icon: <EditOutlined style={{ ...iconStyle, color: "#1890ff" }} />,
      onClick: () => openDrawer("edit"),
    },
    {
      title: "Ürün Sil",
      icon: <DeleteOutlined style={{ ...iconStyle, color: "#ff4d4f" }} />,
      onClick: () => setDeleteModalOpen(true),
    },
    {
      title: "Stok Durumu",
      icon: <ShoppingOutlined style={{ ...iconStyle, color: "#faad14" }} />,
      onClick: () => setStockModalOpen(true),
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <Title level={3}>🏷️ Ürün Yönetimi</Title>

      <Button
        type="link"
        icon={<HomeOutlined />}
        style={{ position: "absolute", right: 30, top: 30 }}
        onClick={() => navigate("/admin")}
      >
        Anasayfaya Dön
      </Button>

      <Row gutter={[24, 24]} style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Statistic
            title="Toplam Ürün Sayısı"
            value={productCount}
            style={{ textAlign: "center" }}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: "48px" }}>
        <Col xs={24} md={12}>
          <Card
            title="Zamana Göre Ürün Stok Değişimi"
            style={{ borderRadius: "16px" }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productDataOverTime[0].stockHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                {productDataOverTime.map((product, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey="stock"
                    data={product.stockHistory}
                    stroke={index % 2 === 0 ? "#8884d8" : "#82ca9d"}
                    name={product.productName}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={10}>
          <Card
            title="Kategori Dağılımı (Pie Chart)"
            style={{ borderRadius: "16px" }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ paddingTop: "20px" }}>
        {actionCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card hoverable style={cardStyle} onClick={card.onClick}>
              {card.icon}
              <Title level={4}>{card.title}</Title>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={drawerType === "add" ? "Ürün Ekle" : "Ürün Güncelle"}
        placement="bottom"
        open={drawerOpen}
        onCancel={() => setDrawerOpen(false)}
        footer={null}
        width="40%"
        height="100%"
        style={{
          overflow: "auto",
          paddingBottom: "10px",
          top: "10px",
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {drawerType === "edit" && (
            <Form.Item label="Güncellenecek Ürün">
              <Select
                placeholder="Bir ürün seçin"
                onChange={handleProductSelect}
                value={selectedProduct?.id || undefined}
                style={{ width: "100%" }} // Daha estetik bir görünüm için width:100% ekledim.
              >
                {allProducts.map((product) => (
                  <Select.Option key={product.id} value={product.id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="productName"
            label="Ürün Adı"
            rules={[{ required: true, message: "Ürün adı giriniz" }]}
          >
            <Input placeholder="Örn: Laptop" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Açıklama"
            rules={[{ required: true, message: "Açıklama giriniz" }]}
          >
            <Input placeholder="Ürün açıklaması" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Fiyat"
            rules={[{ required: true, message: "Fiyat giriniz" }]}
          >
            <Input type="number" placeholder="Fiyat" />
          </Form.Item>

          <Form.Item label="Stok">
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "24px",
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="XS"
                    name={["quantity", "XS"]}
                    rules={[{ required: true, message: "XS bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="S"
                    name={["quantity", "S"]}
                    rules={[{ required: true, message: "S bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="M"
                    name={["quantity", "M"]}
                    rules={[{ required: true, message: "M bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="L"
                    name={["quantity", "L"]}
                    rules={[{ required: true, message: "L bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="XL"
                    name={["quantity", "XL"]}
                    rules={[{ required: true, message: "XL bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="XXL"
                    name={["quantity", "XXL"]}
                    rules={[{ required: true, message: "XXL bedeni giriniz" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form.Item>

          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: "Kategori seçiniz" }]}
          >
            <Select placeholder="Kategori Seçin" style={{ width: "100%" }}>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Resim Yükle">
            <Upload
              beforeUpload={() => false}
              onChange={handleFileChange}
              fileList={fileList}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Resim Seç</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {drawerType === "add" ? "Ürünü Kaydet" : "Ürünü Güncelle"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ürün Silme"
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        width="50%"
        style={{ top: 200 }}
      >
        <div style={{ textAlign: "center" }}>
          <h3 style={{ color: "#ff4d4f" }}>
            <DeleteOutlined style={{ fontSize: 24, marginRight: 8 }} />
            Silmek Üzeresiniz
          </h3>
          <p>
            Bu işlemi geri alamazsınız. {selectedProduct?.name} ürününü silmek
            istediğinizden emin misiniz?
          </p>
          <Select
            placeholder="Silinecek ürünü seçin"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(id) =>
              setSelectedProduct(allProducts.find((p) => p.id === id))
            }
          >
            {allProducts.map((product) => (
              <Select.Option key={product.id} value={product.id}>
                {product.name}
              </Select.Option>
            ))}
          </Select>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Button
              type="default"
              style={{
                width: "48%",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
              }}
              onClick={() => setDeleteModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="default"
              icon={<DeleteOutlined />}
              style={{
                width: "48%",
                backgroundColor: "#f5f5f5",
                borderColor: "#d9d9d9",
                color: "#ff4d4f",
              }}
              onClick={() => handleDeleteProduct(selectedProduct?.id)}
            >
              Sil
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Stok Durumu"
        open={stockModalOpen}
        onCancel={() => setStockModalOpen(false)}
        footer={null}
        width="80%"
      >
        <Table
          columns={columns}
          dataSource={allProducts}
          rowKey="id"
          pagination={false}
          bordered
          size="middle"
        />
      </Modal>
    </div>
  );
};

export default AdminDashboard;
