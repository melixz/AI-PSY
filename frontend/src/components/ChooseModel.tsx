import React from "react";
import ModeCard from "./ModeCard";
import logo from "../assets/icons/logo.svg"; // Путь к иконке

interface ChooseModelProps {
  onModelSelect: () => void;
}

const ChooseModel: React.FC<ChooseModelProps> = ({ onModelSelect }) => {
  const models = [
    {
      id: 1,
      title: "Агент",
      description:
        "В разговоре с вами чат сам определяет проблему, используя все известные ему направления и тесты.",
    },
    {
      id: 2,
      title: "Направления психологии",
      description:
        "Здесь вы сможете выбирать направления психологии, по которым вас будет консультировать чат.",
    },
  ];

  return (
    <div className="flex flex-col mt-[20vh] ml-[10vw]">
      <div className="flex flex-col items-left mb-[44px]">
        {/* Иконка и дата */}
        <div className="flex items-center gap-2 mb-4">
          <img src={logo} alt="logo" className="w-[30px]" />
          <div className="text-body1 text-black_50">
            {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-heading3 mb-6 ml-[36px]">Выберите модель чата из предложенных</div>
      </div>

      {/* Карточки моделей */}
      <div className="flex gap-4">
        {models.map((model) => (
          <ModeCard
            key={model.id}
            title={model.title}
            description={model.description}
            onClick={onModelSelect}
            isSelected={false} // В данном случае не нужен выбор
          />
        ))}
      </div>
    </div>
  );
};

export default ChooseModel;
