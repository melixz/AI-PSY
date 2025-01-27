import React, { useState } from 'react';
import inputIcon from '../../assets/icons/inputIcon.svg';
import microphoneAc from '../../assets/icons/microphoneAc.svg';
import microphone from '../../assets/icons/microphone.svg';
import telegramAc from '../../assets/icons/tgAc.svg';
import telegram from '../../assets/icons/tg.svg';

interface InputProps {
  placeholder: string;
  disabled?: boolean;
  onSubmit: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, disabled = false, onSubmit }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (value.trim() === '' || isLoading || disabled) return;
    setIsLoading(true);
    onSubmit(value);

    setTimeout(() => {
      setValue('');
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && !disabled) {
      handleSend();
    }
  };

  return (
    <div className="w-[800px] h-[63px] flex flex-col space-y-2">
      <div
        className={`
          relative flex items-center px-4 py-2 rounded-full transition-all duration-300
          ${disabled ? 'cursor-not-allowed' : ''}
        `}

        style={
          disabled
            ? {
                border: '1px solid #ccc',
                background: '#f5f5f5',
              }
            : isFocused
            ? {
                border: '1px solid transparent',
                background:
                  'linear-gradient(#fff, #fff) padding-box, linear-gradient(to right, #6FDBB8, #6EBFF9) border-box',
              }
            : {
                border: '1px solid #ccc',
                background:
                  'linear-gradient(90deg, rgba(154, 112, 177, 0.07) 0%, rgba(237, 148, 148, 0.07) 100%)',
              }
        }
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {isLoading ? (
          <div className="loader w-[20px] h-[20px] border-[1px] border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        ) : (
          <img src={inputIcon} alt="icon" className="w-[20px] h-[20px]" />
        )}
        <input
          type="text"
          value={isLoading ? 'Загрузка сообщения...' : value}
          disabled={disabled || isLoading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 px-2 py-1 bg-transparent outline-none
            ${disabled || isLoading ? 'text-gray-400' : 'text-gray-800'}
          `}
        />
        {!isLoading && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => console.log('Voice input triggered')}
            className={`mx-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <img
              src={disabled ? microphone : microphoneAc}
              alt="microphone"
              className="w-[20px] h-[20px]"
            />
          </button>
        )}
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={handleSend}
          className={`mx-2 ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <img
            src={disabled ? telegram : telegramAc}
            alt="send"
            className="w-[20px] h-[20px]"
          />
        </button>
      </div>
      <span className="text-black_50 text-subtitle2 text-right">
        Нажмите клавишу ESC или отмену
      </span>
    </div>
  );
};

export default Input;
