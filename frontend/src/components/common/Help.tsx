import React from "react";
import { Link } from "react-router-dom";
import closeIcon from "../../assets/icons/close.svg";
import editIcon from "../../assets/icons/edit-copy.svg";
import linkIcon from "../../assets/icons/link-out.svg";
import flagIcon from "../../assets/icons/flag.svg";


interface HelpProps {
  onClose: () => void;
}

const Help: React.FC<HelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-[30px] p-[30px] w-[389px] h-[357px] shadow-lg">
        {/* Заголовок и кнопка закрытия */}
        <div className="flex justify-between items-center px-[16px] pb-[22px] pt-[10px]">
          <div className="text-lg font-heading3 text-black">Помощь</div>
          <button onClick={onClose} className="text-black hover:text-gray-600">
            <img src={closeIcon} alt="Закрыть" className="w-[12px] h-[12px]" />
          </button>
        </div>

        {/* Список ссылок */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-black">
            <img src={editIcon} alt="Email" className="w-5 h-5" />
            <span>gavrikblet@email.com</span>
          </div>

          <Link to="/help" className="flex items-center gap-3 font-heading4 text-black hover:text-black_50">
            <img src={linkIcon} alt="Ссылка" className="w-5 h-5" />
            <span>Помощь и часто задаваемые вопросы</span>
          </Link>

          <Link to="/terms" className="flex items-center gap-3 font-heading4 text-black hover:text-black_50">
            <img src={linkIcon} alt="Ссылка" className="w-5 h-5" />
            <span>Условия и политика</span>
          </Link>

          <Link to="/release-notes" className="flex items-center gap-3 font-heading4 text-black hover:text-black_50">
            <img src={linkIcon} alt="Ссылка" className="w-5 h-5" />
            <span>Примечания к выпуску</span>
          </Link>

          <Link to="/terms" className="flex items-center gap-3 font-heading4 text-black hover:text-black_50">
            <img src={flagIcon} alt="Флаг" className="w-5 h-5" />
            <span>Условия и политика</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
