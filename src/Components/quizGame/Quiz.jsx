import React, { useEffect, useRef, useState } from "react";
import { PlayEach } from "../PlayEachQ/PlayEach";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ScoreBoard } from "./ScoreBoard";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

export const Quiz = ({ questions }) => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentOPtions, setCurrentOPtions] = useState(
    questions[0].answerOptions
  );
  const [showScore, setShowScore] = useState(false);
  const [keepTrack, setKeepTrack] = useState([]);
  const score = useRef([]);
  const toast = useToast();
  const countAnswer = useRef(0);
  const [isAttempted, setIsAttempted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);

  const handleAnswerOptionClick = (index) => {
    if (score.current[currentQuestion]) {
    }
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
    toast({
      title: "getting score",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    axios
      .post(
        `https://quiz-backend-production.up.railway.app/quiz/score/${id}`,
        score.current
      )
      .then((res) => {
        setShowScore(true);
        setFinalScore(res.data.result);
      })
      .catch((err) => {
        toast({
          title: err.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
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
          <Box
            w={["100%", "50%"]}
            m="auto"
            bg={useColorModeValue("gray.500", "gray.700")}
            borderRadius="30"
            p="5"
          >
            <div className="question-section card-header">
              <div className="question-count text-end text-success">
                <span>
                  <b>Question </b> {currentQuestion + 1}
                </span>
                /{questions.length}
              </div>
              <Text fontSize={"20"} color={"red"}>
                <b>Question: </b>
                {questions[currentQuestion].question}
              </Text>
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
          </Box>
        )}
      </div>
    </div>
  );
};
