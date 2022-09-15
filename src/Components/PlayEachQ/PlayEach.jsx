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
      <div className="answer-section form-check d-flex flex-column mb-3">
        {currentOPtions.map((answerOption, index) => {
          const id = nanoid(3);
          return (
            <div className="col-12 m-1" key={id}>
              <button
                className={`btn ${
                  keepTrack?.includes(index)
                    ? "btn-warning w-50"
                    : "btn-outline-dark w-50"
                }`}
                onClick={() => {
                  handleAnswerOptionClick(index);
                }}
              >
                {answerOption.answerText}
              </button>
            </div>
          );
        })}
        {questions[currentQuestion]?.answerCount > 1 && (
          <div className="form-text text-end">
            This question has multiple answers
          </div>
        )}
      </div>
      <div className="d-flex justify-content-around">
        {
          <button
            className="btn btn-dark"
            onClick={() => {
              gotoNextQuestion("back");
            }}
            disabled={currentQuestion === 0}
          >
            back
          </button>
        }
        <button
          className="btn btn-info"
          onClick={() => {
            gotoNextQuestion();
          }}
        >
          Submit {currentQuestion !== questions?.length - 1 && "& Next"}
        </button>
      </div>
    </div>
  );
};
