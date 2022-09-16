import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../store/UserSlice";

import { useToast } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [LoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const token = Cookies.get("QuizUser");
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Link to="/">
            <Box>Quiz App</Box>
          </Link>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              {LoggedIn && (
                <Button
                  onClick={() => {
                    Cookies.remove("QuizUser");
                    toast({
                      title: "Logged Out",
                      status: "warning",
                      duration: 1000,
                      isClosable: true,
                    });
                    dispatch(removeToken());
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              )}

              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
