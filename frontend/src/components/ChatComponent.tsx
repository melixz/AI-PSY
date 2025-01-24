import React, { useState } from "react";
import Input from "./ui/Input";
import logo from "../assets/icons/logo.svg";

interface Message {
  id: number;
  sender: "assistant" | "user";
  content: string;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      content: "Что вас сейчас беспокоит? Расскажите о своих чувствах и мыслях",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (value: string) => {
    if (!value.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: value,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Имитация запроса к бэкенду
    setTimeout(() => {
      const assistantResponse: Message = {
        id: Date.now() + 1,
        sender: "assistant",
        content:
          "Здравствуйте! Спасибо, что поделились своими переживаниями. Я понимаю, как непросто...",
      };
      setMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    // flex + h-full => растягивается на высоту родителя
    <div className="flex flex-col w-full h-full min-h-0 bg-white">
      {/* 
         Блок с сообщениями:
         1) flex-1: растягивается
         2) min-h-0: разрешает вложенную прокрутку
         3) overflow-y-auto: вертикальный скролл, если сообщений много
      */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "assistant" ? "text-left" : "text-right"
            }`}
          >
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
                  ? "bg-white text-black"
                  : "bg-white text-black_50"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Панель управления */}
      <div className="flex-none flex justify-between items-center bg-white px-4 py-2">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded bg-gray-200">Translate</button>
          <button className="px-4 py-2 rounded bg-gray-200">Improve</button>
          <button className="px-4 py-2 rounded bg-gray-200">Make longer</button>
          <button className="px-4 py-2 rounded bg-gray-200">Make shorter</button>
        </div>
        <button className="px-4 py-2 rounded bg-gray-200">New dialog</button>
      </div>

      {/* Поле ввода */}
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
