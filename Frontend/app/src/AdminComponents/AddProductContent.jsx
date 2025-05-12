import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, Select, message, Steps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../pages/Admin/AdminCss/AddProductContent.css";
import {
  addCategory,
  createProduct,
  Categories,
  uploadProductImage,
} from "../../services/ProductService/AdminProductService";

const AddProductContent = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [tempProductData, setTempProductData] = useState(null);
  const [productId, setProductId] = useState(null); // Ürün ID'sini saklamak için bir state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await Categories();
        setCategories(fetchedCategories || []);
      } catch (error) {
        message.error("Kategoriler yüklenirken bir hata oluştu.");
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // LocalStorage'den ürün verisini al
    const savedProductData = JSON.parse(localStorage.getItem("productData"));
    if (savedProductData) {
      setTempProductData(savedProductData);
      setProductId(savedProductData.id);
      setFileList(savedProductData.images || []);
      setCurrentStep(2); // Eğer ürün verisi varsa, resim yükleme adımına geç
    }
  }, []);

  const handleProductSubmit = async (values) => {
    if (
      !values.description ||
      !values.productName ||
      !values.price ||
      !values.category ||
      !values.quantity
    ) {
      message.error("Lütfen tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    const productData = {
      description: values.description,
      name: values.productName,
      price: parseFloat(values.price),
      category_id: parseInt(values.category, 10),
      quantity: parseInt(values.quantity, 10),
      images: [], // Resim bilgilerini daha sonra eklemek için boş başlatıyoruz
    };

    try {
      // Ürün bilgilerini geçici olarak localStorage'da saklıyoruz
      localStorage.setItem("productData", JSON.stringify(productData));
      setTempProductData(productData); // Geçici ürün verisini state'e alıyoruz
      message.success("Ürün bilgileri başarıyla geçici olarak kaydedildi!");
      setCurrentStep(2); // Resim yükleme adımına geçiyoruz
    } catch (error) {
      message.error(
        "Ürün bilgileri kaydedilirken bir hata oluştu: " + error.message
      );
    }
  };

  const handleImageUpload = async () => {
    if (!fileList.length) {
      message.error("Lütfen en az bir resim seçin.");
      return;
    }

    try {
      // LocalStorage'dan geçici ürün verisini alıyoruz
      const productData = JSON.parse(localStorage.getItem("productData"));

      if (!productData) {
        message.error(
          "Ürün bilgileri bulunamadı. Lütfen önce ürün bilgilerini kaydedin."
        );
        return;
      }

      // Resimleri ürün bilgilerine ekliyoruz
      const updatedImages = [
        ...productData.images,
        ...fileList.map((file) => file.originFileObj),
      ];
      const updatedProductData = { ...productData, images: updatedImages };

      // LocalStorage'ı güncelliyoruz
      localStorage.setItem("productData", JSON.stringify(updatedProductData));
      setTempProductData(updatedProductData); // State'i güncelliyoruz

      message.success("Resimler başarıyla eklendi!");
      setFileList([]); // Yüklenen dosyaları sıfırlıyoruz
      setCurrentStep(3); // Son adım olan kaydetmeye geçiyoruz
    } catch (error) {
      message.error("Resimler eklenirken bir hata oluştu: " + error.message);
    }
  };

  const handleFinalizeProduct = async () => {
    try {
      // LocalStorage'dan geçici ürün verisini alıyoruz
      const finalProductData = JSON.parse(localStorage.getItem("productData"));

      if (!finalProductData) {
        message.error(
          "Ürün bilgileri eksik. Lütfen önce ürün bilgilerini kaydedin."
        );
        return;
      }

      // Ürün ve resimleri veritabanına kaydediyoruz
      await createProduct(finalProductData);

      message.success("Ürün ve resimler başarıyla kaydedildi!");
      form.resetFields(); // Formu sıfırlıyoruz
      setCurrentStep(1); // Başlangıç adımına dönüyoruz
      setTempProductData(null); // Geçici ürünü sıfırlıyoruz
      localStorage.removeItem("productData"); // LocalStorage'ı temizliyoruz
    } catch (error) {
      message.error("Ürün kaydedilirken bir hata oluştu: " + error.message);
    }
  };

  const handleFileChange = ({ file, fileList: newFileList }) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Sadece görüntü dosyaları yüklenebilir!");
      return;
    }
    setFileList(newFileList);
  };

  const steps = [
    { title: "Ürün Bilgileri" },
    { title: "Resim Yükleme" },
    { title: "Ürünü Tamamla" },
  ];

  return (
    <div className="urun-ekle-container">
      <h1>Ürün Ekleme Paneli</h1>
      <Steps current={currentStep - 1} style={{ marginBottom: "24px" }}>
        {steps.map((step, index) => (
          <Steps.Step key={index} title={step.title} />
        ))}
      </Steps>

      {currentStep === 1 && (
        <Form
          onFinish={handleProductSubmit}
          form={form}
          className="form-product"
          layout="vertical"
        >
          <Form.Item
            name="productName"
            label="Ürün Adı"
            rules={[{ required: true, message: "Ürün adı giriniz!" }]}
          >
            <Input placeholder="Ürün Adı" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Ürün Açıklaması"
            rules={[{ required: true, message: "Ürün açıklamasını giriniz!" }]}
          >
            <Input placeholder="Ürün Açıklaması" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Fiyat"
            rules={[{ required: true, message: "Fiyat giriniz!" }]}
          >
            <Input type="number" placeholder="Fiyat" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Ürün miktarı"
            rules={[{ required: true, message: "Ürün miktarını giriniz!" }]}
          >
            <Input placeholder="Ürün Miktar" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategori"
            rules={[{ required: true, message: "Bir kategori seçiniz!" }]}
          >
            <Select placeholder="Mevcut Kategorilerden Birini Seçin">
              {(categories || []).map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Devam Et
            </Button>
          </Form.Item>
        </Form>
      )}

      {currentStep === 2 && (
        <div>
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            multiple
            fileList={fileList}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Resim Yükle</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleImageUpload}
            disabled={!fileList.length}
            style={{ marginTop: "20px" }}
          >
            Resimleri Yükle
          </Button>
        </div>
      )}

      {currentStep === 3 && (
        <Button type="primary" onClick={handleFinalizeProduct}>
          Ürünü Tamamla
        </Button>
      )}
    </div>
  );
};

export default AddProductContent;
