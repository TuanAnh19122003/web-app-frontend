import React, { useState } from "react";
import ChatAI from "./ChatAI";
import { Button } from "antd";
import {
    UpOutlined,
    DownOutlined,
    CloseOutlined,
    MessageOutlined,
} from "@ant-design/icons";

function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const handleToggle = () => {
        if (open && !minimized) setMinimized(true);
        else if (open && minimized) setMinimized(false);
        else {
            setOpen(true);
            setMinimized(false);
        }
    };

    return (
        <>
            {/* Bong bóng chat */}
            {!open && (
                <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    icon={<MessageOutlined />}
                    onClick={handleToggle}
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        zIndex: 1000,
                        fontSize: 24,
                        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    }}
                />
            )}

            {/* Chat window */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        width: minimized ? 60 : 350,
                        height: minimized ? 60 : 500,
                        borderRadius: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        zIndex: 1000,
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            flex: "0 0 auto",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "10px 16px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        {!minimized && "Ollama Chat"}
                        <div style={{ display: "flex", gap: 8 }}>
                            <Button
                                type="text"
                                icon={minimized ? <UpOutlined /> : <DownOutlined />}
                                onClick={handleToggle}
                                style={{ color: "#fff", fontSize: 16 }}
                                title={minimized ? "Mở chat" : "Thu gọn"}
                            />
                            {!minimized && (
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => setOpen(false)}
                                    style={{ color: "#fff", fontSize: 16 }}
                                    title="Đóng"
                                />
                            )}
                        </div>
                    </div>

                    {/* Body */}
                    {!minimized && (
                        <div
                            style={{
                                flex: 1,
                                overflowY: "auto",
                            }}
                        >
                            <ChatAI />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ChatWidget;
