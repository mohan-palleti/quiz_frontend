import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
//import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { questionSchema } from "../joi-schema/quizHeadingSchema";
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
import { MinusIcon, PlusSquareIcon } from "@chakra-ui/icons";

export const SingleQuestion = ({
  quizData,
  getQuiz,
  questionExist,
  questionNumber,
  existingQues,
  setEdit,
}) => {
  const [iserror, setIserror] = useState(null);
  const [sameQuestion, setsameQuestion] = useState(false);
  const [question, setQues] = useState("");
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.user);
  const [correctOption, setCorrectOption] = useState(null);
  const [answerOptions, setOptions] = useState([]);
  const toast = useToast();

  const handleInput = (index, event) => {
    const values = [...answerOptions];
    if (event.target.name === "isCorrect") {
      values[index][event.target.name] = event.target.checked;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setOptions(values);
  };

  const handleAddOption = () => {
    setOptions([...answerOptions, { answerText: "", isCorrect: false }]);
  };

  const handleRemoveOption = (index) => {
    const values = [...answerOptions];
    values.splice(index, 1);
    setOptions(values);
  };

  //!-----------------------------------------HANDLE SUBMIT-----------------------------------------
  const handleSubmit = () => {
    let noCorrectOption = 0;
    answerOptions.forEach((element) => {
      if (element.isCorrect == true) {
        noCorrectOption += 1;
      }
    });

    const { value, error } = questionSchema.validate({
      question,
      answerOptions,
    });
    if (error && error.message) {
      console.log(error?.message);
      // toast.warn(error?.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (noCorrectOption === 0 || (existingQues && existingQues?.length > 0)) {
      if (noCorrectOption === 0) {
        // toast.warn("Atleast one Correct Option Needed");
        toast({
          title: "Atleast one correct option needed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      } else {
        setCorrectOption(null);
      }
      let c = 0;
      if (existingQues) {
        for (let index = 0; index < existingQues.length; index++) {
          let e = existingQues[index];
          if (e.question == value.question) {
            if (questionNumber === index) continue;
            c += 1;
            // toast.warn("Duplicate Question submitted , Please Check");
            toast({
              title: "Duplicate Question cannot be submitted",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return;
          }
        }
      }

      if (c >= 1) {
        return;
      }
    }
    if (answerOptions.length > 1) {
      if (questionExist) {
        const mul = noCorrectOption > 1;

        if (Cookies.get("QuizUser")) {
          toast({
            title: "Saving",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          axios
            .patch(
              `https://quiz-backend-production.up.railway.app/question/${questionExist.id}`,
              {
                ...value,
                quiz: quizData.id,
                answerCount: noCorrectOption,
                hasMultiAns: mul,
              },
              {
                headers: {
                  token: token.token,
                },
              }
            )
            .then((res) => {
              console.log("posted Question", res.data);
              getQuiz();
              setEdit(false);
              // toast.success("Saved");
              toast({
                title: "Saved",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            })
            .catch((err) => {
              toast({
                title: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Please login",
            status: "error",
            duration: 5000,
            isClosable: true,
          });

          return;
        }
        return;
      } else {
        const mul = noCorrectOption > 1;
        if (Cookies.get("QuizUser")) {
          toast({
            title: "Saving",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          axios
            .post(
              "https://quiz-backend-production.up.railway.app/question",
              {
                ...value,
                answerCount: noCorrectOption,
                quiz: quizData.id,
                hasMultiAns: mul,
              },
              {
                headers: {
                  token: token.token,
                },
              }
            )
            .then((res) => {
              getQuiz();
              toast({
                title: "Saved",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
            })
            .catch((err) => {
              toast({
                title: err.message,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Please login",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          navigate("/login");
          return;
        }
      }
    } else if (answerOptions.length === 1) {
      toast({
        title: "Atleast Two Options Needed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  //!---------------------------END OF SUBMIT----------------------------------------------------------------

  const deleteQuestion = (id) => {
    toast({
      title: "Deleting",
      status: "warning",
      duration: 1000,
      isClosable: true,
    });
    if (Cookies.get("QuizUser")) {
      axios
        .delete(
          `https://quiz-backend-production.up.railway.app/question/${id}`,
          {
            headers: {
              token: token.token,
            },
          }
        )
        .then((res) => {
          toast({
            title: "Deleted",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          getQuiz();
        })
        .catch((err) => {
          toast({
            title: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "PLease Login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }
  };

  useEffect(() => {
    if (questionExist) {
      setQues(questionExist.question);
      setOptions(questionExist.answerOptions);
    } else {
      setOptions([{ answerText: "", isCorrect: false }]);
    }
  }, []);

  return (
    <Box
      p="5"
      border="1px"
      w={["100%", 650]}
      borderRadius="20px"
      boxShadow="xs"
      bg="blue.900"
    >
      <div>
        <h5>
          <FormControl>
            <FormLabel>Question</FormLabel>
            <Input
              type="text"
              defaultValue={question}
              placeholder="Question"
              onChange={(e) => {
                if (sameQuestion) setsameQuestion(false);
                setQues(e.target.value);
              }}
            />
          </FormControl>
        </h5>
        <span>
          <span className="form-text">Options</span>

          {answerOptions.map((ele, index) => {
            return (
              <Flex
                direction="row"
                align="center"
                justify="center"
                justifyContent={["start"]}
                key={index}
              >
                <FormControl>
                  <Input
                    name="answerText"
                    placeholder="option"
                    type="text"
                    mt="2"
                    defaultValue={ele.answerText}
                    onChange={(e) => {
                      if (iserror) setIserror(false);
                      handleInput(index, e);
                    }}
                  />
                </FormControl>

                <FormControl ml={[1, 5]} w={[20]}>
                  <Switch
                    id="isChecked"
                    name="isCorrect"
                    onChange={(e) => handleInput(index, e)}
                    defaultChecked={ele.isCorrect}
                  />
                </FormControl>

                <Button
                  colorScheme="red"
                  w={[5]}
                  disabled={answerOptions.length == 1}
                  onClick={() => {
                    handleRemoveOption(index);
                  }}
                >
                  <MinusIcon fontSize={[9]} />
                </Button>
                {index == answerOptions.length - 1 && (
                  <Button
                    ml={[1, 5]}
                    colorScheme="green"
                    onClick={() => {
                      handleAddOption();
                    }}
                    disabled={index == 4}
                  >
                    <PlusSquareIcon />
                  </Button>
                )}
              </Flex>
            );
          })}
        </span>
        <Flex
          direction="row"
          align="center"
          justify="center"
          justifyContent="space-around"
        >
          <Button
            colorScheme="green"
            onClick={() => {
              handleSubmit();
            }}
            mt={5}
          >
            {questionExist ? `Edit & Save` : "Submit Question"}
          </Button>
          {questionExist && (
            <>
              <Button
                colorScheme="red"
                m={10}
                disabled={existingQues?.length === 1}
                onClick={() => {
                  deleteQuestion(questionExist.id);
                }}
              >
                Delete Q-{questionNumber + 1}
              </Button>
            </>
          )}
        </Flex>
      </div>
    </Box>
  );
};
