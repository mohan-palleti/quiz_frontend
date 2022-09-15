import React, { useState } from "react";
import { Navbar } from "../../Components/Navbar/Navbar";
import { HomeLeft } from "../../Components/Home_left/Home_Left";
import { HomeRight } from "../../Components/Home_Right/Home_Right";

const Home = () => {
  return (
    <>
      <Navbar />

      <div>
        <div>
          <HomeLeft />
        </div>
        <div>
          <HomeRight />
        </div>
      </div>
    </>
  );
};

export default Home;
