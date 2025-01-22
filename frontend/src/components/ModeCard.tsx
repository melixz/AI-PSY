import React, { useState } from 'react';
interface ModeCardProps {
  title: string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  const borderClasses = isHovered && !isSelected
    ? 'border-transparent'
    : isSelected
    ? 'border-blue'
    : 'border-gray';

  const backgroundClasses = isSelected ? 'bg-violet_7' : 'bg-white';

  return (
    <div
      className={`relative p-6 rounded-[30px] w-[402px] h-[122px] border-[1px] ${borderClasses} ${backgroundClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered && !isSelected && (
        <div
          className="absolute inset-0 rounded-[30px] pointer-events-none z-0"
          style={{
            border: '2px solid transparent',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box',
          }}
        />
      )}
      <div className="relative text-heading4 text-black mb-2 z-10">{title}</div>
      <div className="relative text-body1 text-black_50 z-10">{description}</div>
    </div>
  );
};

export default ModeCard;
