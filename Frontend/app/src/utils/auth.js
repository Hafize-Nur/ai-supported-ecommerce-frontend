import { jwtDecode } from "jwt-decode"; // jwt-decode kütüphanesini import ediyoruz

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`, // Token'ı Authorization başlığına ekle
});


export const getToken = () => {
  return localStorage.getItem('token'); // 'token' localStorage'da saklanıyor
};

// Token'dan rolleri çözümleyen fonksiyon
export const decodeToken = (token) => {
  if (token) {
    try {
      const decodedToken = jwtDecode(token);  // Token'ı decode ediyoruz
      // console.log("decoded token:",decodedToken);
      return decodedToken.roles || [];  // Kullanıcı rolleri döndürülüyor yoksa boş dizi
    } catch (error) {
      console.error("Token'ı çözümleme sırasında hata:", error);
    }
  }
  return [];  // Token yoksa null döndürülür
};

// token'dan userId'yi almak için fonksiyon

export const getUserIdFromToken = () => { 
  const token = getToken();  // Token'ı localStorage'dan alıyoruz
  if (!token) {
    console.warn("Token bulunamadı.");  
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    // console.log("Çözümlenmiş Token:", decodedToken);  
    // console.log("Kullanıcı ID:", decodedToken.userId);
    const userId = decodedToken.userId || decodeToken.sub;
    // console.log("Kullanıcı ID:", userId);
    return userId;  // UserId'yi döndürüyoruz
  } catch (error) {
    console.error("Token decode hatası:", error.message);  
    return null;
  }
};

// Kullanıcının giriş yapmış olup olmadığını kontrol eden fonksiyon
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    console.log("Token bulunamadı");
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    // Token'da userId veya sub varsa geçerli kabul et
    if (decodedToken.userId || decodedToken.sub) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    return false;
  }
};

// Token'dan userId'yi almak için fonksiyon
// export const getUserIdFromToken = () => {
//   const token = localStorage.getItem("token");  // Token'ı localStorage'dan alıyoruz
//   if (!token) {
//     return null;  // Token yoksa null döndürüyoruz
//   }

//   try {
//     const decodedToken = jwtDecode(token);  // Token'ı decode ediyoruz
//     return decodedToken.userId;  // UserId'yi döndürüyoruz
  
//   } catch (error) {
//     console.error("Token decode hatası:", error);
//     return null;  // Hata durumunda null döndürüyoruz
//   }
// };

export const getUserRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles?.toUpperCase() || null;
  
  } catch (error) {
    console.error("Token çözümleme hatası:", error);
    return null;
  }
};
