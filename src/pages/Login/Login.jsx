import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { addToken } from "../../Components/store/UserSlice";
import { userLoginSchema } from "../../Components/joi-schema/quizHeadingSchema";

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
  useColorModeValue,
} from "@chakra-ui/react";
import { Navbar } from "../../Components/Navbar/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.user);
  const [isError, setIsError] = useState(null);

  const [emailExists, setEmailExists] = useState(false);
  const [adding, setAdding] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    let CookieKey = "QuizUser";
    const { value, error } = userLoginSchema.validate({ ...data });
    if (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      //console.log(value);
      setAdding(true);
      setTimeout(() => {
        axios
          .post(
            "https://quiz-backend-production.up.railway.app/user/login",
            value
          )
          .then((res) => {
            Cookies.set(CookieKey, JSON.stringify(res.data), { expires: 4 });
            dispatch(addToken(res.data));
            toast({
              title: "Logged In",
              status: "success",
              duration: 1000,
              isClosable: true,
            });
            navigate("/");
            setAdding(false);
          })
          .catch((err) => {
            console.log(err.message);
            toast({
              title: "Wrong Credentials",
              status: "warning",
              position: "bottom-right",
              duration: 2000,
              isClosable: true,
            });
            setAdding(false);
          });
      }, 300);
    }
  };
  useEffect(() => {
    if (Cookies.get("QuizUser")) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Navbar />
      <Flex
        minH={"88vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    required
                    {...register("email", {
                      required: true,
                    })}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    required
                    {...register("password", { required: true })}
                  />
                </FormControl>
                <Stack spacing={10}>
                  {adding ? (
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                      size="xl"
                    />
                  ) : (
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      type="submit"
                    >
                      Sign in
                    </Button>
                  )}
                  <Text>
                    Not a member? <Link to="/register">Register</Link>
                  </Text>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Flex>
    </>
  );
}
