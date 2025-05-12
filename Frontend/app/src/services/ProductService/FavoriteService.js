import { notification } from "antd";
import { getUserIdFromToken } from "../../utils/auth";
import { fetchProductImages } from "./ProductService";

const API_BASE_URL = "http://localhost:8082/api/favourite";

// ✅ Favori listeleme
export const fetchFavorites = async () => {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  if (!userId) {
    console.error("Kullanıcı ID'si bulunamadı.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/v1/getAllByUserId`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Backend'den dönen ham veri:", responseData);

    const favoriteProducts = responseData.content || [];

    const favoritesWithImages = await Promise.all(
      favoriteProducts.map(async (favorite) => {
        try {
          const images = await fetchProductImages(favorite.product_id);
          return {
            favorite_id: favorite.id,
            product_id: favorite.product_id,
            category_id: favorite.category_id,
            price: favorite.price,
            name: favorite.name,
            image1: images?.[0] || null,
          };
        } catch (error) {
          console.error(`Ürün ${favorite.product_id} için resim çekilemedi:`, error);
          return {
            favorite_id: favorite.id,
            product_id: favorite.product_id,
            category_id: favorite.category_id,
            price: favorite.price,
            name: favorite.name,
            image1: null,
          };
        }
      })
    );

    console.log("İşlenmiş favoriler:", favoritesWithImages);
    return favoritesWithImages;
  } catch (error) {
    console.error("Favori ürünler çekilirken hata oluştu:", error);
    return [];
  }
};

// ✅ Favori silme fonksiyonu
export const removeFavorite = async (favorite_id) => {
  const token = localStorage.getItem("token");

  try {
    console.log("Silinecek favori ID:", favorite_id);
    const response = await fetch(`${API_BASE_URL}/v1/${favorite_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      notification.success({
        message: "Başarılı",
        description: "Ürün favorilerden kaldırıldı.",
        placement: "topRight",
      });
      return true;
    } else {
      const errorData = await response.json();
      notification.error({
        message: "Hata",
        description: errorData.message || "Favori silinirken bir hata oluştu.",
        placement: "topRight",
      });
      return false;
    }
  } catch (error) {
    console.error("Favori silme hatası:", error);
    notification.error({
      message: "Hata",
      description: "Favori silinirken bir hata oluştu.",
      placement: "topRight",
    });
    return false;
  }
};

// ✅ Favori ekleme fonksiyonu
export const addFavorite = async (product) => {
  const token = localStorage.getItem("token");
  if (!token) {
    notification.info({
      message: "Giriş Yapın",
      description: "Favori eklemek için giriş yapmalısınız.",
      placement: "topRight",
    });
    return false;
  }

  const favoriteData = {
    product_id: Number(product.id),
    category_id: Number(product.categoryId || product.category_id),
    price: Number(product.price),
    name: product.name,
  };

  console.log("Backende gönderilen veri:", favoriteData);

  try {
    const response = await fetch(`${API_BASE_URL}/v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(favoriteData),
    });

    const data = await response.json();

    if (response.ok) {
      notification.success({
        message: "Favori Eklendi",
        description: "Ürün favorilere başarıyla eklendi.",
        placement: "topRight",
      });
      return true;
    } else {
      if (data.status === "BAD_REQUEST" && data.message === "Product exist in this system") {
        notification.info({
          message: "Bilgi",
          description: "Bu ürün zaten favorilerinizde bulunuyor.",
          placement: "topRight",
        });
      } else {
        notification.error({
          message: "Hata",
          description: data.message || "Favori eklenirken bir hata oluştu.",
          placement: "topRight",
        });
      }
      return false;
    }
  } catch (error) {
    console.error("Favori eklerken hata:", error);
    notification.error({
      message: "Bağlantı Hatası",
      description: "Sunucuyla bağlantı kurulurken bir hata oluştu.",
      placement: "topRight",
    });
    return false;
  }
};
