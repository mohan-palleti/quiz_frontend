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
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4>
              Getting Your Score
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </h4>
          </div>
        </div>
      </>
    );
  return (
    <>
      <div className="row">
        <div className="col-5  m-auto">
          <div className="card border shadow-lg bg-light bg-gradient bg-opacity-50 ">
            <div className="card-header p-3 ">
              <h2>Your Score</h2>
            </div>
            <div className="score-section card-body p-4">
              <h4>
                You answered <b className="text-primary">{finalScore} </b>/
                {" " + questions.length} questions correctly
              </h4>
              <Link to="/" className="btn btn-dark mt-3">
                Take Another Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
