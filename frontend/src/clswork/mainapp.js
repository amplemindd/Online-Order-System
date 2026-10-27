import Homeee from "./homeee";
import box from "./box";
import React from "react";

function Mainapp() {
    const data = "Sameer"
    return ( 
        <>
            <box.Provider value={data}>
                <Homeee />
                </box.Provider >
            </>
            )
}

            export default Mainapp;