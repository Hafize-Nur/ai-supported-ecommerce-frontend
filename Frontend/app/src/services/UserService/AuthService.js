import { decodeToken } from "../../utils/auth";
const API_BASE_URL = "http://localhost:8082/api/auth/v1";


export const login = async (email, password) => {
  try {
    const response = await fetch(`http://localhost:8082/api/auth/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Giriş başarısız");
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem("token", token);

    // Token'dan kullanıcı rolünü çöz
    const roles = decodeToken(token);

    // Rol bilgisine göre yönlendirme
    if (roles.includes("ADMIN")) {
      window.location.href = "/admin"; // Admin sayfasına yönlendir
    } else if (roles.includes("USER")) {
      window.location.href = "/user"; // Kullanıcı sayfasına yönlendir
    } else {
      throw new Error("Geçersiz kullanıcı rolü");
    }

    return data;
  } catch (error) {
    console.error("Login sırasında hata:", error);
    throw error;
  }
};

// // Giriş işlemi
// export const login = async (email, password) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Giriş başarısız");
//     }

//     const data = await response.json();
//     localStorage.setItem("token", data.token);
//     return data;
//   } catch (error) {
//     console.error("Login sırasında hata:", error);
//     throw error;
//   }
// };





// Kayıt işlemi
export const Register = async (userName, name, email, password, address, phone) => {
  try {
    const userDetails = {
      user_name: userName,
      name: name,
      email: email,
      password: password,
      address: address,
      phone: phone,
    };
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Kayıt başarısız");
    }

    const savedUser = await response.json();
    return savedUser;
  } catch (error) {
    console.error("Register sırasında hata:", error);
    throw error;
  }
};

// Çıkış işlemi
export const logout = () => {
 try {
  localStorage.removeItem("token");
  return true;
 } catch (error) {
  console.error("Çıkış yaparak hata oluştu:",error);
  return false;
 }
};

// Token'ı al
export const getCurrentToken = () => {
  return localStorage.getItem("token");
};
 
// Google ile giriş işlemi
export const googleLogin = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Google ile giriş başarısız");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Google login sırasında hata:", error);
    throw error;
  }
};


export const VerifyRegister = async (userDetails, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${code}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Kayıt başarısız");
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Register sırasında hata:", error);
    throw error;
  }
};
