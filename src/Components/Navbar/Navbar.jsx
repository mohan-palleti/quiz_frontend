import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../store/UserSlice";
import { toast } from "react-toastify";
import quiz from "../../assets/quiz.png";

// export const Navbar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [LoggedIn, setLoggedIn] = useState(false);
//   useEffect(() => {
//     const token = Cookies.get("QuizUser");
//     if (token) {
//       setLoggedIn(true);
//     }
//   }, []);
//   return (
//     <nav className="navbar bg-secondary bg-opacity-75">
//       <div className="container-fluid">
//         <Link to="/" className="navbar-brand">
//           <h2>
//             Quiz
//             <img src={quiz} alt="logo" className="img-fluid" width="20px" />
//           </h2>
//         </Link>
//         {LoggedIn && (
//           <ul className="navbar-nav ">
//             <li className="nav-item">
//               <button
//                 className="btn btn-warning"
//                 onClick={() => {
//                   Cookies.remove("QuizUser");
//                   toast.warn("Logged Out");
//                   dispatch(removeToken());
//                   navigate("/login");
//                 }}
//               >
//                 Logout
//               </button>
//             </li>
//           </ul>
//         )}
//       </div>
//     </nav>
//   );
// };
import { ReactNode } from "react";

import { useToast } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  ButtonGroup,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

// const NavLink = ({ children }) => (
//   <Link
//     px={2}
//     py={1}
//     rounded={"md"}
//     _hover={{
//       textDecoration: "none",
//       bg: useColorModeValue("gray.200", "gray.700"),
//     }}
//     href={"#"}
//   >
//     {children}
//   </Link>
// );

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
