import React, { useState } from "react";
import { Toast } from "bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import user from "../../assets/user.png";
import email from "../../assets/email.png";
import lock from "../../assets/lock.png";

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
  Spinner,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { userRegisterSchema } from "../../Components/joi-schema/quizHeadingSchema";
import { useRef } from "react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

function SignUp() {
  // var [toast, setToast] = useState(false);
  const toastRef = useRef();

  const navigate = useNavigate();
  const [isError, setIsError] = useState(null);

  const [adding, setAdding] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("first");
    const { value, error } = userRegisterSchema.validate({ ...data });

    if (error) {
      console.log(error.message);

      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setAdding(true);

      console.log("fssd");
      setTimeout(() => {
        axios
          .post(
            "https://quiz-backend-production.up.railway.app/user/register",
            value
          )
          .then((res) => {
            setAdding(false);
            console.log("res", res);
            if (res.data.status === 403) {
              toast({
                title: res.data.message,
                status: "error",
                duration: 2000,
                isClosable: true,
              });
              return;
            }
            toast({
              title: "Account Created",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
            navigate("/login");
          })
          .catch((err) => {
            // setEmailExists(true);
            toast.warn("email exists,try another");
            setAdding(false);
            console.log(err);
          });
      }, 1000);
    }
  };

  return (
    // <div>
    //   <Navbar />
    //   <form
    //     className="col-lg-6 col-md-4 col-sm-2 w-sm-50  m-auto"
    //     onSubmit={handleSubmit(onSubmit)}
    //     style={{ height: "88vh" }}
    //   >
    //     <h2>Register</h2>

    //     <div className="input-group  mb-4">
    //       <span className="input-group-text" id="basic-addon1">
    //         <img src={user} alt="username" width="15px" />
    //       </span>
    //       <input
    //         type="text"
    //         id="form2Example"
    //         className="form-control"
    //         placeholder="Name"
    //         {...register("name")}
    //         required
    //       />
    //     </div>

    //     <div className="input-group mb-4">
    //       <span className="input-group-text" id="basic-addon1">
    //         <img src={email} alt="email" width="15px" />
    //       </span>
    //       <input
    //         type="email"
    //         id="form2Example1"
    //         className="form-control"
    //         placeholder="Email Address"
    //         {...register("email")}
    //         required
    //       />
    //     </div>

    //     <div className="input-group mb-4">
    //       <span className="input-group-text" id="basic-addon1">
    //         <img src={lock} alt="password" width="15px" />
    //       </span>
    //       <input
    //         type="password"
    //         id="form2Example2"
    //         className="form-control"
    //         placeholder="Password"
    //         required
    //         {...register("password")}
    //       />
    //     </div>
    //     <div className="text-center">
    //       {adding ? (
    //         <div className="spinner-border text-warning" role="status">
    //           <span className="visually-hidden">Loading...</span>
    //         </div>
    //       ) : (
    //         <button type="submit" className="btn btn-warning mb-4">
    //           Sign up
    //         </button>
    //       )}
    //     </div>

    //     <div className="text-center">
    //       <p>
    //         Have an Account? <Link to="/login">Login</Link>
    //       </p>
    //     </div>
    //   </form>
    // </div>
    <>
      <Navbar />
      <Flex
        minH={"88vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} w={450}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>Create an account</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="name">
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    required
                    {...register("name", {
                      required: true,
                    })}
                  />
                </FormControl>
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
                      Sign Up
                    </Button>
                  )}
                  <Text>
                    Have an Account? <Link to="/login">Login</Link>
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

export default SignUp;
