import React, { useEffect, useState } from "react";
import { Button } from "../button/Button";
import { v4 as uuidv4 } from "uuid";

export const Options = ({ currentOPtions, handleAnswerOptionClick }) => {
  const [options, setOptions] = useState([...currentOPtions]);
  useEffect(() => {
    setOptions([...currentOPtions]);
  }, [currentOPtions]);

  return (
    <div>
      {options.map((answerOption, index) => (
        <Button
          answerOption={answerOption}
          handleAnswerOptionClick={handleAnswerOptionClick}
          key={uuidv4()}
        />
      ))}
    </div>
  );
};
