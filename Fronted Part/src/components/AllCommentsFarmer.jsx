import React,{useState,useEffect} from "react";
import "./AllComments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes ,faPen,faTrash} from '@fortawesome/free-solid-svg-icons';

function AllCommentsFarmer({ comments ,setIsOpenComments, productId})
{
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    function handleVisible() {
        setVisible(!visible);
        setIsOpenComments(!visible);
    }

    useEffect(() => {
      handleVisible();
    }, []);
    
    return(
    <>
        {visible && (
          <div className="comments-overlay">
            <div className="msg-div">
              <div className="heading-comments">
                <h3>Comments</h3>
              </div>
              <button className="close-btn1" onClick={handleVisible}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <div className="msg">
                <div className="all-msg">
                  {comments.length > 0 ? (
                    comments.map((item, index) => (
                      <div className="all-msg1" key={index}>
                        <div className="all-msg1-left">
                          <img src=".\src\assets\profilePic.jpeg"/>
                        </div>
                        <div class="comment-bubble">
                          <div class="comment-author"><h4>🔥 {item.username}</h4></div>
                          <div class="comment-time">Today at 3:45 PM</div>
                          <div class="comment-text">
                            {item.comment}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </>)
}

export default AllCommentsFarmer;