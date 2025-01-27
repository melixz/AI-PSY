import React, { useState } from "react";
import ModeCard from "./ModeCard";
import SegmentBtn from "./ui/SegmentBtn";
import logo from "../assets/icons/logo.svg";
import { models } from "../helpers/models";

interface ChooseModelProps {
  onModelSelect: (modelId: number) => void;
}

const ChooseModel: React.FC<ChooseModelProps> = ({ onModelSelect }) => {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleModelClick = (modelId: number) => {
    setSelectedModel(modelId);
    if (modelId === 1) {
      onModelSelect(1);
    }
  };
  
  const handleStartConversation = () => {
    if (selectedModel !== null && selectedModel !== 1) {
      onModelSelect(selectedModel);
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {/* Прокручиваемая зона */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col w-[800px] ml-[5vw]">
          <div className="flex flex-col items-left mb-[44px]">
            {/* Иконка и дата */}
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="logo" className="w-[30px]" />
              <div className="text-body1 text-black_50">
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Заголовок */}
            <div className="text-heading3 mb-6 ml-[36px]">
              Выберите модель чата из предложенных
            </div>
          </div>

          {/* Карточки моделей */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {models.map((model) => (
              <ModeCard
                key={model.id}
                title={model.title}
                description={model.description}
                onClick={() => handleModelClick(model.id)}
                isSelected={selectedModel === model.id}
              />
            ))}
          </div>

          {/* Дополнительное поле под карточками */}
          {selectedModel !== null && selectedModel !== 1 && (
            <div className="mt-6">
              {/* Иконка и дата */}
              <div className="flex items-center gap-2 mb-2">
                <img src={logo} alt="logo" className="w-[30px]" />
                <div className="text-body1 text-black_50">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Текст сообщения */}
              <div className="flex flex-col bg-white p-4 rounded-lg">
                <div className="text-heading3 ml-[36px]">
                  {`Вы выбрали ${
                    models.find((model) => model.id === selectedModel)?.title
                  }.`}
                </div>
                <div className="text-heading3 ml-[36px]">
                  В дальнейшем направление можно менять, нажав на стрелку в верхнем левом углу чата.
                </div>
                <div className="text-heading3 mt-4 ml-[36px]">
                  Готовы начать беседу?
                </div>
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 mt-4">
                <SegmentBtn
                  title="Да, я готов(а) начать беседу"
                  isActive={hoveredButton === "start"}
                  onClick={handleStartConversation}
                  onMouseEnter={() => setHoveredButton("start")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-[265px] h-[40px] text-body1"
                />
                <SegmentBtn
                  title="Хочу узнать больше о направлении"
                  isActive={hoveredButton === "info"}
                  onClick={() => console.log("Информация о направлении")}
                  onMouseEnter={() => setHoveredButton("info")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="w-[311px] h-[40px] text-body1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseModel;
