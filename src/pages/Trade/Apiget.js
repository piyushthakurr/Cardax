import axios from 'axios';
import React, { useEffect } from 'react';
import BigNumber from "bignumber.js";

const Apiget = () => {
    useEffect(() => {
        getdata();
    
      
    }, [])
    
   const getdata = async()=>{

     axios.get('https://api.coingecko.com/api/v3/simple/price?ids=mini-cardano&vs_currencies=usd')
     .then((response) => {
       console.log("uiop", response.data);
       
       console.log("uiop", response.data["mini-cardano"].usd);
       const a = response.data["mini-cardano"].usd;
            console.log("hi there", 
              a.toLocaleString("fullwide", {
                useGrouping: !1,
              })
            );
            console.log("hi there", BigNumber(a)
            
          );
            // dispatch({type: "SAVE_SCORE_SUCCESS", payload: response.data})
          })
        //   .catch((err) => {
        //     dispatch({type: "SAVE_SCORE_FAILURE", payload: err})
        //   }
        }
    
  return (
    <div>Apiget</div>
  )
}

export default Apiget