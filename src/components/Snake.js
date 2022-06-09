import React, { useState } from "react";
import Snake from "react-simple-snake";
import {useNavigate} from "react-router-dom"

const PlaySnake = () => {
  const [play, setPlay] = useState("false");
  const [button, showPlayButton] = useState("true");
  const navigate = useNavigate();

  window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }, false);

  function clickPlay() {
    setPlay("true");
    showPlayButton("false");
  }

  function clickStop() {
    showPlayButton("true");
    setPlay("false");
  }

  return (
    <section id="snake" >
      <div className='text-center'>
        {/*{button === "true" && (*/}
        {/*  <>*/}
        {/*    <h2 className="text-xl mb-2 mt-4"> Press button to play snake</h2>*/}
        {/*    <button*/}
        {/*      className="text-white bg-green-700 border-0 py-2 px-6 focus:outline-none hover:bg-green-800 rounded text-lg mt-20"*/}
        {/*      onClick={clickPlay}*/}
        {/*    >*/}
        {/*      Play Snake*/}
        {/*    </button>*/}
        {/*  </>*/}
        {/*)}*/}
        {/*{play === "true" && (*/}
          <>
            <h2 className="text-white sm:text-2xl text-2xl mb-1 font-medium mt-16">
              Use arrows or W/A/S/D keys to play:
            </h2>
            <Snake
            //   style={{ marginBottom: 100 }}
              percentageWidth="55"
              startSnakeSize="5"
              appleColor="red"
              snakeColor="green"
            />
          </>
        {/*)}*/}
        <br/>
        <br/>
        <br/>
        {/*<h2 className="text-white sm:text-xl text-2xl mb-1 font-medium mt-16">*/}
        {/*  Click on my name to go home:*/}
        {/*</h2>*/}
        {/*{button === "false" && (*/}
          <button
            className="text-white bg-red-600 border-0 py-2 px-6 focus:outline-none hover:bg-red-800 rounded text-lg"
            style={{ marginBottom: 25 }}
            onClick={()=>navigate('/')}
          >
            Stop Snake + Go Home
          </button>
        {/*)}*/}
      </div>
    </section>
  );
};

export default PlaySnake;
