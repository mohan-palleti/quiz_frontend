import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useJwt } from "react-jwt";
import { useSelector } from "react-redux";
import { YourQuizes } from "../yourQuizes/YourQuizes";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
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
  Spinner,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

// import { Button, ButtonProps, Flex } from "@chakra-ui/react";

export const HomeRight = () => {
  const { token } = useSelector((store) => store.user);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [userQuizes, setUserQuizes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const pageNumber = useRef(1);
  const pages = [];
  const [totalPages, setTotalPages] = useState(0);
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  const { decodedToken, isExpired, reEvaluateToken } = useJwt(token?.token);

  const getQuizes = (page) => {
    setLoading(true);
    const pageNumber = page || 1;
    axios
      .get(
        `https://quiz-backend-production.up.railway.app/user/quiz?page=${pageNumber}&limit=${2}`,
        {
          headers: {
            token: token.token,
          },
        }
      )
      .then((res) => {
        console.log("getting quizes");
        setUserQuizes(res?.data?.currentQuiz);
        setTotalPages(res?.data?.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err:", err);
        setError(err.message);
        setLoading(false);
        toast({
          title: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (token) {
      if (decodedToken) {
        setLoggedIn(true);
        getQuizes();
      }
    }
  }, [decodedToken]);

  return (
    <div>
      {Cookies.get("QuizUser") && (
        <>
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
                    Your <br />
                    <chakra.span color="teal">Quizes</chakra.span>
                  </chakra.h1>
                </Box>

                <HStack spacing={{ base: 0, sm: 2 }} flexWrap="wrap"></HStack>
              </Stack>

              <Stack>
                <HStack
                  spacing={{ base: 5, sm: 2 }}
                  direction={{ base: "column", sm: "row" }}
                  alignItems="center"
                >
                  {loading ? (
                    <>
                      <Stack direction="row" spacing={4}>
                        <Spinner size="lg" />
                      </Stack>
                    </>
                  ) : (
                    <YourQuizes
                      quizes={userQuizes}
                      getQuizes={getQuizes}
                      error={error}
                    />
                  )}
                </HStack>
                <Stack
                  spacing={{ base: 5, sm: 2 }}
                  direction={{ base: "column", sm: "row" }}
                  alignItems="center"
                >
                  {!loading &&
                    pages.map((e, i) => (
                      <Button
                        disabled={pageNumber.current === i + 1}
                        onClick={() => {
                          pageNumber.current = i + 1;
                          getQuizes(i + 1);
                        }}
                        colorScheme="teal"
                        size="xs"
                        key={nanoid(6)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </>
      )}
      <div>
        <div>
          {Cookies.get("QuizUser") ? (
            <>
              <Link to="create">
                <Button
                  px={4}
                  fontSize={"sm"}
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  _hover={{
                    bg: "blue.500",
                  }}
                  _focus={{
                    bg: "blue.500",
                  }}
                >
                  Create Quiz
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="login">
                <Button
                  px={4}
                  fontSize={"sm"}
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  _hover={{
                    bg: "blue.500",
                  }}
                  _focus={{
                    bg: "blue.500",
                  }}
                >
                  Login to Create Quiz
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
