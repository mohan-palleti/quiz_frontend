import React, { useEffect, useRef, useState } from "react";
import { SingleQuestion } from "../SingleQuestion/SingleQuestion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { quizHeading } from "../joi-schema/quizHeadingSchema";
import { nanoid } from "nanoid";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import { Title } from "../TitleCard/Title";
import { Box, Button, HStack, useToast } from "@chakra-ui/react";

export const AddQuestion = ({ quizData }) => {
  const [existingQues, setExistingQues] = useState([]);
  const [error, setError] = useState(null);
  const toast = useToast();

  const title = useRef(quizData.title);

  const [addQues, setAddQues] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.user);

  const getQuiz = () => {
    if (Cookies.get("QuizUser")) {
      axios
        .get(
          `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
          {
            headers: {
              token: token.token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          title.current = res.data.title;

          setExistingQues(res.data.questions);
          setAddQues(false);
        })
        .catch((err) => {
          console.log(err);
          // toast.warn("Something Went wrong");
          toast({
            title: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      //  toast.warn("PLease Login");
      toast({
        title: "Please Login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    }
  };

  useEffect(() => {
    getQuiz();
    title.current = quizData.title;
  }, []);

  //!=------------------------EditQuiz--------------------------------------
  const editQuiz = () => {
    const { value, error } = quizHeading.validate({
      title: title.current,
    });

    if (value.title === quizData.title) {
      toast({
        title: "Title Already saved,Make new changes",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (error) {
      console.log(error.message);
      setError(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      if (Cookies.get("QuizUser")) {
        axios
          .patch(
            `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
            { ...value },
            {
              headers: {
                token: token.token,
              },
            }
          )
          .then((res) => {
            getQuiz();
            toast.success("Title Saved");
          })
          .catch((err) => {
            console.log(err);
            // toast.warn("Something Went Wrong");
            toast({
              title: err.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      } else {
        //toast.warn("Please Login");
        toast({
          title: "Please login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      }
    }
  };

  //!--------------------------------Delete Quiz------------------------
  const deleteQuiz = () => {
    axios
      .delete(
        `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
        {
          headers: {
            token: token.token,
          },
        }
      )
      .then((res) => {
        // toast.success("Quiz Deleted");
        toast({
          title: "Quiz Deleted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        // toast.warn("Deleted Failed , try again", err.message);
        toast({
          title: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Box bg="#e2eee8" borderRadius="5" p="2" fontSize={[10, 20]}>
      <div>
        <Title title={title} editQuiz={editQuiz} />

        <div>*Add Questions to Quiz</div>
      </div>
      <div>
        <div>
          {existingQues &&
            existingQues.map((element, index) => {
              return (
                <Box key={nanoid(10)}>
                  <QuestionCard
                    quizData={quizData}
                    getQuiz={getQuiz}
                    questionExist={element}
                    questionNumber={index}
                    existingQues={existingQues}
                  />
                </Box>
              );
            })}
        </div>
      </div>
      {addQues ? (
        <SingleQuestion
          existingQues={existingQues}
          quizData={quizData}
          getQuiz={getQuiz}
        />
      ) : (
        <>
          <Button
            bg="blackAlpha.600"
            colorScheme="white"
            onClick={() => {
              setAddQues(true);
            }}
            disabled={existingQues?.length === 10}
          >
            {existingQues?.length === 10
              ? "Max limit Reached"
              : " Add Question"}
          </Button>
        </>
      )}
      <br />
      <HStack mt={[10]}>
        {existingQues?.length >= 1 && (
          <Button colorScheme="blue">
            <Link to="/">Done</Link>
          </Button>
        )}
        <Button
          colorScheme="red"
          onClick={() => {
            if (Cookies.get("QuizUser")) {
              deleteQuiz();
            } else {
              toast({
                title: "Please Login",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              navigate("/login");
            }
          }}
        >
          Delete Quiz
        </Button>
      </HStack>
    </Box>
  );
};
