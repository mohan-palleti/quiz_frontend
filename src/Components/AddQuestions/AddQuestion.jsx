import React, { useEffect, useRef, useState } from "react";
import { SingleQuestion } from "../SingleQuestion/SingleQuestion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { quizHeading } from "../joi-schema/quizHeadingSchema";
import { nanoid } from "nanoid";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import { Title } from "../TitleCard/Title";
import { useToast } from "@chakra-ui/react";

export const AddQuestion = ({ quizData }) => {
  const [existingQues, setExistingQues] = useState([]);
  const [error, setError] = useState(null);
  const toast = useToast();

  const title = useRef(quizData.title);

  const [addQues, setAddQues] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.user);

  const getQuiz = () => {
    if (Cookies.get("QuizUser")) {
      axios
        .get(
          `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
          {
            headers: {
              token: token.token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          title.current = res.data.title;

          setExistingQues(res.data.questions);
          setAddQues(false);
        })
        .catch((err) => {
          console.log(err);
          // toast.warn("Something Went wrong");
          toast({
            title: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      //  toast.warn("PLease Login");
      toast({
        title: "Please Login",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    }
  };

  useEffect(() => {
    getQuiz();
    title.current = quizData.title;
  }, []);

  //!=------------------------EditQuiz--------------------------------------
  const editQuiz = () => {
    const { value, error } = quizHeading.validate({
      title: title.current,
    });

    if (value.title === quizData.title) {
      toast({
        title: "Title Already saved,Make new changes",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (error) {
      console.log(error.message);
      setError(error.message);
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      if (Cookies.get("QuizUser")) {
        axios
          .patch(
            `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
            { ...value },
            {
              headers: {
                token: token.token,
              },
            }
          )
          .then((res) => {
            getQuiz();
            toast.success("Title Saved");
          })
          .catch((err) => {
            console.log(err);
            // toast.warn("Something Went Wrong");
            toast({
              title: err.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      } else {
        //toast.warn("Please Login");
        toast({
          title: "Please login",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      }
    }
  };

  //!--------------------------------Delete Quiz------------------------
  const deleteQuiz = () => {
    axios
      .delete(
        `https://quiz-backend-production.up.railway.app/quiz/${quizData.id}`,
        {
          headers: {
            token: token.token,
          },
        }
      )
      .then((res) => {
        // toast.success("Quiz Deleted");
        toast({
          title: "Quiz Deleted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        // toast.warn("Deleted Failed , try again", err.message);
        toast({
          title: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <div>
      <div className="row ">
        <div className=" mb-3">
          <Title title={title} editQuiz={editQuiz} />
        </div>

        <div id="emailHelp" className="form-text">
          *Add Questions to Quiz
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {/* map existing Questions */}
          {existingQues === null && <p>Added questions will appear here</p>}
          {existingQues &&
            existingQues.map((element, index) => {
              return (
                <span key={nanoid(10)}>
                  <QuestionCard
                    quizData={quizData}
                    getQuiz={getQuiz}
                    questionExist={element}
                    questionNumber={index}
                    existingQues={existingQues}
                  />
                </span>
              );
            })}
        </div>
      </div>
      {addQues ? (
        <SingleQuestion
          existingQues={existingQues}
          quizData={quizData}
          getQuiz={getQuiz}
        />
      ) : (
        <>
          <button
            className="btn btn-dark mt-3"
            onClick={() => {
              setAddQues(true);
            }}
            disabled={existingQues?.length === 10}
          >
            {existingQues?.length === 10
              ? "Max limit Reached"
              : " Add Question"}
          </button>
        </>
      )}
      <br />
      <div className="col-6 text-end  ">
        {existingQues?.length >= 1 && (
          <Link to="/" className="btn btn-danger me-3">
            Done
          </Link>
        )}
        <button
          className="btn btn-danger"
          onClick={() => {
            if (Cookies.get("QuizUser")) {
              deleteQuiz();
            } else {
              //toast.warn("Please Login ");
              toast({
                title: "Please Login",
                status: "error",
                duration: 5000,
                isClosable: true,
              });
              navigate("/login");
            }
          }}
        >
          Delete Quiz
        </button>
      </div>
    </div>
  );
};
