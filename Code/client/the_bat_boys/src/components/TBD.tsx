import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const TBD = () => {
    type content = {
        id: number;
        author: string;
        content: string;
        date: string;
      };

    const [content, setContent] = useState<content[]>([]);
    const [commentText, setCommentText] = useState("");

    // Fetch comments on component mount
    useEffect(() => {
      axios.get("http://localhost:3000/other").then((response) => {
          setContent(response.data);
      }).catch((error) => {
          console.error('Error fetching comments:', error);
      });
    }, []);

 // Handle posting a new comment
 const handlePostContent = () => {
  if (commentText) {
      axios.post("http://localhost:3000/other", {
          commentText: commentText,
      }).then((response) => {
          setContent([response.data, ...content]); // add new comment at the top
          setCommentText("");
      }).catch((error) => {
          console.error('Error posting comment:', error);
      });
  }
};

    return (
        <div>
            <Navbar />
            <div>
      <h2>Welcome to the Peer Review Forum!</h2>
      <p>Please feel free to ask any question below.</p>

      <div className="comments">
        <h3>Comments:</h3>
        {content.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.author}:</strong> {comment.content}</p>
            <small>{new Date(comment.date).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="comment-form">
        <h3>Leave a Comment:</h3>
        <textarea
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <button onClick={handlePostContent}>Post Comment</button>
      </div>
    </div>
  </div>
    );
};

export default TBD;