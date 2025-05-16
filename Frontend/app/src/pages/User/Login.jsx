import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Typography,
  Spin,
  notification,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "../User/UserCss/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../services/UserService/AuthService";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { decodeToken } from "../../utils/auth";

const LoginForm = ({ setLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userCaptcha, setUserCaptcha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      console.log("Giriş başarılı:", user);
      navigate("/Homepage"); // Giriş başarılı olduğunda yönlendir
    } catch (error) {
      setError(error.message || "Giriş sırasında bir hata oluştu");
      notification.error({
        message: "Giriş Hatası",
        description: "Email veya şifre hatalı.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };
  // ###############################################

  //google giriş fonksiyonu

  // const handleGoogleLogin = async (credentialResponse) => {
  //   try {
  //     const response = await googleLogin(credentialResponse.credential);
  //     if (response.token) {
  //       console.log("Google login successful");
  //       // Redirect to the dashboard or homepage
  //     } else {
  //       console.error("Google login failed:", response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during Google login:", error);
  //   }
  // };

  //captcha oluşturma fonksiyonu
  function generateCaptcha() {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captchaLength = 6;
    let captchaCode = "";
    for (let i = 0; i < captchaLength; i++) {
      let randomIndex = Math.floor(Math.random() * chars.length);
      captchaCode += chars[randomIndex];
    }
    return captchaCode;
  }

  //captcha yenileme fonksiyonu
  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
  };

  const onFinish = (values) => {
    if (userCaptcha === captcha) {
      console.log("Başarılı doğrulama!");

      handleLogin();
    } else {
      console.log("Captcha doğrulaması başarısız!");
    }
  };

  // Form submit başarısız olduğunda tetiklenen fonksiyon
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login ">
      <Form
        name="login-form"
        initialValues={{ remember: true }} // Varsayılan değerler
        onFinish={onFinish} // Form submit başarılı olduğunda tetiklenir
        onFinishFailed={onFinishFailed} // Form submit başarısız olduğunda tetiklenir
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Lütfen emailinizi girin!!!!!!!!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />} // Kullanıcı adı ikonu
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />} // Şifre ikonu
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Güvenlik Kodu"
          extra="Bir insan olduğunuzdan emin olmalıyız."
        >
          <Row gutter={8} className="captcha-container">
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Lütfen güvenlik kodunu giriniz!",
                  },
                ]}
              >
                <Input
                  className="captcha-input"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={30}>
              <Typography.Text strong className="no-select">
                {captcha}
              </Typography.Text>
            </Col>
            <Button className="captcha-button" onClick={refreshCaptcha}>
              Captcha Al
            </Button>
          </Row>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={handleLogin} htmlType="submit" block>
            Giriş Yap
          </Button>
        </Form.Item>
        <Form.Item>
          <Link to={"/user/EmailVerification"}> Hesabınız yok mu?</Link>
        </Form.Item>
        <Form.Item>
          <Link to={"/user/ResetPassword"}> Şifrenizi mi unuttunuz?</Link>
        </Form.Item>

        {/* <Form.Item>
          <GoogleOAuthProvider clientId="686213888927-jahnrgm8590h9hkobg59efdvqiljkrtv.apps.googleusercontent.com ">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Google login failed");
              }}
            />
          </GoogleOAuthProvider>
        </Form.Item> */}
      </Form>
    </div>
  );
};

export default LoginForm;
