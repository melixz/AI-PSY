import React from "react";
import NavBar from "../components/NavBar";
import Input from "../components/ui/Input";

export const HomePage: React.FC = () => {

  const handleSubmit = (value: string) => {
    console.log('Submitted:', value);
  };

  return (
    <div className="flex flex-col justify-start text-text">
      <NavBar />
      <div className="space-y-6 p-6">
        {/* Вариант 1: Инпут не нажат */}
        <div>
          <h2 className="mb-2 text-lg font-bold">Вариант 1: Инпут не нажат</h2>
          <Input placeholder="Введите сообщение" onSubmit={handleSubmit} />
        </div>

        {/* Вариант 3: Инпут неактивен */}
        <div>
          <h2 className="mb-2 text-lg font-bold">Вариант 3: Инпут неактивен</h2>
          <Input placeholder="Введите сообщение" disabled onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
