import React, { useState } from "react";
import Input from "./ui/Input";
import logo from "../assets/icons/logo.svg";

interface Message {
  id: number;
  sender: "assistant" | "user";
  content: string;
}

interface ChatComponentProps {
  onNewDialog: () => void;
  apiUrl: string; // <- ключевой момент: URL для fetch
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onNewDialog, apiUrl }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      content: "Здравствуйте! Чем могу помочь?",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: value,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value }),
      });

      if (response.ok) {
        const data = await response.json(); // { answer: "..." }
        const assistantResponse: Message = {
          id: Date.now() + 1,
          sender: "assistant",
          content: data.answer,
        };
        setMessages((prev) => [...prev, assistantResponse]);
      } else if (response.status === 422) {
        const errorData = await response.json(); // { detail: [...] }
        const errorMessage = errorData?.detail?.[0]?.msg || "Ошибка валидации";
        const assistantResponse: Message = {
          id: Date.now() + 1,
          sender: "assistant",
          content: `Извините, произошла ошибка: ${errorMessage}`,
        };
        setMessages((prev) => [...prev, assistantResponse]);
      } else {
        const assistantResponse: Message = {
          id: Date.now() + 1,
          sender: "assistant",
          content: `Извините, ошибка на сервере (код ${response.status}).`,
        };
        setMessages((prev) => [...prev, assistantResponse]);
      }
    } catch (error) {
      console.error("Ошибка при запросе:", error);
      const assistantResponse: Message = {
        id: Date.now() + 1,
        sender: "assistant",
        content: "Извините, не удалось связаться с сервером.",
      };
      setMessages((prev) => [...prev, assistantResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Поле с диалогом */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "assistant" ? "text-left" : "text-right"
            }`}
          >
            {/* Заголовок с временем / логотипом */}
            {message.sender === "assistant" ? (
              <div className="flex items-center gap-[16px] mb-1">
                <img src={logo} alt="logo" className="w-[30px]" />
                <div className="text-xs text-gray-400">
                  {new Date(message.id).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 mb-1">
                {new Date(message.id).toLocaleTimeString()}
              </div>
            )}
            <div
              className={`inline-block px-11 py-2 rounded-lg ${
                message.sender === "assistant"
                  ? "bg-white text-black text-heading3"
                  : "bg-white text-black_50 text-heading3"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* Сообщение ожидания */}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="flex items-center gap-[16px] mb-1">
              <img src={logo} alt="logo" className="w-[30px]" />
              <div className="text-xs text-gray-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className="inline-block px-11 py-2 rounded-lg bg-white text-black_50 text-heading3 italic">
              Я рядом. Мне нужно просто немного подумать.
            </div>
          </div>
        )}
      </div>

      {/* Панель управления */}
      <div className="flex-none flex justify-end items-center bg-white px-4 py-2">
        <button
          className="px-4 py-2 rounded bg-gray-200"
          onClick={onNewDialog}
        >
          New dialog
        </button>
      </div>

      {/* Инпут */}
      <div className="flex-none bg-white p-4">
        <Input
          placeholder="Введите сообщение"
          disabled={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ChatComponent;
