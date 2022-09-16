import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export const PlayEach = ({
  currentOPtions,
  handleAnswerOptionClick,
  isAttempted,
  hasMultiAns,
  gotoNextQuestion,
  questions,
  countAnswer,
  currentQuestion,
  keepTrack,
}) => {
  return (
    <div className="text-center">
      <Flex direction="column" mb="5">
        {currentOPtions.map((answerOption, index) => {
          const id = nanoid(3);
          return (
            <div className="col-12 m-1" key={id}>
              <Button
                colorScheme={keepTrack?.includes(index) ? "red" : "teal"}
                onClick={() => {
                  handleAnswerOptionClick(index);
                }}
              >
                {answerOption.answerText}
              </Button>
            </div>
          );
        })}
        {questions[currentQuestion]?.answerCount > 1 && (
          <div className="form-text text-end">
            This question has multiple answers
          </div>
        )}
      </Flex>
      <Flex justify="space-around">
        {currentQuestion !== 0 && (
          <Button
            colorScheme="facebook"
            onClick={() => {
              gotoNextQuestion("back");
            }}
          >
            back
          </Button>
        )}
        <Button
          colorScheme="blue"
          onClick={() => {
            gotoNextQuestion();
          }}
        >
          Submit {currentQuestion !== questions?.length - 1 && "& Next"}
        </Button>
      </Flex>
    </div>
  );
};
