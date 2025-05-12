import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Table,
  message,
  Row,
  Col,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  Categories,
  addCategory,
  deleteCategory,
} from "../../services/ProductService/AdminProductService";

const { Title } = Typography;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await Categories();
      setCategories(fetchedCategories);
    } catch (error) {
      message.error("Kategoriler yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (values) => {
    try {
      await addCategory({ name: values.name });
      message.success("Kategori başarıyla eklendi.");
      setIsAddModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error("Kategori eklenemedi.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Kategori silindi.");
      fetchCategories();
    } catch (error) {
      message.error("Kategori silinemedi.");
    }
  };

  const columns = [
    {
      title: "Kategori Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "İşlem",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteCategory(record.id)}
        ></Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>📂 Kategori Yönetimi</Title>
        </Col>
        <Col>
          <Space>
            <Button icon={<HomeOutlined />} onClick={() => navigate("/admin")}>
              Anasayfaya Dön
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              Kategori Ekle
            </Button>
          </Space>
        </Col>
      </Row>

      <Card
        title="📋 Kategoriler"
        style={{
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title="Kategori Ekle"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCategory} layout="vertical">
          <Form.Item
            name="name"
            label="Kategori Adı"
            rules={[{ required: true, message: "Kategori adı girin." }]}
          >
            <Input placeholder="Kategori adı girin" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
