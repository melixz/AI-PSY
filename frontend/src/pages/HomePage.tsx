import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ChatComponent from "../components/ChatComponent";
import ChooseModel from "../components/ChooseModel";
import DiaryComponent from "../components/DiaryComponent";

export const HomePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode = Number(params.get("mode"));

  const [activeButton, setActiveButton] = useState<"main" | "history">("main");
  const [selectedMode, setSelectedMode] = useState<number | null>(initialMode);
  const [showChooseModel, setShowChooseModel] = useState<boolean>(
    selectedMode === 1
  );

  const renderModeComponent = () => {
    if (selectedMode === 1 && showChooseModel) {
      return <ChooseModel onModelSelect={() => setShowChooseModel(false)} />;
    }
    switch (selectedMode) {
      case 1:
        return <ChatComponent />;
      case 2:
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
        <div className="flex-1 min-h-0 p-6 overflow-hidden ">
          {renderModeComponent()}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
