import { useContext } from "react";
import box from "./box";

function Homeee(){
    const data = useContext(box)
    return(
        <>
        <h1>upcoming content</h1>
        <p>{data}</p>
        </>
    )
}
export default Homeee;