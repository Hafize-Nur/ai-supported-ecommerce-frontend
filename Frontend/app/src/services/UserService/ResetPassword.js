const sendResetCode = async (email) => {
    try {
      const response = await fetch("http://localhost:8082/api/auth/v1/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error("Kod gönderme başarısız.");
      }
  
      const message = await response.text();
      alert(message); 
    } catch (error) {
      console.error("Hata:", error);
      alert(error.message);
    }
  };
  