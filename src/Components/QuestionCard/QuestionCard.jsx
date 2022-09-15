import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SingleQuestion } from "../SingleQuestion/SingleQuestion";
import cross from "../../assets/cross.png";
import checked from "../../assets/checked.png";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";

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
    <Stack bg="#171923" p={10} w={650} m={10} borderRadius="20px">
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
        <span>
          <div>
            <div>
              <div>
                <Box>
                  <Text>Question</Text>

                  <Heading color="tomato">{question}</Heading>
                </Box>
                <span>
                  <Text m={2}>Options</Text>

                  {answerOptions.map((ele, index) => {
                    return (
                      <Flex m={5} key={index}>
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
                    onClick={() => {
                      setEdit(true);
                    }}
                    colorScheme="yellow"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </span>
      )}
    </Stack>
  );
};
