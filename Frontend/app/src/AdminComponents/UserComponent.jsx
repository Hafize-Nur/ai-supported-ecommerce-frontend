import React, { useState, useEffect } from "react";
import { Table, message } from "antd";
import { getAllUsers } from "../services/UserService/AdminUserService";
import "../pages/Admin/AdminCss/UserComponent.css";

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Kullanıcıları veritabanından çekme
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // console.log("component'te gelen veriler", data); //gelen verileri kontrol etmek için
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("gelen veriler array değil", data);
        setUsers([]);
      }
    } catch (error) {
      // console.error("hata", error); //hata detayını kontrol etmek için
      message.error("Kullanıcılar yüklenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Component ilk yüklendiğinde kullanıcıları al
  }, []);

  // Benzersiz bir key oluşturmak için yeni fonksiyon
  const generateKey = (record) => {
    // Eğer password varsa onu kullan
    if (record.password) {
      return `user-${record.password.substring(0, 8)}`;
    }
    // Rastgele bir string oluştur
    return `user-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Tablo kolonları
  const columns = [
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "-",
    },

    {
      title: "E-posta",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "-",
    },
    {
      title: "Adres",
      dataIndex: "address",
      key: "address",
      render: (text) => text || "-",
    },
  ];

  return (
    <div className="user-add-container">
      <Table
        className="user-table"
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey={generateKey} // Sadece record parametresi kullanılıyor
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AddUser;
