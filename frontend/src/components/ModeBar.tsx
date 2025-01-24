import React, { useState } from "react";
import ModeCard from "./ModeCard";
import Checkbox from "./ui/Checkbox";

interface Mode {
  id: number;
  title: string;
  description: string;
}

interface ModeBarProps {
  setSelectedMode: (mode: number | null) => void;
}

const ModeBar: React.FC<ModeBarProps> = ({ setSelectedMode }) => {
  const modes: Mode[] = [
    {
      id: 1,
      title: "Чат",
      description:
        "Здесь вы сможете получить квалифицированную помощь и поддержку по различным вопросам психологии в формате чата.",
    },
    {
      id: 2,
      title: "Тесты",
      description:
        "Здесь вы можете пройти различные психологические тесты. Они помогут вам лучше понять себя, свои эмоции и поведение.",
    },
    {
      id: 3,
      title: "Дневник",
      description:
        "Здесь вы можете написать свои мысли не в формате диалога, а чат их проанализирует.",
    },
  ];

  const checkboxes = [
    { id: 1, label: "Показывать ссылку на ресурс" },
    { id: 2, label: "Показывать предлагаемый prompt" },
  ];

  const [selectedMode, setLocalSelectedMode] = useState<number | null>(null);
  const [checkboxStates, setCheckboxStates] = useState<{ [key: number]: boolean }>(
    checkboxes.reduce((acc, checkbox) => ({ ...acc, [checkbox.id]: false }), {})
  );

  const toggleCheckbox = (id: number) => {
    setCheckboxStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleModeClick = (id: number) => {
    const newMode = selectedMode === id ? null : id;
    setLocalSelectedMode(newMode);
    setSelectedMode(newMode);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-body2 text-black">Mode</h1>
      <div className="space-y-4">
        {modes.map((mode) => (
          <div key={mode.id}>
            <ModeCard
              title={mode.title}
              description={mode.description}
              onClick={() => handleModeClick(mode.id)}
              isSelected={selectedMode === mode.id}
            />
            {mode.id === 1 && selectedMode === 1 && (
              <div className="mt-4 space-y-3">
                {checkboxes.map((checkbox) => (
                  <Checkbox
                    key={checkbox.id}
                    label={checkbox.label}
                    checked={checkboxStates[checkbox.id]}
                    onChange={() => toggleCheckbox(checkbox.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeBar;
