import React,{useEffect, useState} from "react";
import  './TodaysOrder.css';
import CartItems from "./CartItems";
import { loadStripe } from "@stripe/stripe-js"; 

function TodaysOrder({id})
{
    const [orders, setOrders] = useState([]);
    const [isPaymentDone, setIsPaymentDone]=useState(() => {
        return localStorage.getItem("paymentDone") === "true";
    });

    useEffect(() => {
        localStorage.setItem("paymentDone", isPaymentDone);
    }, [isPaymentDone]);

    const makePayment = async () => {
        if (orders.length === 0) {
            console.error("❌ No orders to process!");
            return;
        }
    
        console.log("🛒 Sending products to backend:", orders); // Log products before request
    
        const stripe = await loadStripe("pk_test_51QpZbMRpTz03Qe5jL0vqPFAdHMRAFSr1w7aAGIBMUIiwfn5AC4DjIQqCspaeOdfxKiJgwZaz8Vrbq31WTI5ecdfF008b0g1VXr");
    
        const body = { products: orders };
    
        try {
            const response = await fetch(
                "http://localhost:8000/api/v1/payment/create-checkout-session",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );
    
            const session = await response.json();
            console.log("🎟️ Received session from backend:", session); // Log response
    
            if (!session.id) {
                throw new Error("Invalid session response from server");
            }
            localStorage.setItem("paymentDone", "true"); // ✅ Persist payment state
            setIsPaymentDone(true);
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
    
            if (result.error) {
                console.log(result.error);
            }
            
        } catch (error) {
            console.error("❌ Payment error:", error);
        }
    };
    console.log(isPaymentDone);
    
    return(
        <> 
            <div className="todaysOrderSection" >
                <div className="headingPartTodaysOrderSection">
                    <h1>Todays Order</h1>
                </div>
                <div className="todaysOrderPart">
                    <div className="headingProducts">
                        <h3>Product Image</h3>
                        <h3>Product Name</h3>
                        <h3>Product Amount</h3>
                        <h3>Kg or G</h3>
                        <h3>Total Price</h3>
                    </div>
                    <CartItems setOrders={setOrders} id={id}/>
                </div>
                <div className="paymentButton">
                    {!isPaymentDone ? (<button className="checkout" onClick={makePayment}>
                        Proceed to pay
                    </button>):
                    (
                        <button className="checkout">
                            Payment Done
                        </button>
                    )
                    }
                </div>
            </div>
        </>
    )
}

export default TodaysOrder;

