import { useState } from "react";
import "./contact.scss";

export default function Contact() {

  const [message, setMessage] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setMessage(true);
  };
  return (
    <div className="contact" id="contact">
      <div className="left">
        <img src="assets/shake.svg" alt="" />
      </div>
      <div className="right">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Your email address" />
          <textarea placeholder="Send us a message"></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}
