import {Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact";
import PlaySnake from "./components/Snake";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

export const AppRoutes = () => {
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<About/>}/>
                {/*<Route path="/contact" element={<Contact/>}/>*/}
                <Route path='/snake' element={<PlaySnake/>}/>
                {/*<Route path='/projects' element={<Projects/>}/>*/}
                {/*<Route path='/skills' element={<Skills/>}/>*/}
            </Routes>
        </>
    );
}