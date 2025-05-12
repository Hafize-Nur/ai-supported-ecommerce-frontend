import { getToken } from "../../utils/auth"; 
import { getAuthHeaders } from "../../utils/auth";
const API_URL = "http://localhost:8082/api/admin/v1";

export const getAllProducts = async () => {
  const response = await fetch(`http://localhost:8082/api/product/v1/home`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Ürün bilgilerini çekilirken bir hata oluştu.");
  }
  const data = await response.json();
  return data.content.map(product => ({
    ...product,
    category: product.category || { name: "Kategori Yok" } 
  }));
};






export const getProductById = async (id) => {
  console.log(`Fetching product with ID: ${id}`); 
  const response = await fetch(`${API_URL}/product/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    console.error(`Error fetching product: ${response.status} ${response.statusText}`);
    throw new Error("Ürün bilgisi alınırken bir hata oluştu.");
  }
  return response.json();
};


 
export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Ürün oluşturulurken bir hata oluştu.");
  }
  return response.json();
};

export const updateProduct = async (id, product) => {
  try {
    const response = await fetch(`${API_URL}/product/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error updating product: ${response.status} ${response.statusText}`, errorData);
      throw new Error(errorData.message || "Ürün güncellenirken bir hata oluştu.");
    }

    return response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw new Error("Ürün güncellenirken bir hata oluştu.");
  }
};


export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/product/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Ürün silinirken bir hata oluştu.");
  }
};

export const uploadProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append("image", file);

 
  const queryParams = new URLSearchParams({
    productId: id, 
  }).toString();

  const response = await fetch(`http://localhost:8082/api/admin/v1?${queryParams}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,  
    },
    body: formData, 
  });

  if (!response.ok) {
    throw new Error("Resim yüklenirken bir hata oluştu.");
  }

  return response.json();
};


export const deleteProductImage = async (id) => {
  const response = await fetch(`${API_URL}/image/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Resim silinirken bir hata oluştu.");
  }
};

export const addCategory = async (categoryData) => {
  const response = await fetch(`${API_URL}/category`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error("Kategori eklenirken bir hata oluştu.");
  }
  return response.json();
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_URL}/category/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(), 
  });
  if (!response.ok) {
    throw new Error("Kategori silinirken bir hata oluştu.");
  }
};

export const Categories = async () => {
  
  const response = await fetch("http://localhost:8082/api/categories/v1", {
    method: "GET",
    headers:getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Kategori bilgileri çekilirken bir hata oluştu.");
  }
  return response.json();
};