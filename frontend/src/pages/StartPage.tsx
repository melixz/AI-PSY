import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Используем React Router для переходов
import NavBar from "../components/NavBar";
import logo from "../assets/icons/logo.svg";
import ModeCard from "../components/ModeCard";

interface Mode {
  id: number;
  title: string;
  description: string;
}

export const StartPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const navigate = useNavigate();

  const modes: Mode[] = [
    {
      id: 1,
      title: "Чат",
      description:
        "Здесь вы сможете получить квалифицированную помощь и поддержку по вопросам психологии в формате чата.",
    },
    {
      id: 2,
      title: "Тесты",
      description:
        "Здесь вы можете пройти различные психологические тесты. Они помогут вам лучше понять себя, свои эмоции и поведение, а также выявить возможные проблемы и найти пути их решения.",
    },
    {
      id: 3,
      title: "Дневник",
      description:
        "Здесь вы можете написать свои мысли вне формата диалога, а чат их проанализирует и будет использовать информацию для дальнейшего взаимодействия с вами в формате чата.",
    },
  ];

  const handleModeClick = (modeId: number) => {
    setSelectedMode(modeId);
    navigate(`/home?mode=${modeId}`);
  };

  return (
    <div className="container-1438 flex flex-col items-center h-[100vh] bg-white">
      <NavBar />
      <div className="flex flex-col justify-center items-center w-[800px] h-[755px] mt-[3vh]">
        <div className="text-heading1 text-text mb-[2vh]">Psychological Chat GPT</div>
        <div className="text-subtitle1 text-black_50 mb-[3vh]">Ver 4.0 Mar 14</div>
        <div className="flex items-start py-[24px] pr-[100px] gap-[16px]">
          <img src={logo} alt="logo" className="w-[27px]" />
          <div className="flex flex-col">
            <div className="text-black text- mb-[2vh]">2.03 PM, 15 Nov</div>
            <div className="text-black text-">
              Приветствуем вас в нашем психологическом джипити-чате! Мы рады, что вы решили присоединиться к нам. Здесь вы сможете получить квалифицированную помощь и поддержку по вопросам психологии и пройти различные психологические тесты, а также записать свои мысли в дневнике. 
              <br />
              Однако перед тем как начать консультацию, нам нужно выбрать режим для дальнейшего взаимодействия.
              <br />
              <br />
              Это может быть:
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-[2vh] mb-[4vh]">
          {modes.map((mode) => (
            <ModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              onClick={() => handleModeClick(mode.id)}
              isSelected={selectedMode === mode.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
