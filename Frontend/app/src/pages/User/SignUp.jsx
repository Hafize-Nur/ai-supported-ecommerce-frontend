import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Select, Spin, message } from "antd";
import "../User/UserCss/SignUp.css";
import { useNavigate } from "react-router-dom";
import {
  Register,
  VerifyRegister,
} from "../../services/UserService/AuthService";
import AgreementCheckbox from "../../components/AgreementCheckbox";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const SignUp = ({ setLoading }) => {
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [email, setUseremail] = useState("");
  const [password, setUserpassword] = useState("");
  const [address, setUseraddress] = useState("");
  const [phone, setUserphone] = useState("");
  const [errormessage, setErrorMessage] = useState("");
  const [remainingTime, setRemainingTime] = useState(6 * 60);

  const navigate = useNavigate();

  const getColor = () => {
    if (remainingTime > 240) return "#52c41a"; // yeşil
    if (remainingTime > 120) return "#faad14"; // turuncu
    return "#f5222d"; // kırmızı
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      message.warning(
        "Doğrulama kodunun süresi doldu. Lütfen yeniden e-posta doğrulaması yapın."
      );
      navigate("/user/EmailVerification");
    }, 6 * 60 * 1000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timeout);
    };
  }, []);

  // const registerUser = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await Register(
  //       name,
  //       email,
  //       password,
  //       address,
  //       phone,
  //       navigate
  //     );
  //     if (response) {
  //       setMessage(" Kayıt başarılı:");
  //       navigate("/user/Login");
  //     } else {
  //       setMessage("Kayıt başarısız: {$data.message}");
  //     }
  //   } catch (error) {
  //     setMessage("Kayıt sırasında hata oluştu:");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleRegister = async () => {
    if (remainingTime <= 0) {
      message.warning(
        "Doğrulama süresi doldu. Lütfen tekrar e-posta doğrulaması yapın."
      );
      navigate("/user/EmailVerification");
      return;
    }

    if (!name || !address || !phone || !password) {
      message.error("Tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    try {
      const code = localStorage.getItem("verificationCode");
      const verifiedEmail = localStorage.getItem("verifiedEmail");

      if (!code || !verifiedEmail) {
        message.error("Doğrulama kodu veya email bulunamadı.");
        return;
      }

      const userDetails = {
        name,
        email: verifiedEmail,
        password,
        address,
        phone,
      };

      const registeredUser = await VerifyRegister(userDetails, code);
      message.success("Kayıt başarılı!");
      localStorage.removeItem("verificationCode");
      localStorage.removeItem("verifiedEmail");
      navigate("/Login");
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || "";

      if (
        errorMsg.toLowerCase().includes("expired") ||
        errorMsg.toLowerCase().includes("geçersiz") ||
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("expired code")
      ) {
        message.error(
          "Doğrulama kodunuzun süresi dolmuş. Lütfen tekrar e-posta doğrulaması yapınız."
        );
      } else {
        message.error("Kayıt gerçekleştirilemedi. Lütfen tekrar deneyin.");
      }
      setTimeout(() => {
        navigate("/user/EmailVerification");
      }, 1000);
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="90">+90</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Spin spinning={false} tip="Yükleniyor...">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          initialValues={{ prefix: "90" }}
          className="form-container"
          scrollToFirstError
          onFinish={handleRegister}
        >
          <Form.Item
            name="name"
            label="İsim"
            rules={[
              {
                required: true,
                message: "Lütfen isminizi giriniz.",
                whitespace: true,
              },
            ]}
            className="form-label"
          >
            <Input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          {/* <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { type: "email", message: "Geçerli bir e-posta değil!" },
              { required: true, message: "Lütfen e-posta adresinizi giriniz!" },
            ]}
          >
            <Input
              className="form-input"
              value={email}
              onChange={(e) => setUseremail(e.target.value)}
            />
          </Form.Item> */}

          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
            hasFeedback
          >
            <Input.Password
              className="form-input"
              value={password}
              onChange={(e) => setUserpassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Şifreyi Onayla"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Lütfen şifrenizi onaylayınız!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Şifreler eşleşmiyor!"));
                },
              }),
            ]}
          >
            <Input.Password className="form-input" />
          </Form.Item>

          <Form.Item
            name="Adress"
            label="Adres"
            rules={[{ required: true, message: "Lütfen adresinizi giriniz." }]}
          >
            <Input
              className="form-input"
              value={address}
              onChange={(e) => setUseraddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon Numarası"
            rules={[
              { required: true, message: "Lütfen telefon numaranızı giriniz!" },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              className="form-input"
              value={phone}
              onChange={(e) => setUserphone(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Sözleşmeyi kabul etmelisiniz")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { required: true, message: "Sözleşmeyi kabul etmelisiniz!" },
              ]}
            >
              <AgreementCheckbox />
            </Form.Item>
          </Form.Item>

          <Form.Item {...tailFormItemLayout} className="submit-button">
            <Button className="KayitButon" type="primary" htmlType="submit">
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>
        {/* Sayaç ve progress bar */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: getColor(),
            }}
          >
            Kalan Süre: {Math.floor(remainingTime / 60)}:
            {String(remainingTime % 60).padStart(2, "0")}
          </div>
          <div style={{ marginTop: "8px", width: "30%", marginInline: "auto" }}>
            <div
              style={{
                height: "8px",
                background: "#f0f0f0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "80%",
                  width: `${(remainingTime / (6 * 60)) * 100}%`,
                  background: getColor(),
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default SignUp;
