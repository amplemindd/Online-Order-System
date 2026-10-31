import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./home";
import Aboutus from "./aboutus"
import Services from "./services";
import Classes from "./classes";
import Otherpages from "./otherpages";
import Navi from "./navi";
import Footer from "./footer";

function Project(){
    return(
        <>
        <BrowserRouter>
        
            <Navi/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/aboutus" element={<Aboutus/>} />
                <Route path="/services" element={<Services/>} />
                <Route path="/otherpages" element={<Otherpages/>} />
                <Route path="/classes" element={<Classes/>} />
                
            </Routes>
            <Footer/>
        
        </BrowserRouter>

        </>
    )
}
export default Project;