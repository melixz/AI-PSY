import React, { useState } from "react";
import Checkbox from "./ui/Checkbox";

interface Model {
  id: number;
  title: string;
  description: string;
}

interface MenuDropdownProps {
  models: Model[];
  selectedModelId: number | null;
  onModelSelect: (modelId: number) => void;
  onClose: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  models,
  selectedModelId,
  onModelSelect,
  onClose,
}) => {
  // Локальный стейт, какой модельный id сейчас выбран (для визуального чекбокса)
  const [selectedId, setSelectedId] = useState<number | null>(selectedModelId);

  // Хендлер для клика по чекбоксу
  const handleCheckboxChange = (modelId: number) => {
    setSelectedId(modelId);     // Запомним выбранную модель
    onModelSelect(modelId);     // Уведомим родителя о выборе
    onClose();                  // Закроем дропдаун
  };

  return (
    // Полупрозрачный фон, закрывается при клике "мимо" (onClick={onClose})
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      {/* Белый блок дропдауна, клик по которому не закрывает его */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[567px] h-[649px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {models && models.length > 0 ? (
          models.map((model) => (
            <div
              key={model.id}
              className="flex justify-between mb-[2px] py-[12px]"
            >
              <div className="ml-4">
                <p className="text-black text-heading4 mt-[8px]">
                  {model.title}
                </p>
                <p className="text-black_50 text-body1">
                  {model.description}
                </p>
              </div>
              <Checkbox
                label=""
                // Выбран, если selectedId совпадает с model.id
                checked={selectedId === model.id}
                onChange={() => handleCheckboxChange(model.id)}
              />
            </div>
          ))
        ) : (
          <p className="text-black text-heading4 text-center">
            Нет доступных моделей
          </p>
        )}
      </div>
    </div>
  );
};

export default MenuDropdown;
