interface SegmentBtnProps {
  title: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

const SegmentBtn: React.FC<SegmentBtnProps> = ({
  title,
  icon,
  activeIcon,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
}) => {
  return (
    <button
      className={`relative flex items-center justify-center
        h-[37px]
        rounded-full border-[1px] transition-all duration-300 ${
          isActive
            ? 'border-transparent text-transparent bg-clip-text bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9]'
            : 'border-none bg-white text-black_50'
        } ${className || ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isActive && (
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
        {icon && (
          <span className="inline-flex items-center justify-center w-5 h-5">
            {isActive ? activeIcon || icon : icon}
          </span>
        )}
        <span
          className={`${
            isActive
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9]'
              : 'text-black_50'
          }`}
        >
          {title}
        </span>
      </div>
    </button>
  );
};

export default SegmentBtn;
