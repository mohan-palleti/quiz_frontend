import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SingleQuestion } from "../SingleQuestion/SingleQuestion";
import cross from "../../assets/cross.png";
import checked from "../../assets/checked.png";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export const QuestionCard = ({
  quizData,
  getQuiz,
  questionExist,
  questionNumber,
  existingQues,
}) => {
  const [edit, setEdit] = useState(false);
  const [question, setQues] = useState("");
  const [answerOptions, setOptions] = useState([]);
  useEffect(() => {
    setQues(questionExist.question);
    setOptions(questionExist.answerOptions);
  }, []);

  return (
    <Stack p={[1, 10]} w={["100%", 650]} m={[0, 10]} borderRadius="20px">
      {edit ? (
        <SingleQuestion
          quizData={quizData}
          getQuiz={getQuiz}
          questionExist={questionExist}
          questionNumber={questionNumber}
          existingQues={existingQues}
          setEdit={setEdit}
        />
      ) : (
        <Box
          bg={useColorModeValue("gray.600", "gray.700")}
          p="6"
          borderRadius="20"
        >
          <div>
            <Box>
              <Text>Question</Text>

              <Heading color="red">{question}</Heading>
            </Box>
            <span>
              <Text>Options</Text>

              {answerOptions.map((ele, index) => {
                return (
                  <Flex key={index} mt="1" borderRadius="5" p="1">
                    <p> {index + 1 + ") " + ele.answerText}</p>
                    {ele.isCorrect ? (
                      <CheckCircleIcon m={2} color="green.500" />
                    ) : (
                      <CloseIcon m={2} color="red.400" />
                    )}
                  </Flex>
                );
              })}
            </span>
            <div>
              <Button
                mt="1"
                onClick={() => {
                  setEdit(true);
                }}
                colorScheme="yellow"
              >
                Edit
              </Button>
            </div>
          </div>
        </Box>
      )}
    </Stack>
  );
};
