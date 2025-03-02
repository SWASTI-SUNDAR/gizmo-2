import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: "url(bg.png)",
      }}
      className="md:h-screen h-screen md:bg-cover bg-contain bg-center md:bg-bottom bg-no-repeat"
    >
      <div className="px-4 sm:px-8 h-full relative md:px-16 lg:px-28 mx-auto max-w-screen-2xl">
        <img
          src="male.png"
          className="absolute hidden md:block -bottom-16 h-[50vh] left-[10%] animate-[girl_3s_ease-in-out_infinite] girl duration-300"
          // style={{transform:scaleX(-1)}}
          alt=""
        />
        <img
          src="labby.png"
          className="absolute hidden md:block -bottom-16 h-[50vh] animate-[boy_3s_ease-in-out_infinite]  right-[10%] boy duration-300 "
          alt=""
        />
        <Link to="/simulation">
          <button className="absolute md:bottom-[3%] left-[40%] right-[40%] bottom-20 md:left-[45%] md:right-[45%] p-4 hover:scale-95 duration-300 text-white bg-black rounded-xl">
            Labby’s Lab
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
