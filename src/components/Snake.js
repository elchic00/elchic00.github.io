import React, { useState } from "react";
import Snake from "react-simple-snake";

const PlaySnake = () => {
  const [play, setPlay] = useState("false");
  const [button, showPlayButton] = useState("true");

  function clickPlay() {
    setPlay("true");
    showPlayButton("false");
  }

  function clickStop() {
    showPlayButton("true");
    setPlay("false");
  }

  return (
    <section id="snake">
      <div style={{ textAlign: "center" }}>
        {button === "true" && (
          <>
            <h2 className="text-xl mb-2 mt-4"> Press button to play snake</h2>
            <button
              className="text-white bg-green-700 border-0 py-2 px-6 focus:outline-none hover:bg-green-800 rounded text-lg"
              onClick={clickPlay}
            >
              Play Snake
            </button>
          </>
        )}
        {play === "true" && (
          <>
            <h2 className="text-white sm:text-3xl text-3xl mb-1 font-medium title-font">
              Use W/A/S/D keys to play:
            </h2>
            <Snake
            //   style={{ marginBottom: 100 }}
              percentageWidth="55"
              startSnakeSize="5"
              appleColor="red"
              snakeColor="green"
            />
          </>
        )}
        <br />
        <br />
        <br />
        {button === "false" && (
          <button
            className="text-white bg-red-600 border-0 py-2 px-6 focus:outline-none hover:bg-red-800 rounded text-lg"
            style={{ marginBottom: 25 }}
            onClick={clickStop}
          >
            Stop Snake
          </button>
        )}
      </div>
    </section>
  );
};

export default PlaySnake;
