import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuizes } from "../store/quizSlice";
import { nanoid } from "nanoid";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { QuizCard } from "./QuizCard/QuizCard";
import {
  chakra,
  Container,
  Stack,
  HStack,
  Text,
  useColorModeValue,
  Button,
  Box,
  Icon,
} from "@chakra-ui/react";
export const HomeLeft = () => {
  const code = useRef("n");
  const navigate = useNavigate();
  const [wrongCode, setWrongCode] = useState(false);
  const pageNumber = useRef(1);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.current.trim().length === 6) {
      navigate(`playquiz/${code.current}`);
    } else setWrongCode(true);
  };
  const { allQuizes, totalPages, error } = useSelector((store) => store.quiz);
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuizes(1));
  }, []);
  useEffect(() => {}, [error]);
  if (error)
    return (
      <Box>
        <Text>{error};</Text>
      </Box>
    );
  return (
    <Container maxW="6xl" px={{ base: 6, md: 3 }} py={14}>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={2}
        justifyContent="center"
      >
        <Stack
          direction="column"
          spacing={6}
          justifyContent="center"
          maxW="500px"
          mb={{ base: 3, md: 0 }}
        >
          <Box>
            <chakra.h1
              fontSize="5xl"
              lineHeight={1}
              fontWeight="bold"
              textAlign="left"
            >
              Published <br />
              <chakra.span color="teal">Quizes</chakra.span>
            </chakra.h1>
          </Box>

          <HStack spacing={{ base: 0, sm: 2 }} flexWrap="wrap"></HStack>
        </Stack>
        <Stack>
          <Stack
            spacing={{ base: 5, sm: 2 }}
            direction={{ base: "column", sm: "row" }}
            alignItems="center"
          >
            {allQuizes.length === 0 && <Text>No Quizes to show</Text>}
            {allQuizes.map((ele) => {
              if (ele.isPublished)
                return (
                  <span key={nanoid(9)}>
                    <QuizCard quiz={ele} />
                  </span>
                );
            })}
          </Stack>
          <Stack
            pl={[10, 10]}
            spacing={{ base: 5, sm: 5 }}
            direction={{ base: "row", sm: "row" }}
            alignItems="center"
          >
            {pages.map((e, i) => (
              <Button
                disabled={pageNumber.current === i + 1}
                onClick={() => {
                  pageNumber.current = i + 1;
                  dispatch(getAllQuizes(i + 1));
                }}
                colorScheme="teal"
                size="xs"
                key={nanoid(5)}
              >
                {i + 1}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
