import React from "react";
import ModeBar from "./ModeBar";
import SegmentBtn from "./ui/SegmentBtn";
import mainIcon from "../assets/icons/main.svg";
import mainIconAc from "../assets/icons/mainAc.svg";
import historyIcon from "../assets/icons/history.svg";
import historyIconAc from "../assets/icons/historyAc.svg";

interface SideBarProps {
  activeButton: "main" | "history";
  setActiveButton: (button: "main" | "history") => void;
  setSelectedMode: (mode: number | null) => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  activeButton,
  setActiveButton,
  setSelectedMode,
}) => {
  const handleMainClick = () => {
    setActiveButton("main");
    setSelectedMode(null);
  };

  const handleHistoryClick = () => {
    setActiveButton("history");
    setSelectedMode(null);
  };

  return (
    <div className="flex flex-col justify-between h-[100vh] w-[482px] px-[40px] py-[24px]">
      <ModeBar setSelectedMode={setSelectedMode} />
      <div className="flex justify-around mt-4 p-4">
        <SegmentBtn
          title="Главная"
          icon={<img src={mainIcon} alt="Главная" className="h-5 w-5" />}
          activeIcon={<img src={mainIconAc} alt="Главная" className="h-5 w-5" />}
          isActive={activeButton === "main"}
          onClick={handleMainClick}
        />
        <SegmentBtn
          title="История"
          icon={<img src={historyIcon} alt="История" className="h-5 w-5" />}
          activeIcon={<img src={historyIconAc} alt="История" className="h-5 w-5" />}
          isActive={activeButton === "history"}
          onClick={handleHistoryClick}
        />
      </div>
    </div>
  );
};

export default SideBar;
