import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
import { useToast } from "@chakra-ui/react";
import { quizHeading } from "../joi-schema/quizHeadingSchema";

export const Title = ({ title, editQuiz }) => {
  const [edit, setEdit] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const handleEditTitle = () => {
    const { value, error } = quizHeading.validate({
      title: title.current,
    });
    // console.log("vvvv", value);

    if (error) {
      //console.log(error.message);
      //setError(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    editQuiz();
    setEdit(!edit);
  };
  return (
    <div>
      {edit ? (
        <Flex fontSize={[10]} justifyContent="space-around">
          <Heading as="h6" size={["md", "xl"]}>
            Title-{"       " + title.current}
          </Heading>
          <Button
            fontSize={[10, 20]}
            colorScheme="yellow"
            onClick={() => {
              setEdit(!edit);
            }}
          >
            Edit Quiz Title
          </Button>
        </Flex>
      ) : (
        <span>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              bg="green.100"
              placeholder="Quiz Title"
              defaultValue={title.current}
              onChange={(e) => (title.current = e.target.value)}
            />
          </FormControl>
          <label>Title</label>
          <input type="text" />
          <Button
            colorScheme="yellow"
            type="submit"
            onClick={() => {
              if (Cookies.get("QuizUser")) {
                handleEditTitle();
              } else {
                toast.warn("Please Login ");
                navigate("/login");
              }
            }}
          >
            Save
          </Button>
        </span>
      )}
    </div>
  );
};
