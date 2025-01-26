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
      title: "Тесты",
      description:
        "Здесь вы можете пройти различные психологические тесты. Они помогут вам лучше понять себя, свои эмоции и поведение, а также выявить возможные проблемы и найти пути их решения.",
    },
    {
      id: 2,
      title: "Когнитивно-поведенческая терапия",
      description:
        "Учит изменять негативные мысли и поведенческие паттерны для улучшения эмоционального состояния и решения проблем.",
    },
    {
      id: 3,
      title: "Гештальт",
      description:
        "Помогает осознать свои чувства, потребности и переживания здесь и сейчас, чтобы восстановить целостность личности.",
    },
    {
      id: 4,
      title: "Психоанализ",
      description:
        "Исследует бессознательные мотивы, детские переживания и внутренние конфликты, чтобы понять причины текущих трудностей.",
    },
    {
      id: 5,
      title: "Мульти-ответ",
      description:
        "Предоставляет комплексные инструменты для общей оценки внутреннего состояния и принятия решений по дальнейшей терапии.",
    },
    {
      id: 6,
      title: "Базовый GPT Сhat",
      description:
        "Дефолтный чат джипити с сохранением контекста.",
    },
  ];

  return (
    <div className="flex flex-col w-[800px] h-[615px] ml-[5vw] mt-[10vh]">
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
      <div className="grid grid-cols-2 gap-2">
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
