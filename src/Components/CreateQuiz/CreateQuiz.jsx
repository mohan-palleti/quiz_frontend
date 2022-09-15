import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { quizHeading } from "../joi-schema/quizHeadingSchema";
import { Navbar } from "../Navbar/Navbar";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Switch,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import Cookies from "js-cookie";
import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";

export const CreateQuiz = () => {
  const { token } = useSelector((store) => store.user);
  const title = useRef("..");
  const question = useRef("..");
  const toast = useToast();

  const [error, setError] = useState(null);
  const [quizID, setQuizID] = useState(null);
  const quizDetails = useRef(null);
  const [answerOptions, setOptions] = useState([
    { answerText: "", isCorrect: false },
  ]);

  const handleRemoveOption = (index) => {
    const values = [...answerOptions];
    values.splice(index, 1);
    setOptions(values);
  };
  const navigate = useNavigate();
  const handleInput = (index, event) => {
    const values = [...answerOptions];
    if (event.target.name === "isCorrect") {
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    console.log(event.target.value);
    setOptions(values);
  };

  const handleAddOption = () => {
    setOptions([...answerOptions, { answerText: "", isCorrect: false }]);
  };

  const createQuiz = (e) => {
    let noCorrectOption = 0;
    answerOptions.forEach((element) => {
      if (element.isCorrect == true) {
        noCorrectOption += 1;
      }
    });
    const multiple = noCorrectOption > 1;
    const { value, error } = quizHeading.validate({
      title: title.current,
      question: {
        question: question.current,
        answerOptions,
        answerCount: noCorrectOption,
        hasMultiAns: multiple,
      },
    });
    console.log(value);
    if (error) {
      //console.log(error.message);
      //toast.warn(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      if (noCorrectOption === 0) {
        //toast.warn();
        toast({
          title: "Atleast one Correct Option Needed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (answerOptions.length > 1) {
        if (Cookies.get("QuizUser")) {
          axios
            .post(
              `https://quiz-backend-production.up.railway.app/quiz/`,
              { ...value, isPublished: false },
              {
                headers: {
                  token: token.token,
                },
              }
            )
            .then((res) => {
              console.log("posted Question", res.data);
              //toast.success("Saved");
              toast({
                title: "Posted Question",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              navigate(`/edit_quiz/${res.data.id}`);
            })
            .catch((err) => {
              console.log("err:", err);
              toast({
                title: "Something Went wrong, Refresh the Page",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Please Login",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate("/");
        }
        return;
      } else if (answerOptions.length === 1) {
        // toast.warn("Atleast two options are needed");
        toast({
          title: "Atleast Two options Needed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      //! --------------ap! call------------------
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="container overflow-auto " style={{ height: "88vh" }}>
        <div className="p-2">
          <div className="">
            <FormControl id="Title">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                width={650}
                placeholder="Quiz Title"
                onChange={(e) => (title.current = e.target.value)}
              />
            </FormControl>

            <Text id="emailHelp" className="form-text">
              *Add Question to Quiz
            </Text>
          </div>

          <div className="">
            <div className=" ">
              <div className="">
                <FormControl id="Question">
                  <FormLabel>Question</FormLabel>
                  <Input
                    type="text"
                    width={350}
                    placeholder="Question"
                    onChange={(e) => {
                      question.current = e.target.value;
                    }}
                  />
                </FormControl>
                <span>
                  <Text className="form-text">Options</Text>

                  {answerOptions.map((ele, index) => {
                    return (
                      <Stack
                        key={index}
                        spacing={2}
                        direction="row"
                        justifyContent="start"
                        width={450}
                        alignItems="center"
                        gap="2"
                      >
                        <FormControl>
                          <Input
                            type="text"
                            name="answerText"
                            width={200}
                            placeholder="Option"
                            onChange={(e) => {
                              handleInput(index, e);
                            }}
                          />
                        </FormControl>

                        <FormControl id="Question">
                          <Switch
                            id="isChecked"
                            name="isCorrect"
                            onChange={(e) => handleInput(index, e)}
                            defaultChecked={false}
                          />
                        </FormControl>

                        <Button
                          colorScheme="red"
                          disabled={answerOptions.length === 1}
                          onClick={() => {
                            handleRemoveOption(index);
                          }}
                        >
                          <MinusIcon />
                        </Button>
                        {index == answerOptions.length - 1 && (
                          <Button
                            colorScheme="yellow"
                            onClick={() => {
                              handleAddOption();
                            }}
                            disabled={index == 4}
                          >
                            <PlusSquareIcon />
                          </Button>
                        )}
                      </Stack>
                    );
                  })}
                </span>
                <div>
                  <Button
                    colorScheme="green"
                    onClick={() => {
                      if (Cookies.get("QuizUser")) {
                        createQuiz();
                      } else {
                        toast({
                          title: "You have been Logged out",
                          status: "error",
                          duration: 9000,
                          isClosable: true,
                        });
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
