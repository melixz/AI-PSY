import React, { useState } from 'react';

interface SegmentBtnProps {
  title: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  onClick: () => void;
}

const SegmentBtn: React.FC<SegmentBtnProps> = ({ title, icon, activeIcon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="relative flex items-center
                 w-[149px] h-[37px]
                 rounded-full border-2 border-transparent
                 bg-white transition-all duration-300
                 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {isHovered && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none z-0"
          style={{
            border: '1px solid transparent',
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box',
          }}
        />
      )}

      <div className="relative z-10 flex items-center space-x-2 py-2 px-4">
        <span
          className={
            isHovered
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9]'
              : 'text-black_50'
          }
        >
          <span className="inline-flex items-center justify-center w-5 h-5">
            {isHovered ? activeIcon : icon}
          </span>
        </span>
        <span
          className={
            isHovered
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9]'
              : 'text-black_50'
          }
        >
          {title}
        </span>
      </div>
    </button>
  );
};

export default SegmentBtn;
