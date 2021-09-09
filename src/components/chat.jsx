import React, { useState } from 'react';
import socket from "../socket";

function Chat({ users, messages, roomId, nickname, onAdd }) {
    const [message, setMessage] = useState('')
    const messageRef = React.useRef(null)
    const onSubmit = () => {
        if (!message) {
            return
        }
        socket.emit("ROOM:NEW_MESSAGE", {
            roomId,
            text: message,
            user: nickname
        })
        onAdd({
            text: message,
            user: nickname
        })
        setMessage("")
    }
    React.useEffect(() => {
        messageRef.current.scrollTo(0, 99999)
    },[messages])
    return (
        <div className="chat">
            <div className="chat-users">
                <b>Room {roomId}</b><br/>
                <hr/>
                Online ({users.length})
                <div className="users-container">
                    <ul className="users-list">
                        {users.map((user, index) =>
                            <li key={user + index}>
                                {nickname === user? "You" : user}
                            </li>)}
                    </ul>
                </div>

            </div>
            <div className="chat-messages">
                <div ref={messageRef} className="message-container">
                    {messages.map((elem,index)=> {
                        const style = []
                        if ( nickname === elem.user) {
                            style.push("your-message")
                        }
                        return(
                            <div key={index} className="message">
                                <p className={style.join(" ")}> {elem.text}</p>
                                <span>{nickname === elem.user ? "You" : elem.user}</span>
                            </div>)
                    })}
                </div>
                <div className="write-block">
                    <textarea value={message} onChange={(ev)=> setMessage(ev.target.value)} name="message" id="" cols="60" rows="4" className="write"/>
                    <button onClick={onSubmit} className="send" type="submit">Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat;

