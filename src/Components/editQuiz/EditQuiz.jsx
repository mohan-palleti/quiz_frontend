import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AddQuestion } from "../AddQuestions/AddQuestion";
import { useSelector } from "react-redux";
import { useJwt } from "react-jwt";
import axios from "axios";
import { Navbar } from "../Navbar/Navbar";
import { Box, useColorModeValue } from "@chakra-ui/react";

export const EditQuiz = () => {
  const { id } = useParams();
  const [isError, setIsError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const { token } = useSelector((store) => store.user);
  const { decodedToken, isExpired, reEvaluateToken } = useJwt(token?.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (decodedToken && decodedToken.id) {
      axios
        .get(`https://quiz-backend-production.up.railway.app/quiz/${id}`, {
          headers: {
            token: token.token,
          },
        })
        .then((res) => {
          //  console.log("res: to be edited  quiz", res);
          setQuizData(res.data);
        })
        .catch((err) => {
          setIsError(err.response.data.message);
          console.log("err:", err);
        });
    }
  }, [decodedToken]);

  if (isError)
    return (
      <>
        <Navbar />
        <h2>{isError}</h2>
      </>
    );
  return (
    <>
      <Navbar />
      <Box bg={useColorModeValue("gray.500", "black.400")} p="2">
        {quizData && <AddQuestion quizData={quizData} />}
      </Box>
    </>
  );
};
