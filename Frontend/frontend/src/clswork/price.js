import { useState, useEffect } from "react";
// import '../css/price.css'


// function CalculateBill() {

//     const [count1, setCount1] = useState(1);
//     const [calculate1, setCalculate1] = useState(100);

//     const [count2, setCount2] = useState(1);
//     // const [calculate2, setCalculate2] = useState(200);

//     const [count3, setCount3] = useState(1);
//     const [calculate3, setCalculate3] = useState(300);


//     useEffect(() => {

//         setCalculate1(count1 * 100);

//     }, [count1]);


//     useEffect(() => {

//         setCalculate2(count2 * 200);

//     }, [count2]);


//     useEffect(() => {

//         setCalculate3(count3 * 300);

//     }, [count3]);


//     return (
//         <div className="bill-container">

//             <h1>🛒 Shopping Cart</h1>


//             <div className="products">


//                 <div className="product-card">

//                     <h3>Product 1</h3>

//                     <p className="price">Price: ₹100</p>

//                     <div className="quantity">

//                         <button onClick={() => setCount1(count1 - 1)}>
//                             -
//                         </button>

//                         <span>{count1}</span>

//                         <button onClick={() => setCount1(count1 + 1)}>
//                             +
//                         </button>

//                     </div>

//                     <p className="product-total">
//                         Total: ₹{calculate1}
//                     </p>

//                 </div>


//                 <div className="product-card">

//                     <h3>Product 2</h3>

//                     <p className="price">Price: ₹200</p>

//                     <div className="quantity">

//                         <button onClick={() => setCount2(count2 - 1)}>
//                             -
//                         </button>

//                         <span>{count2}</span>

//                         <button onClick={() => setCount2(count2 + 1)}>
//                             +
//                         </button>

//                     </div>

//                     <p className="product-total">
//                         Total: ₹{calculate2}
//                     </p>

//                 </div>


//                 <div className="product-card">

//                     <h3>Product 3</h3>

//                     <p className="price">Price: ₹300</p>

//                     <div className="quantity">

//                         <button onClick={() => setCount3(count3 - 1)}>
//                             -
//                         </button>

//                         <span>{count3}</span>

//                         <button onClick={() => setCount3(count3 + 1)}>
//                             +
//                         </button>

//                     </div>

//                     <p className="product-total">
//                         Total: ₹{calculate3}
//                     </p>

//                 </div>

//             </div>


//             <div className="bill">

//                 <h2>Bill Summary</h2>

//                 <div className="bill-row">
//                     <span>Total Price</span>
//                     <span>
//                         ₹{calculate1 + calculate2 + calculate3}
//                     </span>
//                 </div>


//                 <div className="bill-row">
//                     <span>GST (5%)</span>
//                     <span>
//                         ₹{(calculate1 + calculate2 + calculate3) * 5 / 100}
//                     </span>
//                 </div>


//                 <hr />


//                 <div className="final-price">

//                     <span>Final Price</span>

//                     <span>
//                         ₹
//                         {(calculate1 + calculate2 + calculate3) +
//                         (calculate1 + calculate2 + calculate3) * 5 / 100}
//                     </span>

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default CalculateBill;




 function CalculateBill(){

    const [count1, setCount1] = useState(1);
    const [calculate1, setCalculate1] = useState(100);
 

    useEffect(() => {

        setCalculate1(()=>count1 * 100);

    }, [count1]);

    return(
       <>
       <button onClick={()=>setCount1(count1+1)}>+</button>
       <p>{count1}</p>
       <button onClick={()=>setCalculate1(calculate1-100)}>-</button>
       <p>{calculate1}</p>
       </>
    )
}
export default CalculateBill ;