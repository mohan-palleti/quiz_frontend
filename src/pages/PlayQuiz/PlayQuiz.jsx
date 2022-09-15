import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Quiz } from "../../Components/quizGame/Quiz";

export const PlayQuiz = () => {
  const [isNotPublished, setIsNotPublished] = useState(false);
  const { id } = useParams();
  const [isValid, setIsValid] = useState(false);
  const quiz = useRef(null);
  const checkCode = (id) => {
    if (id.length >= 6 && id) {
      axios
        .get(
          `https://quiz-backend-production.up.railway.app/quiz/permaLink/${id}`
        )
        .then((res) => {
          // console.log(res);
          quiz.current = res.data;
          quiz.current.questions = quiz.current.questions.sort(
            (a, b) => (a.question > b.question) - (a.question < b.question)
          );
          //console.log(quiz);
          if (!res.data.isPublished) setIsNotPublished(true);
          setIsValid(true);
        })
        .catch((err) => {
          setIsValid(false);
          console.log("err:", err);
        });
    }
  };
  useEffect(() => {
    checkCode(id);
  }, []);
  if (isNotPublished) return <h1>Quiz is not PUblish yet</h1>;
  return (
    <div className="col-sm-12">
      <Navbar />
      <div className="container mt-5" style={{ height: "82vh" }}>
        {isValid ? (
          <>
            <div className="text-center text-primary mt-5">
              <h2>Title - {quiz.current?.title}</h2>
            </div>

            <Quiz
              questions={quiz.current.questions.sort(
                (a, b) => a.question - b.question
              )}
            />
          </>
        ) : (
          <>
            <div>
              <h2>Not a valid quiz code</h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
