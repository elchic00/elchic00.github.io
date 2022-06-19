import {Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import PlaySnake from "./components/Snake";


export const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<About/>}/>
                <Route path='/snake' element={<PlaySnake/>}/>
            </Routes>
    );
}