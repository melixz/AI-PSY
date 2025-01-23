import React from 'react';
import ModeBar from "./ModeBar";
import SegmentBtn from "./ui/SegmentBtn";
import mainIcon from "../assets/icons/main.svg";
import mainIconAc from "../assets/icons/mainAc.svg";
import historyIcon from "../assets/icons/history.svg";
import historyIconAc from "../assets/icons/historyAc.svg";

export const SideBar: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-[100vh] w-[482px] px-[40px] py-[24px]">
      <ModeBar />
      <div className="flex justify-around mt-4 p-4">
        <SegmentBtn
          title="Главная"
          icon={<img src={mainIcon} alt="Главная" className="h-5 w-5" />}
          activeIcon={<img src={mainIconAc} alt="Главная" className="h-5 w-5" />}
          onClick={() => console.log("Главная clicked")}
        />
        <SegmentBtn
          title="История"
          icon={<img src={historyIcon} alt="История" className="h-5 w-5" />}
          activeIcon={<img src={historyIconAc} alt="История" className="h-5 w-5" />}
          onClick={() => console.log("История clicked")}
        />
      </div>
    </div>
  );
};

export default SideBar;
