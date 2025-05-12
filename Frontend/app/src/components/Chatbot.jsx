import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Input, List, Typography } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { fetchChatHistory, sendMessageToBot } from "../services/chatbotService";
import Draggable from "react-draggable";
import "../css/chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const loadHistory = async () => {
    const history = await fetchChatHistory();
    setMessages(history);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const botResponse = await sendMessageToBot(input);
      const botMessage = { sender: "bot", text: botResponse.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    if (isOpen) loadHistory();
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Draggable>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        {isOpen ? (
          <Card
            className="chatbot-card"
            bodyStyle={{
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: 500,
            }}
          >
            {/* Başlık */}
            <div className="chatbot-header">
              Canlı Destek
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={toggleChatbot}
              />
            </div>

            {/* Mesajlar */}
            <div className="chat-messages">
              <List
                dataSource={messages}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    className={item.sender === "user" ? "user-msg" : "bot-msg"}
                  >
                    <Typography.Text
                      style={{
                        backgroundColor:
                          item.sender === "user" ? "#fd702d" : "#f1f1f1",
                        color: item.sender === "user" ? "#fff" : "#000",
                        padding: "6px 12px",
                        borderRadius: 16,
                        maxWidth: "80%",
                        display: "inline-block",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.text}
                    </Typography.Text>
                  </List.Item>
                )}
              />
              <div ref={messageEndRef} />
            </div>

            {/* Giriş alanı */}
            <div className="chatbot-input">
              <Input.Search
                placeholder="Mesaj yazın..."
                enterButton="Gönder"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSearch={handleSend}
              />
            </div>
          </Card>
        ) : (
          <Button
            className="chatbot-button"
            type="primary"
            shape="circle"
            icon={<MessageOutlined />}
            size="large"
            onClick={toggleChatbot}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#fd702d",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </div>
    </Draggable>
  );
};

export default Chatbot;
