import React, { useState } from "react";
import logo from "../assets/icons/eve.svg";
import helpIcon from "../assets/icons/help.svg";
import settingsIcon from "../assets/icons/settings.svg";
import menuArrow from "../assets/icons/menu_arrow.svg";
import MenuDropdown from "./MenuDropdown";
import Help from "./common/Help";

interface Model {
  id: number;
  title: string;
  description: string;
}

interface NavBarProps {
  models: Model[];
  selectedModelId: number | null;
  onModelSelect: (modelId: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ models, selectedModelId, onModelSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-6 py-4  w-[70vw] h-[92px]">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-[48px] w-[48px] mr-4" />
          <button onClick={handleMenuToggle} className="flex items-center focus:outline-none">
            <img src={menuArrow} alt="Menu Arrow" className="h-[12px] w-[24px]" />
          </button>
        </div>

        <div className="flex items-center space-x-24">
          <div className="flex items-center space-x-6">
            <button 
              className="flex items-center text-black_50 hover:text-black" 
              onClick={() => setIsHelpOpen(true)}
            >
              <span className="mr-2">Помощь</span>
              <img src={helpIcon} alt="Help" className="h-[24px] w-[24px]" />
            </button>
            <button className="flex items-center text-black_50 hover:text-black">
              <span className="mr-2">Настройки</span>
              <img src={settingsIcon} alt="Settings" className="h-[24px] w-[24px]" />
            </button>
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <MenuDropdown
          models={models}
          selectedModelId={selectedModelId}
          onModelSelect={(modelId) => {
            onModelSelect(modelId);
            closeDropdown();
          }}
          onClose={closeDropdown}
        />
      )}

      {isHelpOpen && (
        <Help onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
};

export default NavBar;
