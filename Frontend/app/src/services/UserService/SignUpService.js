// services/SignupService.js
const BASE_URL = "http://localhost:8082/api/mail";

const fetchWithTimeout = async (url, options = {}, timeout = 360000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    const response = await fetch(url, options);
    clearTimeout(id);
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("İstek zaman aşımına uğradı.");
    }
    throw error;
  }
};

export const sendVerification = async (email) => {
  const response = await fetchWithTimeout(`${BASE_URL}/v1/send-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  }, 360000);

  if (!response.ok) {
    throw new Error("Sunucu hatası: Kod gönderilemedi.");
  }

  return response.text(); 
};

export const verifyCode = async (email, code) => {
  const response = await fetchWithTimeout(` http://localhost:8082/api/auth/v1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  }, 360000);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Kod doğrulama başarısız.");
  }

  return response.text(); // başarılıysa mesaj döner
};
