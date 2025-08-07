import React from "react";
import Navbar from "../components/Navbar";
import WeatherData from "../components/WeatherData";
import AnimatedWeather from "../components/AnimatedWeather";

const Home = () => {
  return (
    <>
      <Navbar />
      <WeatherData />
      <AnimatedWeather />
    </>
  );
};

export default Home;
