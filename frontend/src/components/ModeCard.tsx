import React, { useState } from 'react';

interface ModeCardProps {
  title: string;
  description: string;
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Когда не наведено или кликнуто, используем серую рамку.
  // Когда наведено и не кликнуто — делаем рамку "прозрачной",
  // чтобы псевдоэлемент поверх показал градиент.
  const borderClasses = isHovered && !isClicked 
    ? 'border-transparent'
    : 'border-gray';

  // Фон белый, пока не кликнули.
  // При клике меняем фон на градиентный класс bg-violet_7 (пример).
  const backgroundClasses = isClicked ? 'bg-violet_7' : 'bg-white';

  return (
    <div
      className={`relative p-6 rounded-[30px] w-[402px] h-[122px] border-[1px] ${borderClasses} ${backgroundClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >
      {/* При наведении и отсутствии клика добавляем псевдоэлемент-градиент */}
      {isHovered && !isClicked && (
        <div
          className="absolute inset-0 rounded-[30px] pointer-events-none z-0"
          style={{
            border: '2px solid transparent',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box',
          }}
        />
      )}
      <div className="relative text-lg font-semibold mb-2 z-10">{title}</div>
      <div className="relative text-gray-600 text-sm z-10">{description}</div>
    </div>
  );
};

export default ModeCard;
