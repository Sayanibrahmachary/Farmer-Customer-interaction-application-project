import React ,{useState}from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from '@fortawesome/free-regular-svg-icons';
import './AllProduct.css';
import UpdateProduct from "./UpdateProduct.jsx";
import DeleteProduct from "./DeleteProduct.jsx";
import AllCommentsFarmer from "./AllCommentsFarmer.jsx";

function AllProduct({productId,photo,productName,price,farmerId})
{
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsDelete]=useState(false);
    const [isOpenComments, setIsOpenComments] = useState(false);
    const [comments,setComments]=useState([]);

    function handleProductUpdate()
    {
      setIsOpen(true);
    }

    function handleProductDelete()
    {
        setIsDelete(true);
    }

    function closePopupUpdate(event) 
    {
      event.stopPropagation(); // Prevent event bubbling
      setIsOpen(false);
    }

    function closePopupDelete(event)
    {
      event.stopPropagation();
      setIsDelete(false);
    }

    const handleComment=async()=>
    {
       try{

          const response=await fetch(`http://localhost:8000/api/v1/product/allComments/${productId}`,{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
          })
        
        if (!response.ok) {
          const error = await response.json();
          console.error("Error:", error.message);
          alert(`Fetching all comments: ${error.message}`);
          return;
        }

        const result = await response.json();
        console.log("📦 all comments successfully:", result);
        setComments(result.data);
        setIsOpenComments(true);
        alert("fetched all comments successfully!");
       }
       catch(e)
       {
          console.error(e);
          alert(`An error occurred while fetching all the comments`);
       }
    }

    return(
        <>
            <div className="product">
                <img className="bigImage" src={photo}/>
                <div className="productName">
                  <h4>{productName}</h4>
                  <FontAwesomeIcon icon={faComment} onClick={handleComment} className="commentIcon"/>
                </div>
                <div className="veg-qoute">
                  <p>Healthy and nutrient-rich.</p>
                </div>
                <div className="stars">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/003/170/298/small/five-stars-5-star-icon-set-yellow-isolated-five-stars-vector.jpg"
                    alt="stars"
                  />
                  <h4 className="productPay">Rs:{price}</h4>
                </div>
                <div className="updateDelete">
                    <button onClick={handleProductUpdate} className="update">Update</button>
                    <button onClick={handleProductDelete} className="delete">Delete</button>
                </div>
            </div>
            {/* Popup & Overlay */}
            { isOpen && (
                <div className="overlay" onClick={closePopupUpdate}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <UpdateProduct closePopup={closePopupUpdate} productId={productId}/>
                    </div>
                </div>
            )}

            { isOpenDelete && (
                <div className="overlay" onClick={closePopupDelete}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <DeleteProduct closePopup={closePopupDelete} productId={productId}/>
                    </div>
                </div>
            )}

            {/* All comments */}
            {isOpenComments && 
            (
              <AllCommentsFarmer comments={comments} setIsOpenComments={setIsOpenComments} productId={productId}/>
            )}
        </>
    )
}

export default AllProduct;