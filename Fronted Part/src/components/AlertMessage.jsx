import React from "react";
import './AlertMessage.css';


function AlertMessage({message})
{
    console.log(message);
    return (
        <>
            <div className="alertOuter">
                <div className="alertDiv">
                    <p>{message}</p>
                </div>
            </div>
        </>
    )
}


export default AlertMessage;
