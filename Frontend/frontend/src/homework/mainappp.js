import Homeeee from "./homeeee";
import jar from "./jar";
import React from "react";

function Mainappp(){
    const day = "Monday";
    const date = 3;
    const month = "september";
    const data = {day, date, month};

return(
    <>
    <jar.Provider value={data}>
        <Homeeee/>

    </jar.Provider>
    </>
)
}
export default Mainappp;