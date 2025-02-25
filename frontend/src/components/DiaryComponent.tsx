import React from "react";
import InputDiary from "./ui/InputDiary";

const DiaryComponent: React.FC = () => {
  const handleSubmit = (text: string) => {
    console.log("Отправлено:", text);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <InputDiary
        placeholder="Опишите свои чувства словами или запишите голосом"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DiaryComponent;
