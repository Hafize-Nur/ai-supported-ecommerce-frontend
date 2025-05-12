import React, { useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../User/UserCss/ResetPassword.css";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendResetCode = async (email) => {
    try {
      const response = await fetch(
        "http://localhost:8082/api/auth/v1/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Kod gönderme başarısız.");
      }

      const message = await response.text();
      alert(message);
      navigate("/Login");
    } catch (error) {
      console.error("Hata:", error);
      alert(error.message);
    }
  };

  const onSendCode = async (values) => {
    setLoading(true);
    try {
      await sendResetCode(values.email);
    } catch (error) {
      // alert kısmı zaten sendResetCode içinde
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-verification-container">
      <Card className="email-verification-card">
        <Title level={3}>Şifre Yenileme</Title>
        <Text>
          Lütfen e-mail adresinizi girin. Şifre yenileme kodu gönderilecektir.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSendCode}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "E-mail adresinizi girin!" },
              { type: "email", message: "Geçerli bir e-mail adresi girin!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="ornek@mail.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Kod Gönder
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
