import { getToken,getAuthHeaders,getUserIdFromToken } from "../../utils/auth";
// API URL
const API_URL = 'http://localhost:8082/api/admin/v1/users';

/// Kullanıcıları alma (filtreleme) - Sayfalama ile
export const getAllUsers = async (page = 0, size = 10) => {
  const token = getToken();
  try {
      const response = await fetch(`http://localhost:8082/api/admin/v1/users?page=${page}&size=${size}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          throw new Error('Kullanıcılar alınırken bir hata oluştu!');
      }

      const data = await response.json();

      // Pagination bilgilerini ve kullanıcıları döndür
      return {
          users: data.content, // Assuming 'content' contains the user list
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          currentPage: data.page,
          pageSize: data.size,
      };

  } catch (error) {
      console.error('service error:', error);
      throw error;
  }
};

  
  

// Yeni kullanıcı ekleme
export const createUser = async (user) => {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
    },
    body: JSON.stringify(user), 
  });

  if (!response.ok) {
    throw new Error('Kullanıcı eklenirken bir hata oluştu!');
  }

  return await response.json(); 
};

// Güncelleme işlemi
export const updateUser = async (id, user) => {
  const token = getToken(); 
  const userId = getUserIdFromToken(); 

  if (!userId) {
    throw new Error('Kullanıcı kimliği alınamadı!');
  }

  const response = await fetch(`http://localhost:8082/api/admin/v1/user/${id}`, { 
    method: 'PUT',
    headers: getAuthHeaders(), 
    body: JSON.stringify(user), 
  });

  if (!response.ok) {
    throw new Error('Kullanıcı güncellenirken bir hata oluştu!');
  }

  return await response.json();
};

// Silme işlemi
export const deleteUser = async (id) => {
  const response = await fetch(` http://localhost:8082/api/admin/v1/user/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders(), 
  });

  if (!response.ok) {
    throw new Error('Kullanıcı silinirken bir hata oluştu!');
  }

  
  if (response.status === 204) {
    return;
  }

  return await response.json();
};

