import { message } from "antd";
import { getUserIdFromToken, getToken } from "../../utils/auth";
import { fetchProductImages } from "../ProductService/ProductService";
const API_BASE_URL = "http://localhost:8082/api/shoppingCartItem/v1";

// Sepete ürün ekleme
export const addToCart = async (productData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        product_id: productData.product_id,
        description:productData.description,
        quantity: productData.quantity,
        size:productData.size,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sepete ekleme işlemi başarısız oldu.");
    }

    // Response body'nin boş olup olmadığını kontrol et
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    
    // Boş response durumunda başarılı kabul et
    return { success: true };

  } catch (error) {
    console.error("Sepete eklerken hata oluştu:", error);
    if (error instanceof SyntaxError) {
      // JSON parse hatası durumunda başarılı kabul et
      return { success: true };
    }
    throw error;
  }
};
// Sepetten ürün silme
export const removeFromCart = async (id) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error("Kullanıcı girişi yapılmamış");
    }

    // ID'yi long tipine uygun formata çevir
    const cartItemId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(cartItemId) || cartItemId <= 0) {
      throw new Error("Geçersiz sepet öğesi ID'si");
    }

    console.log("Silinecek sepet öğesi ID:", cartItemId);

    const response = await fetch(`http://localhost:8082/api/shoppingCartItem/v1/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 204 No Content başarılı yanıt olarak kabul edilir
    if (!response.ok && response.status !== 204) {
      throw new Error("Ürün sepetten çıkarılamadı");
    }

    return true;
  } catch (error) {
    console.error("Sepetten çıkarma hatası:", error);
    throw error;
  }
};
// Kullanıcıya ait tüm ürünleri sepetten silme
export const clearCartByUserId = async () => {
  const token = getToken();
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    throw new Error("Kullanıcı girişi yapılmamış. Lütfen giriş yapın.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Token ile kimlik doğrulaması
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Tüm ürünleri temizleme hatası!");
    }
  } catch (error) {
    console.error("Tüm ürünleri temizleme hatası:", error);
    throw error;
  }
};



// Sepetteki tüm ürünleri getirme
export const getCartByUserId = async () => {
  const token = getToken();

  if (!token) {
    message.warning({
      content: "Kullanıcı girişi yapılmamış",
      key: "login-warning", 
    });
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Sepet verisi alınamadı");
    }

    const cartItems = await response.json();
    console.log("Backend'den gelen ham sepet verisi:", cartItems);

    if (!cartItems.content || !Array.isArray(cartItems.content)) {
      throw new Error("Geçersiz sepet verisi");
    }

    if (cartItems.content.length === 0) {
      console.log("Sepetiniz boş.");
      return [];
    }

    const cartItemsWithImages = await Promise.all(
      cartItems.content.map(async (item) => {
        try {
          const images = await fetchProductImages(item.product_id);

          return {
            id: item.id,
            quantity: item.quantity,
            product: {
              id: item.product_id,
              name: item.name,
              price: item.price,
              images: images || [],
            },
          };
        } catch (error) {
          console.error(`Ürün ${item.product_id} için resim alınamadı:`, error);
          return {
            id: item.id,
            quantity: item.quantity,
            product: {
              id: item.product_id,
              name: item.name,
              price: item.price,
              images: [],
            },
          };
        }
      })
    );

    console.log("Resimlerle birlikte sepet verisi:", cartItemsWithImages);
    return cartItemsWithImages;
  } catch (error) {
    console.error("Sepet verisi alınamadı:", error);
    throw error;
  }
};
export const updateCartItemQuantity = async (itemId, product_id, size, newQuantity) => {
  const token = getToken();
  if (!token) throw new Error("Kullanıcı girişi yapılmamış");

  const response = await fetch(`http://localhost:8082/api/shoppingCartItem/v1/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: product_id,
      quantity: newQuantity,
      size: size,
    }),
  });

  if (!response.ok) {
    throw new Error("Miktar güncellenemedi");
  }

  return response.json();
};


