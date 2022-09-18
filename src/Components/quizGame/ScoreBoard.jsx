import { Box, Button, Heading, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const ScoreBoard = ({ finalScore, questions }) => {
  const [isloading, setisLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setisLoading(false);
    }, 1500);
  }, []);

  if (isloading)
    return (
      <>
        <div className="row">
          <div className="col-6 m-auto">
            <h4>
              Getting Your Score
              <Spinner
                thickness="6px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </h4>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div>
        <Box w={[320, 500]} m="auto" bg="gray.700" borderRadius="30">
          <Text pt="6" ps="6">
            <h2>Your Score</h2>
          </Text>
          <Box p="5" className="score-section ">
            <Heading m="5">
              You Scored <b>{finalScore} </b>/{" " + questions.length}
            </Heading>
            <Button bg="red.300">
              <Link to="/">Take Another Quiz</Link>
            </Button>
          </Box>
        </Box>
      </div>
    </>
  );
};
