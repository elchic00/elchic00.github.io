import Snake from "react-simple-snake";
import {useNavigate} from "react-router-dom"
import {useEffect} from "react";

const PlaySnake = () => {
    // const [play, setPlay] = useState("false");
    // const [button, showPlayButton] = useState("true");
    const navigate = useNavigate();

    window.addEventListener("keydown", function(e) {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    return (
      <section id="snake">
        <br />
        <div className="overflow-hidden text-center h-full h-screen">
          <h2 className="text-white text-3xl mb-1 font-medium mt-12">
            Use arrows or W/A/S/D keys to play:
          </h2>
          <Snake
            percentageWidth="50"
            startSnakeSize="5"
            appleColor="red"
            snakeColor="green"
          />
          <br />
          <br />
          <br />
          <button
            className="text-white bg-red-600 py-2 px-6 hover:bg-red-800 rounded text-lg mb-2"
            onClick={() => navigate("/")}
          >
            Back to Portfolio
          </button>
        </div>
      </section>
    );
};

export default PlaySnake;
