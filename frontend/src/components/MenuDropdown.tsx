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
  const [selectedId, setSelectedId] = useState<number | null>(selectedModelId);

  const handleCheckboxChange = (modelId: number) => {
    setSelectedId(modelId);
    onModelSelect(modelId); // Переход к выбранному компоненту
    onClose(); // Закрываем дропдаун
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[567px] h-[649px] relative"
        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие
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
                <p className="text-black_50 text-body1">{model.description}</p>
              </div>
              <Checkbox
                label=""
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
