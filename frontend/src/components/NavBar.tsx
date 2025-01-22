import React from 'react';
import logo from '../assets/icons/logo.svg';
import helpIcon from '../assets/icons/help.svg';
import settingsIcon from '../assets/icons/settings.svg';

// Моковые данные с сервера
const mockUsers = [
  { name: 'Антон', last_name: 'Антонов' },
  { name: 'Иван', last_name: 'Иванов' },
  { name: 'Мария', last_name: 'Сидорова' },
];

const mockActiveUsersCount = 35000;

const NavBar: React.FC = () => {
  // Берём первого пользователя из мокового массива
  const currentUser = mockUsers[0];
  const activeUsers = mockActiveUsersCount;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white w-[1438px] h-[92px]">
      {/* Левая часть с логотипом и активными пользователями */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[48px] w-[48px] mr-4" />
        <div>
          <h1 className="text-lg font-heading3">PSI GPT</h1>
          <div className="text-sm text-transparent bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9] bg-clip-text">• Active {activeUsers.toLocaleString()} people</div>
        </div>
      </div>

      {/* Правая часть с иконками и именем пользователя */}
      <div className="flex items-center space-x-24">
        <div className='flex items-center space-x-6'>
          <button className="flex items-center text-black_50 hover:text-black">
            <span className="mr-2">Помощь</span>
            <img src={helpIcon} alt="Help" className="h-[24px] w-[24px]" />
          </button>
          <button className="flex items-center text-black_50 hover:text-black">
            <span className="mr-2">Настройки</span>
            <img src={settingsIcon} alt="Settings" className="h-[24px] w-[24px]" />
          </button>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-blue rounded-full mr-2"></span>
          <span className="text-gray-700 font-medium">
            {currentUser.name} {currentUser.last_name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
