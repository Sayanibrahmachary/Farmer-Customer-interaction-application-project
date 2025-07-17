import React, { useEffect, useState } from "react";
import './AllComments.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTimes ,faPen,faTrash} from '@fortawesome/free-solid-svg-icons';

function AllComments({ comments ,setIsOpenComments, productId}) {
  const [msg, setMsg] = useState("");
  const [message, setMessage] = useState("");
  const [msgseen, setMsgseen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate=async()=>
  {
    setMsg(message);       // Put message back in input
    setIsEditing(true);  
  }
  
  const handleMsg=async()=> {
    if (isEditing) {
      // Update mode
      setMessage(msg);
      setIsEditing(false);
      setMsg("");
      const data={
        description:msg,
      }
  
      const commentId=localStorage.getItem("commentId");

      try
      {
        const token = localStorage.getItem("token");
        //console.log(token);
        
        if (!token) {
            console.error("No token found. Please log in.");
            alert("You are not logged in.");
            return;
        }
        const response=await fetch(`http://localhost:8000/api/v1/comments/updateComment/${commentId}`,{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })
        console.log(response);

        if (!response.ok) {
          const error = await response.json();
          console.error("Error:", error.message);
          alert(error.message);
        }
        else{
          const result = await response.json();
          console.log("Comment placed successfully", result);
          alert("Comment placed successfully");
        }
      }
      catch(e)
      {
        console.log("Error occur in the time of push the comment in database");
        alert(`Error occur in the time of push the comment in database`);
      }

    } 
    else {
      // Add mode
      setMessage(msg);
      setMsgseen(true);
      setMsg("");
      const data={
        description:msg,
      }

      try
      {
        const token = localStorage.getItem("token");
        console.log(token);
        if (!token) {
            console.error("No token found. Please log in.");
            alert("You are not logged in.");
            return;
        }
        const response=await fetch(`http://localhost:8000/api/v1/comments/createComment/${productId}`,{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
		  		const error = await response.json();
		  		console.error("Error:", error.message);
		  		alert(error.message);
		  	}
		  	else{
		  		const result = await response.json();
		  		console.log("Comment placed successfully", result);
          localStorage.setItem("commentId",result.data._id);
		  		alert("Comment placed successfully");
		  	}
      }
      catch(e)
      {
        console.log("Error occur in the time of push the comment in database");
        alert(`Error occur in the time of push the comment in database`);
      }
    }
  }

  const handleDelete=async()=>
  {
    setMessage("");
    setMsgseen(false);
    setMsg("");
    setIsEditing(false);

    const commentId=localStorage.getItem("commentId");

    try
    {
      const token = localStorage.getItem("token");
      
      if (!token) {
          console.error("No token found. Please log in.");
          alert("You are not logged in.");
          return;
      }
      const response=await fetch(`http://localhost:8000/api/v1/comments/deletedComment/${commentId}`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
      })
      if (!response.ok) {
				const error = await response.json();
				console.error("Error:", error.message);
				alert(error.message);
			}
			else{
				const result = await response.json();
				console.log("Comment deleted successfully", result);
				alert("Comment deleted successfully");
			}
    }
    catch(e)
    {
      console.log("Error occur in the time of delete the comment in database");
      alert(`Error occur in the time of delete the comment in database`);
    }
  }

  function handleVisible() {
    setVisible(!visible);
    setIsOpenComments(!visible);
  }

  useEffect(() => {
    handleVisible();
  }, []);

  return (
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

              <div className="my-msg">
                <div className="my-msg1">
                  {msgseen && 
                   <div className="my-msg-div">
                   <p>{message}</p>
                   <FontAwesomeIcon icon={faPen} className="iconUpdate" onClick={handleUpdate}/>
                   <FontAwesomeIcon icon={faTrash} className="iconDelete" onClick={handleDelete}/>
                   </div> 
                 }
                </div>
                <div className="my-msg-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <div className="send-icon">
                    <button onClick={handleMsg}>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllComments;
