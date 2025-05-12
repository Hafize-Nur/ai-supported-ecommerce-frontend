import { getUserIdFromToken, getToken } from "../utils/auth";
const API_BASE_URL = "http://localhost:8082/api/chatbot/v1"; 

// Kullanıcıdan mesajı gönderir, bot cevabını alır
export const sendMessageToBot = async (message) => {
    try {
        const token = getToken();
        
        if (!token) {
          throw new Error("Kullanıcı girişi yapılmamış");
        }
      
    const response = await fetch(`${API_BASE_URL}/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message: message }), // QuestionDto'ya uygun gönderiyoruz
    });

    if (!response.ok) {
      throw new Error("Sunucu hatası");
    }

    const reply = await response.text(); // Cevap plain text gibi gözüküyor
    return { reply };
  } catch (error) {
    console.error("Bot mesajı gönderilirken hata oluştu:", error);
    return { reply: "Üzgünüm, şu anda yardımcı olamıyorum." };
  }
};

//  cevap listesi için
export const fetchChatHistory = async () => {
  // Şimdilik boş döndürüyoruz
  return [];
};
