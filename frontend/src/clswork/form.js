import { useState } from "react"

function Loginform(){
    
    const [name,setName]=useState("")
    function valueCaptured(){
        alert(name)
    }
    return(
        <>
        <form>
            <span>Name</span>
            <input type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}/>
            <button onClick={valueCaptured}>submit</button>
        </form>
        </>
    )
}
export default Loginform;