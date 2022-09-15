import React, { useEffect, useRef, useState } from "react";
import { PlayEach } from "../PlayEachQ/PlayEach";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ScoreBoard } from "./ScoreBoard";
import { ToastContainer, toast } from "react-toastify";

export const Quiz = ({ questions }) => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentOPtions, setCurrentOPtions] = useState(
    questions[0].answerOptions
  );
  const [showScore, setShowScore] = useState(false);
  const [keepTrack, setKeepTrack] = useState([]);
  const score = useRef([]);
  const countAnswer = useRef(0);
  const [isAttempted, setIsAttempted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  // console.log("score", score.current);
  //console.log("track--", keepTrack);
  const handleAnswerOptionClick = (index) => {
    if (score.current[currentQuestion]) {
    }
    //console.log(":track", keepTrack);

    if (questions[currentQuestion].hasMultiAns) {
      if (keepTrack.includes(index)) {
        let values = [...keepTrack];
        let ansIndex = values.indexOf(index);
        values.splice(+ansIndex, 1);
        setKeepTrack([...values]);
      } else setKeepTrack([...keepTrack, index]);
    } else {
      if (keepTrack.includes(index)) {
        setKeepTrack([]);
      } else {
        if (keepTrack.length > 0) {
          setKeepTrack([index]);
        } else {
          setKeepTrack([...keepTrack, index]);
        }
      }
    }
  };

  const getScore = () => {
    /// console.log("score", score.current);
    axios
      .post(
        `https://quiz-backend-production.up.railway.app/quiz/score/${id}`,
        score.current
      )
      .then((res) => {
        //console.log(res);
        setShowScore(true);
        setFinalScore(res.data.result);
      })
      .catch((err) => {
        // console.log("err:", err);
        toast.warn("Something went wrong");
      });
  };

  const gotoNextQuestion = (back) => {
    if (back) {
      setKeepTrack([]);
      const prevQuestion = currentQuestion - 1;
      if (prevQuestion >= 0) {
        setCurrentQuestion(prevQuestion);
        setKeepTrack(score.current[prevQuestion]);
      }
    } else {
      if (score.current[currentQuestion]) {
        const nextQuestion = currentQuestion + 1;
        if (score.current[nextQuestion]) {
          setKeepTrack(score.current[nextQuestion]);
        } else {
          setKeepTrack([]);
        }
        if (nextQuestion < questions.length) {
          countAnswer.current = 0;
          setCurrentQuestion(nextQuestion);
        } else {
          getScore();
        }
      } else {
        score.current.push(keepTrack);
        setKeepTrack([]);
        setIsAttempted(false);
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
          countAnswer.current = 0;
          setCurrentQuestion(nextQuestion);
        } else {
          getScore();
        }
      }
    }
  };
  useEffect(() => {
    setCurrentOPtions([...questions[currentQuestion].answerOptions]);
    setIsAttempted(false);
  }, [currentQuestion]);

  return (
    <div>
      <div>
        {showScore ? (
          <ScoreBoard finalScore={finalScore} questions={questions} />
        ) : (
          <>
            <div className=" card col-md-6 col-lg-6 m-auto shadow-lg">
              <div className="question-section card-header">
                <div className="question-count text-end text-success">
                  <span>
                    <b>Question </b> {currentQuestion + 1}
                  </span>
                  /{questions.length}
                </div>
                <div className="question-text text-center text-danger">
                  <h5>
                    <b className="text-danger">Question: </b>
                    {questions[currentQuestion].question}
                  </h5>
                </div>
              </div>
              <div className="card-body">
                <div className="question-count text-end">
                  <span>
                    {questions[currentQuestion].hasMultiAns &&
                      "Question has Multiple Answers"}
                  </span>
                </div>
                <PlayEach
                  currentOPtions={currentOPtions}
                  handleAnswerOptionClick={handleAnswerOptionClick}
                  isAttempted={isAttempted}
                  setIsAttempted={setIsAttempted}
                  gotoNextQuestion={gotoNextQuestion}
                  questions={questions}
                  currentQuestion={currentQuestion}
                  countAnswer={countAnswer.current}
                  keepTrack={keepTrack}
                  hasMultiAns={questions[currentQuestion].hasMultiAns}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
