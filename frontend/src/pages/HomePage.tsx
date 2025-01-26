import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ChatComponent from "../components/ChatComponent";
import ChooseModel from "../components/ChooseModel";
import TestsComponent from "../components/TestsComponent";
import DiaryComponent from "../components/DiaryComponent";

// Сопоставление modelId -> URL 
const MODEL_URL_MAP: Record<number, string> = {
  2: "http://185.70.196.104/chat/ask_cbt",
  3: "http://185.70.196.104/chat/ask_gestalt",
  4: "http://185.70.196.104/chat/ask_psychoanalysis",
  5: "http://185.70.196.104/chat/ask_multi_direction",
  6: "http://185.70.196.104/chat/ask",
};

export const HomePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode = Number(params.get("mode"));

  // Активная вкладка: main | history
  const [activeButton, setActiveButton] = useState<"main" | "history">("main");
  // Выбранный режим (1 - Chat, 2 - Tests, 3 - Diary, ...)
  const [selectedMode, setSelectedMode] = useState<number | null>(initialMode);
  // Нужно ли показывать выбор модели (ChooseModel)
  const [showChooseModel, setShowChooseModel] = useState<boolean>(
    selectedMode === 1
  );

  // Храним выбранную модель (2,3,4,5,6) - null если не выбрано
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Функция, вызываемая при выборе модели
  const handleModelSelect = (modelId: number) => {
    // Если пользователь выбрал "Тесты" (id=1) — переключаемся на TestsComponent:
    if (modelId === 1) {
      setSelectedMode(2);
      return;
    }
    // Иначе это какой-то чат (2..6)
    setSelectedModelId(modelId);
    // Скрываем выбор модели:
    setShowChooseModel(false);
  };

  const renderModeComponent = () => {
    // Если выбрали "Чат", но ещё не выбрали модель - показываем ChooseModel
    if (selectedMode === 1 && showChooseModel) {
      return (
        <div className="flex-1 min-h-0">
          <ChooseModel onModelSelect={handleModelSelect} />
        </div>
      );
    }

    // Если выбрали режим Chat (id=1), но уже модель тоже выбрана
    if (selectedMode === 1 && selectedModelId) {
      // Определяем URL по ID модели:
      const apiUrl = MODEL_URL_MAP[selectedModelId] ?? "http://185.70.196.104/chat/ask";
      return (
        <ChatComponent
          onNewDialog={() => setShowChooseModel(true)}
          apiUrl={apiUrl}
        />
      );
    }

    // Остальные режимы:
    switch (selectedMode) {
      case 2:
        return <TestsComponent />;
      case 3:
        return <DiaryComponent />;
      default:
        return <div>Выберите режим для взаимодействия</div>;
    }
  };

  return (
    <div className="flex h-screen bg-white text-text">
      <SideBar
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        setSelectedMode={setSelectedMode}
      />
      <div className="flex flex-col flex-1">
        <NavBar />
        <div className="flex-1 min-h-0 p-6 overflow-auto ">
          {renderModeComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
