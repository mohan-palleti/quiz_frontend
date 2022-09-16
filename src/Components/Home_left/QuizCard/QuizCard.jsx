import React from "react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/perspective.css";
import { Link } from "react-router-dom";
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

export const QuizCard = ({ quiz }) => {
  return (
    // </div>
    <Link to={`playquiz/${quiz.permaLink}`}>
      <Stack
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
        maxW="450px"
        h="max-content"
      >
        <Text fontSize="md" fontWeight="semibold">
          {quiz.title}
        </Text>
        <Text
          fontSize="sm"
          textAlign="left"
          color="gray.500"
          lineHeight={1.3}
          noOfLines={2}
        >
          Take Quiz
        </Text>
        <HStack color="gray.500" alignItems="center">
          <Text fontSize="sm" textAlign="left" fontWeight="600"></Text>
        </HStack>
      </Stack>
    </Link>
  );
};
