import React, { useState } from "react";
import microphoneAc from "../../assets/icons/microphoneAc.svg";
import microphone from "../../assets/icons/microphone.svg";
import SegmentBtn from "./SegmentBtn";

interface InputDiaryProps {
  placeholder: string;
  disabled?: boolean;
  onSubmit: (value: string) => void;
}

const InputDiary: React.FC<InputDiaryProps> = ({
  placeholder,
  disabled = false,
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Моковый ответ после отправки
  const mockResponse =
    "Спасибо за ваш дневниковый вход! Ваши чувства и мысли важны. Постарайтесь обратить внимание на повторяющиеся эмоции и ситуации, чтобы лучше понять себя.";

  const handleSend = () => {
    if (value.trim() === "" || isLoading || disabled) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true); // Переход на блок ответа
      onSubmit(value);
    }, 1500);
  };

  const handleSave = () => {
    if (isSubmitted) {
      alert("Сохранено");
    } else {
      handleSend(); // Если инпут активен, сначала отправляем
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading && !disabled) {
      handleSend();
    }
  };

  const handleCancel = () => {
    setValue("");
    setIsRecording(false);
    setIsSubmitted(false);
  };

  return (
    <div className="w-[800px] h-auto flex flex-col space-y-10">
      {!isSubmitted ? (
        // 🔹 **Блок ввода**
        <div
          className={`
            relative flex items-center px-4 py-2 rounded-full transition-all duration-300
            ${disabled ? "cursor-not-allowed" : ""}
          `}
          style={
            disabled
              ? {
                  border: "1px solid #ccc",
                  background: "#f5f5f5",
                }
              : isFocused
              ? {
                  border: "1px solid transparent",
                  background:
                    "linear-gradient(#fff, #fff) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box",
                }
              : {
                  border: "1px solid #ccc",
                  background:
                    "linear-gradient(90deg, rgba(154, 112, 177, 0.07) 0%, rgba(237, 148, 148, 0.07) 100%)",
                }
          }
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <input
            type="text"
            value={isLoading ? "Загрузка сообщения..." : value}
            disabled={disabled || isLoading}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              flex-1 px-2 py-1 bg-transparent outline-none
              ${disabled || isLoading ? "text-gray-400" : "text-gray-800"}
            `}
          />
          {!isLoading && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsRecording(!isRecording)}
              className={`mx-2 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <img
                src={isRecording ? microphoneAc : microphone}
                alt="microphone"
                className="w-[20px] h-[20px]"
              />
            </button>
          )}
        </div>
      ) : (
        // 🔹 **Блок ответа после отправки**
        <div
          className="w-[808px] h-[690px] px-6 py-6 overflow-y-auto rounded-[30px] text-gray-800 text-heading3 mt-[5vh]"
          style={{
            border: "1px solid transparent",
            background:
              "linear-gradient(#fff, #fff) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box",
          }}
        >
          {mockResponse}
        </div>
      )}

      {/* 🔹 **Кнопки остаются после отправки** */}
      <div className="h-[40px] flex justify-center gap-4 items-center">
        <SegmentBtn title="Отмена" isActive={false} onClick={handleCancel} />
        <SegmentBtn title="Сохранить" isActive={true} onClick={handleSave} />
      </div>
    </div>
  );
};

export default InputDiary;
