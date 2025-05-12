export const getReviewCount = async (productId) => {
    const response = await fetch(` http://localhost:8082/api/product/${productId}/reviews/count`);
    if (!response.ok) throw new Error("Yorum sayısı alınamadı");
    return await response.json();
  };