import { useEffect, useState } from "react";

function Appp(){
    const[users,setusers]= useState([]);
    const[loading,setLoading]= useState(true);
    const[error,seterror]= useState("");

    useEffect(()=>{
        const fetchUsers = async()=>{
            try{
                const response = await fetch("/data/users.json");

                if(!response.ok){
                    throw new  Error("Unable to fetch JSON data");
                }
                const data = await response.json();
                
                setusers(data);
            }catch (error){
                seterror(error.message);
            }finally{
                setLoading(false);
            }
        };

        fetchUsers();
    },[]);
    if(loading){
        return<h2>Loading....</h2>
    }
    if(error){
        return<h2>{error}</h2>
    }

    return(
        <div>
            <h1>User List</h1>

            {users.map((user)=>(
                <div key={user.id}>
                    <h3>{user.name}</h3>
                    <p>Email:{user.email}</p>
                    <p>City:{user.city}</p>
                    <hr/>
                    </div>
            ))}
        </div>
    );
}
export default Appp;