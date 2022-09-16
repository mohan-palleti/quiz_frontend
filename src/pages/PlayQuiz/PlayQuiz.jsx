import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Quiz } from "../../Components/quizGame/Quiz";
import { Box, Heading, Spinner } from "@chakra-ui/react";

export const PlayQuiz = () => {
  const [isNotPublished, setIsNotPublished] = useState(false);
  const { id } = useParams();
  const [isValid, setIsValid] = useState(false);
  const quiz = useRef(null);
  const [Loading, setLoading] = useState(true);
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
          setLoading(false);
        })
        .catch((err) => {
          setIsValid(false);
          setLoading(false);
          console.log("err:", err);
        });
    }
  };
  useEffect(() => {
    checkCode(id);
  }, []);
  if (Loading)
    return (
      <Box m="auto" w="200">
        <Spinner
          thickness="10px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  if (isNotPublished) return <Heading>Quiz is not PUblish yet</Heading>;
  return (
    <Box w={["100%", "100%"]}>
      <Navbar />
      <Box w={["100%", "70%"]} m="auto" mt="10" style={{ height: "82vh" }}>
        {isValid ? (
          <>
            <Box mb="5" textAlign="center">
              <Heading>Title - {quiz.current?.title}</Heading>
            </Box>

            <Quiz
              questions={quiz.current.questions.sort(
                (a, b) => a.question - b.question
              )}
            />
          </>
        ) : (
          <div>
            <Heading>Not a valid quiz code</Heading>
          </div>
        )}
      </Box>
    </Box>
  );
};
