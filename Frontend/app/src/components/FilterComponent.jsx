import React, { useState, useEffect } from "react";
import { Button, Input, Select, Form } from "antd";
import { ProductCategories } from "../services/ProductService/ProductService";

const { Option } = Select;

const FilterComponent = ({ onApplyFilter }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    ProductCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Kategoriler alınırken hata oluştu:", error);
      });
  }, []);

  const onFinish = (values) => {
    onApplyFilter({
      ...values,
      category: values.category,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="category" label="Kategori">
        <Select placeholder="Kategori seçin" allowClear>
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.name}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="minPrice" label="Min Fiyat">
        <Input type="number" placeholder="Minimum fiyat" />
      </Form.Item>

      <Form.Item name="maxPrice" label="Max Fiyat">
        <Input type="number" placeholder="Maksimum fiyat" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Filtrele
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterComponent;
