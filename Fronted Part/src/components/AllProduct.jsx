import React ,{useState}from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from '@fortawesome/free-regular-svg-icons';
import './AllProduct.css';
import UpdateProduct from "./UpdateProduct.jsx";
import DeleteProduct from "./DeleteProduct.jsx";


function AllProduct({productId,photo,productName,price,farmerId})
{
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsDelete]=useState(false);

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
    return(
        <>
            <div className="product">
                <img className="bigImage" src={photo}/>
                <div className="productName">
                  <h4>{productName}</h4>
                  <FontAwesomeIcon icon={faComment} />
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
        </>
    )
}

export default AllProduct;