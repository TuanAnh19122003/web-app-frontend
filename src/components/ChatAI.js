import React, { useState, useRef, useEffect } from "react";
import { Input, Button, List, Typography, Spin } from "antd";

const { TextArea } = Input;

function ChatAI() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const API_URL = process.env.REACT_APP_API_URL;

    // Scroll tự động về cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const handleSend = async (text = prompt) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        // Thêm tin nhắn người dùng
        setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
        setPrompt("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/ai`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: trimmed }),
            });

            const data = await res.json();
            const botText =
                res.ok && data.response
                    ? data.response
                    : "Mình chưa hiểu, bạn có thể nói rõ hơn?";

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: botText },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Network error" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Tin nhắn */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <List
                    dataSource={messages}
                    renderItem={(msg, idx) => (
                        <List.Item
                            key={idx}
                            style={{
                                justifyContent:
                                    msg.sender === "user" ? "flex-end" : "flex-start",
                                padding: 0,
                                marginBottom: 12, // Khoảng cách giữa các tin nhắn
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: msg.sender === "user" ? "#1890ff" : "#f0f0f0",
                                    color: msg.sender === "user" ? "#fff" : "#000",
                                    padding: "8px 14px",
                                    borderRadius: 16,
                                    maxWidth: "70%",
                                    wordBreak: "break-word",
                                }}
                            >
                                <Typography.Text>{msg.text}</Typography.Text>
                            </div>
                        </List.Item>
                    )}
                />
                {loading && <Spin size="small" style={{ alignSelf: "center", margin: 8 }} />}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div
                style={{
                    margin: 8,
                    display: "flex",
                    gap: 8,
                    padding: 8,
                    borderTop: "1px solid #f0f0f0",
                    borderRadius: 8,
                    backgroundColor: "#fafafa",
                }}
            >
                <TextArea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    placeholder="Nhập tin nhắn..."
                    style={{ flex: 1, borderRadius: 8 }}
                />
                <Button type="primary" onClick={() => handleSend()} disabled={loading}>
                    Gửi
                </Button>
            </div>
        </div>
    );
}

export default ChatAI;