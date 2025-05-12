import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import "../User/UserCss/EmailVerification.css";
import {
  sendVerification,
  verifyCode,
} from "../../services/UserService/SignUpService";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await sendVerification(values.email);
      message.success("Doğrulama kodu gönderildi.");
      setEmailSent(true);
    } catch (error) {
      message.error(error.message || "Kod gönderme işlemi başarısız.");
    } finally {
      setLoading(false);
    }
  };

  const onCodeSubmit = async (values) => {
    const { email, code } = values;
    if (!code || code.length !== 6) {
      message.error("Lütfen geçerli bir kod girin.");
      return;
    }

    setLoading(true);
    try {
      const msg = await verifyCode(email, code); // ✅ Backend'e gönder
      message.success(msg || "Kod doğrulandı.");

      localStorage.setItem("verificationCode", code);
      localStorage.setItem("verifiedEmail", email);

      navigate("/user/SignUp", { state: { email, code } });
    } catch (error) {
      message.error(error.message || "Kod doğrulama başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-verification-container">
      <Card className="email-verification-card">
        <Title level={3}>E-mail Doğrulama</Title>
        <Text>
          Lütfen e-mail adresinizi girin. Doğrulama kodu gönderilecektir.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={emailSent ? onCodeSubmit : onFinish}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Lütfen e-mail adresinizi girin!" },
              { type: "email", message: "Geçerli bir e-mail adresi girin!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="ornek@mail.com"
              disabled={emailSent}
            />
          </Form.Item>

          {emailSent && (
            <Form.Item
              label="Doğrulama Kodu"
              name="code"
              rules={[
                { required: true, message: "Doğrulama kodunu girin!" },
                { len: 6, message: "Kod 6 haneli olmalı!" },
              ]}
            >
              <Input placeholder="123456" maxLength={6} />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {emailSent ? "Kodu Doğrula ve Devam Et" : "Doğrulama Kodu Gönder"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EmailVerification;
