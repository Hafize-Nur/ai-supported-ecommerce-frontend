import { getAuthHeaders } from "../../utils/auth";

//Bakiye bilgileri
export const getUserBalance = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8082/api/user/v1", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Kullanıcı bilgileri alınamadı");
      }
  
      return await response.json();
    } catch (error) {
      console.error("getUserBalance hatası:", error);
      throw error;
    }
  };

  //Bakiye yükleme
  export const loadBalance = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8082/api/user/v1/loadBalance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Bakiye yükleme başarısız");
      }
  
      return await response.json();
    } catch (error) {
      console.error("loadBalance hatası:", error);
      throw error;
    }
  };
  
  //Bakiye güncelleme
  export const updateBalance = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8082/api/user/v1/balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }); 
  
      if (!response.ok) {
        throw new Error("Bakiye güncelleme başarısız");
      }
  
      return await response.json();
    } catch (error) {
      console.error("updateBalance hatası:", error);
      throw error;
    }
  };
  
  // Geçmişi görüntüleme
  export const getBalanceHistory=async(page=0,size=10)=>{
    try{
      const response = await fetch(`http://localhost:8082/api/balance/v1/history?page=${page}&size=${size}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      
    
    if (!response.ok) {
      throw new Error("Bakiye geçmişi alınamadı");
    }

    return await response.json();
  } catch (error) {
    console.error("getBalanceHistory hatası:", error);
    throw error;
  }
};