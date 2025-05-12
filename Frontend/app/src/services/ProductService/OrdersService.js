
import { getToken } from "../../utils/auth";

// Tüm siparişleri getir
export const fetchAllOrders = async () => {
  const response = await fetch(`http://localhost:8082/api/order/v1`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Siparişler alınamadı.");
  }

  return await response.json();
};

//Sipariş Oluşturma
export const createOrder = async (orderData,page=0,size=10) => {
    const response = await fetch(` http://localhost:8082/api/order/v1?
    page=${page}&size=${size}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error("Sipariş oluşturulamadı.");
    return await response.json();
  };

//Sipariş Güncelleme
export const updateOrder = async (id, updatedData) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Sipariş güncellenemedi.");
    return await response.json();
  };
  
// Sipariş Silme
export const deleteOrder = async (id) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Sipariş silinemedi.");
  };
  
// Siparişteki Ürünlerin Özeti
export const getOrderItemSummary = async (orderId) => {
    const response = await fetch(`http://localhost:8082/api/order/v1/orderItem/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Sipariş ürün bilgisi alınamadı.");
    return await response.json();
  };
  
//Belirli Siparişin Ürünleri(Kullanıcıya Özel)
export const getOrderItemsByUser= async (orderId) => {
    const response = await fetch(` http://localhost:8082/api/order/v1/orderItems/${orderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) throw new Error("Sipariş ürünleri getirilemedi.");
    return await response.json();
  };
  
// Kullanıcı ID'sine göre siparişleri filtrele
export const fetchOrdersByUserId = async (userId) => {
  const response = await fetch(
    `http://localhost:8082/api/order/v1/${userId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Kullanıcı ID'sine göre siparişler alınamadı.");
  }

  return await response.json();
};

// Sipariş durumuna göre siparişleri filtrele
// export const fetchOrdersByStatus = async (status) => {
//   const response = await fetch(
//     `${API_BASE_URL}/api/order/v1/filter/byStatus?status=${status}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Sipariş durumu ile filtreleme başarısız.");
//   }

//   return await response.json();
// };

// Ürün adına göre siparişleri filtrele
// export const fetchOrdersByProductName = async (productName) => {
//   const response = await fetch(
//     `${API_BASE_URL}/api/order/v1/filter/byProductName?productName=${encodeURIComponent(productName)}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Ürün adına göre siparişler alınamadı.");
//   }

//   return await response.json();
// };

// Tarih aralığına göre siparişleri filtrele
// export const fetchOrdersByDateRange = async (startDate, endDate) => {
//   const response = await fetch(
//     `${API_BASE_URL}/api/order/v1/filter/byDateRange?startDate=${startDate}&endDate=${endDate}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Tarih aralığına göre siparişler alınamadı.");
//   }

//   return await response.json();
// };

