import React from "react";
import closeIcon from "../../assets/icons/close.svg";

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[30px] p-[30px] w-[834px] shadow-lg">
        <div className="flex items-center justify-between pt-[10px] pb-[22px] px-[40px] font-heading3 text-black">
          <div>Настройки</div>
          <button onClick={onClose}>
            <img src={closeIcon} alt="Закрыть" className="w-[12px] h-[12px]"/>
          </button>
        </div>
        <div className="flex items-center justify-center">
          {/* <SideBarCommon /> */}
          SideBar
          Компонент
        </div>
      </div>
    </div>
  )
};

export default Settings;