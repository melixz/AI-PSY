import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ChatComponent from "../components/ChatComponent";
import ChooseModel from "../components/ChooseModel";
import TestsComponent from "../components/TestsComponent";
import DiaryComponent from "../components/DiaryComponent";
import { models } from "../helpers/models";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const MODEL_URL_MAP: Record<number, string> = {
  2: `${BASE_API_URL}/chat/ask_cbt`,
  3: `${BASE_API_URL}/chat/ask_gestalt`,
  4: `${BASE_API_URL}/chat/ask_psychoanalysis`,
  5: `${BASE_API_URL}/chat/ask_multi_direction`,
  6: `${BASE_API_URL}/chat/ask`,
};

export const HomePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const initialMode = Number(params.get("mode")) || 0;
  const initialModel = Number(params.get("model")) || 0;

  // Состояния
  const [activeButton, setActiveButton] = useState<"main" | "history">("main");
  const [selectedMode, setSelectedMode] = useState<number | null>(initialMode);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(
    initialModel > 0 ? initialModel : null
  );
  const [showChooseModel, setShowChooseModel] = useState<boolean>(
    initialMode === 1 && initialModel === 0
  );

  const handleModelSelect = (modelId: number) => {
    if (modelId === 1) {
      setSelectedMode(2);
      setSelectedModelId(null);
      setShowChooseModel(false);
    } else {
      setSelectedMode(1);
      setSelectedModelId(modelId);
      setShowChooseModel(false);
    }
  };

  const renderModeComponent = () => {
    if (selectedMode === 1 && showChooseModel) {
      return <ChooseModel onModelSelect={handleModelSelect} />;
    }

    if (selectedMode === 1 && selectedModelId) {
      const apiUrl =
        MODEL_URL_MAP[selectedModelId] ?? `${BASE_API_URL}/chat/ask`;

      return (
        <ChatComponent
          apiUrl={apiUrl}
          onNewDialog={() => {
            setShowChooseModel(true);
          }}
        />
      );
    }

    if (selectedMode === 2) {
      return <TestsComponent />;
    }

    if (selectedMode === 3) {
      return <DiaryComponent />;
    }

    return <div>Выберите режим для взаимодействия</div>;
  };

  return (
    <div className="flex h-screen bg-white text-text">
      <SideBar
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        setSelectedMode={(mode) => {
          if (mode === 1) {
            setSelectedMode(1);
            setShowChooseModel(true);
          } else {
            setSelectedMode(mode);
            setShowChooseModel(false);
          }
        }}
      />

      <div className="flex flex-col flex-1">
        <NavBar
          models={models}
          selectedModelId={selectedModelId}
          onModelSelect={handleModelSelect}
        />

        <div className="flex-1 min-h-0 p-6 overflow-auto">
          {renderModeComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
