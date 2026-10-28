import { useContext } from "react"
import jar from "./jar"

function Homeeee(){
    const data = useContext(jar)
    return(
        <>
        <h1>Upcoming Content</h1>
        <p>day= {data.day}</p>
        <p>date= {data.date}</p>
        <p>month= {data.month}</p>
        </>
    )
}
export default Homeeee;