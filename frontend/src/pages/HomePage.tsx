import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ChatComponent from "../components/ChatComponent";
import TestsComponent from "../components/TestsComponent";
import DiaryComponent from "../components/DiaryComponent";

export const HomePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode = Number(params.get("mode"));

  const [activeButton, setActiveButton] = useState<"main" | "history">("main");
  const [selectedMode, setSelectedMode] = useState<number | null>(initialMode);

  const renderModeComponent = () => {
    switch (selectedMode) {
      case 1:
        return <ChatComponent />;
      case 2:
        return <TestsComponent />;
      case 3:
        return <DiaryComponent />;
      default:
        return <div>Выберите режим для взаимодействия</div>;
    }
  };

  return (
    <div className="container-1920 flex bg-white text-text">
      <SideBar
        activeButton={activeButton}
        setActiveButton={setActiveButton}
        setSelectedMode={setSelectedMode}
      />
      <div className="flex flex-col flex-1 justify-between">
        <NavBar />
        <div className="p-6">{renderModeComponent()}</div>
      </div>
    </div>
  );
};

export default HomePage;
