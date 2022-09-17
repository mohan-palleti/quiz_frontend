import axios from "axios";
import React, { useEffect } from "react";
import edit from "../../assets/edit.png";
import trash from "../../assets/trash.png";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import "tippy.js/animations/perspective.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllQuizes } from "../store/quizSlice";
import { nanoid } from "nanoid";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { VStack } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
import { useToast } from "@chakra-ui/react";

export const YourQuizes = ({ quizes, getQuizes, error }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { token } = useSelector((store) => store.user);
  // const [isThereACookie, setIsThereACookie] = useState(null);
  const notify = (message) =>
    toast({
      title: message,
      status: "warning",
      duration: 9000,
      isClosable: true,
    });
  const onDelete = (id) => {
    axios
      .delete(`https://quiz-backend-production.up.railway.app/quiz/${id}`, {
        headers: {
          token: token.token,
        },
      })
      .then((res) => {
        //console.log("res:delte quiz", res);
        getQuizes(1);
        dispatch(getAllQuizes(1));
        toast({
          title: "Quiz Deleted",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        // console.log("err:", err);
        //        toast.warn();
        toast({
          title: err.response.data.message,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  const togglePublish = (id) => {
    axios
      .patch(
        `https://quiz-backend-production.up.railway.app/quiz/${id}`,
        { isPublished: true },
        {
          headers: {
            token: token.token,
          },
        }
      )
      .then((res) => {
        getQuizes();
        dispatch(getAllQuizes(1));
        toast({
          title: "Quiz Published.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((err) => {
        //notify(err.response.data.message);
        toast({
          title: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.log("err:", err);
      });
  };
  if (error)
    return (
      <Box>
        <Text>{error}</Text>
      </Box>
    );
  return (
    <>
      {quizes?.length === 0 && <Text>No quizes Created</Text>}
      {quizes?.map((element, index) => (
        <Stack
          href="#"
          direction="column"
          _hover={{
            boxShadow: useColorModeValue(
              "0 4px 6px rgba(160, 174, 192, 0.6)",
              "0 4px 6px rgba(9, 17, 28, 0.9)"
            ),
          }}
          bg={useColorModeValue("gray.200", "gray.700")}
          p={3}
          rounded="lg"
          spacing={1}
          key={nanoid(5)}
        >
          <Text fontSize="md" fontWeight="semibold">
            {element.title}
          </Text>

          <Button
            colorScheme="teal"
            disabled={element.isPublished}
            className="btn btn-outline-dark"
            onClick={() => {
              if (Cookies.get("QuizUser")) {
                if (!element.isPublished) {
                  togglePublish(element.id);
                }
              } else {
                toast({
                  title: "Please Login ",

                  status: "warning",
                  duration: 5000,
                  isClosable: true,
                });
                navigate("/login");
                return;
              }
            }}
          >
            {element.isPublished ? "Quiz is Published" : "Click To Publish"}
          </Button>
          <HStack color="gray.500" alignItems="center">
            {!element.isPublished && (
              <Link
                to={
                  Cookies.get("QuizUser") ? `edit_quiz/${element.id}` : "/login"
                }
              >
                <EditIcon color="green.500" />
              </Link>
            )}
            <DeleteIcon
              color="red.500"
              onClick={() => {
                if (Cookies.get("QuizUser")) {
                  onDelete(element.id);
                } else {
                  // toast.warn("please login.....");
                  toast({
                    title: "please login",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });

                  navigate("/login");
                  return;
                }
              }}
            />
          </HStack>
        </Stack>
      ))}

      <ToastContainer />
    </>
  );
};

// const Card = ({ heading, detail }:) => {
//   return (
//     <Stack

//       direction="column"
//       _hover={{
//         boxShadow: useColorModeValue(
//           '0 4px 6px rgba(160, 174, 192, 0.6)',
//           '0 4px 6px rgba(9, 17, 28, 0.9)'
//         )
//       }}
//       bg={useColorModeValue('gray.200', 'gray.700')}
//       p={3}
//       rounded="lg"
//       spacing={1}
//       maxW="450px"
//       h="max-content"
//     >
//       <Text fontSize="md" fontWeight="semibold">
//         {heading}
//       </Text>

//       <HStack color="gray.500" alignItems="center">
//         <Text fontSize="sm" textAlign="left" fontWeight="600">
//           Learn more
//         </Text>

//       </HStack>
//     </Stack>
//   );
// };
