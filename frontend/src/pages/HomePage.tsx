import React, { useState } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ChatComponent from "../components/ChatComponent";
import ChooseModel from "../components/ChooseModel";
import TestsComponent from "../components/TestsComponent";
import DiaryComponent from "../components/DiaryComponent";
import { models } from "../helpers/models";

// Укажите ваш API (env-переменные VITE)
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

// Сопоставляем ID модели -> конкретный URL чата
const MODEL_URL_MAP: Record<number, string> = {
  2: `${BASE_API_URL}/chat/ask_cbt`,
  3: `${BASE_API_URL}/chat/ask_gestalt`,
  4: `${BASE_API_URL}/chat/ask_psychoanalysis`,
  5: `${BASE_API_URL}/chat/ask_multi_direction`,
  6: `${BASE_API_URL}/chat/ask`, // Базовый GPT Chat
};

const HomePage: React.FC = () => {
  // Режимы: 0=ничего, 1=чат, 2=тесты, 3=дневник
  const [selectedMode, setSelectedMode] = useState<number | null>(0);

  // ID выбранной модели (2..6 => разные чаты). Если modelId=1 => Tests
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Нужно ли показывать выбор модели (ChooseModel)
  const [showChooseModel, setShowChooseModel] = useState<boolean>(false);

  // Функция переключения (из NavBar, MenuDropdown, ChooseModel)
  const handleModelSelect = (modelId: number) => {
    if (modelId === 1) {
      // "Тесты"
      setSelectedMode(2);       // Переходим на TestsComponent
      setSelectedModelId(null); // Сбросим чат-модель
      setShowChooseModel(false);
    } else {
      // Иначе (2..6) - чат
      setSelectedMode(1);
      setSelectedModelId(modelId);
      setShowChooseModel(false);
    }
  };

  // Определяем, какой компонент показывать
  const renderModeComponent = () => {
    // 1) Если mode=1 (чат) и showChooseModel=true -> ChooseModel
    if (selectedMode === 1 && showChooseModel) {
      return <ChooseModel onModelSelect={handleModelSelect} />;
    }

    // 2) Если mode=1 (чат) и есть selectedModelId -> ChatComponent
    if (selectedMode === 1 && selectedModelId) {
      const apiUrl = MODEL_URL_MAP[selectedModelId] ?? `${BASE_API_URL}/chat/ask`;
      return (
        <ChatComponent
          apiUrl={apiUrl}
          onNewDialog={() => {
            // При новом диалоге снова показываем выбор модели
            setShowChooseModel(true);
            // Можно сбросить selectedModelId, если хотим заново
          }}
        />
      );
    }

    // 3) Если mode=2 -> Tests
    if (selectedMode === 2) {
      return <TestsComponent />;
    }

    // 4) Если mode=3 -> Diary
    if (selectedMode === 3) {
      return <DiaryComponent />;
    }

    // Иначе "Выберите режим"
    return <div>Выберите режим для взаимодействия</div>;
  };

  return (
    <div className="flex h-screen bg-white text-text">
      {/* Сайдбар: задаёт режим (0=ничего, 1=чат, 2=тесты, 3=дневник) */}
      <SideBar
        activeButton="main"
        setActiveButton={() => {}}
        setSelectedMode={(mode) => {
          if (mode === 1) {
            // При выборе чата показываем ChooseModel
            setSelectedMode(1);
            setShowChooseModel(true);
          } else {
            // Иначе сразу переключаемся, скрывая ChooseModel
            setSelectedMode(mode);
            setShowChooseModel(false);
          }
        }}
      />
      <div className="flex flex-col flex-1">
        {/* NavBar с выпадающим списком моделей */}
        <NavBar
          models={models}
          selectedModelId={selectedModelId}
          onModelSelect={handleModelSelect}
        />

        {/* Основная зона под контент */}
        <div className="flex-1 min-h-0 p-6 overflow-auto">
          {renderModeComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
