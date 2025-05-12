import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProfileSettings from "../../components/ProfileSettings";
import {
  Layout,
  Avatar,
  Card,
  Descriptions,
  Tabs,
  message,
  Button,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../User/UserCss/Profile.css";
import { getUserRoleFromToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = ({ setLoading }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);

      const role = getUserRoleFromToken();

      if (role === "ADMIN") {
        setError("Yönetici rolü ile kullanıcı profili görüntülenemez.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Giriş yapılmamış. Lütfen giriş yapın.");
          return;
        }

        const API_URL = "http://localhost:8082/api/user/v1/profile";
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `API Hatası: ${response.status} - ${response.statusText}`
          );
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Profil verisi alınırken hata oluştu:", error);
        setError("Profil bilgileri alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Hesabınızı silmek istediğinize emin misiniz?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8082/api/user/v1", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        message.success("Hesabınız başarıyla silindi. Çıkış yapılıyor...");

        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, 1500);
      } else {
        message.error("Hesap silinemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Hesap silinirken hata oluştu:", error);
      message.error("Sunucu hatası: Hesap silinemedi.");
    }
  };

  return (
    <Layout>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        className="Profile-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />

        <div style={{ padding: "24px" }}>
          {error ? (
            <Card>
              <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
            </Card>
          ) : (
            <Card>
              <Avatar size={100} icon={<UserOutlined />} />
              <Descriptions title="Kullanıcı Profili" bordered>
                <Descriptions.Item label="Adı">
                  {userProfile?.name || "Belirtilmemiş"}
                </Descriptions.Item>
                <Descriptions.Item label="E-posta">
                  {userProfile?.email || "Belirtilmemiş"}
                </Descriptions.Item>
                <Descriptions.Item label="Telefon">
                  {userProfile?.phone || "Belirtilmemiş"}
                </Descriptions.Item>
                <Descriptions.Item label="Adres">
                  {userProfile?.address || "Belirtilmemiş"}
                </Descriptions.Item>
              </Descriptions>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: "Geçmiş Hareketler",
                    children: (
                      <div>
                        <h3>Son Aktiviteler</h3>
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Ayarlar",
                    children: <ProfileSettings />,
                  },
                ]}
              />
              <Button
                type="primary"
                danger
                onClick={handleDeleteAccount}
                style={{ marginTop: "16px" }}
              >
                Hesabımı Sil
              </Button>
            </Card>
          )}
        </div>

        <Footer>
          <div className="pagination-inside-footer">
            <p className="footer-text">@Fashion Design</p>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Profile;
