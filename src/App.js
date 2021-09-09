import React from "react"
import "./app.scss"
import axios from "axios";
import FindBlock from "./components/find-block";
import socket from "./socket";
import reducer from "./reducer";
import Chat from "./components/chat";

function App() {
    const [state, dispatch] = React.useReducer(reducer,{
        joined:false,
        roomId: null,
        nickname: null,
        users: [],
        messages: []
    })
    const setUsers = (users) => {
        dispatch({
            type: "SET_USERS",
            payload: users
        })
    }
    const addMessage = (message) => {
        dispatch({
            type: "SET_MESSAGES",
            payload: message
        })
    }
    const onLogin = async (obj) => {
        dispatch({
            type:"JOINED",
            payload: obj
        })
        socket.emit('ROOM:JOIN',obj)
       const{ data } = await axios.get(`/rooms/${obj.roomId}`)
        setUsers(data.users)
    }
    React.useEffect(() => {
        socket.on("ROOM:SET_USERS", setUsers)
        socket.on("ROOM:SET_MESSAGES", addMessage)
    },[])
  return (
    <div className="wrapper">
        {!state.joined ? <FindBlock onLogin={onLogin}/> : <Chat {...state} onAdd={addMessage}/>}
    </div>
  );
}

export default App;
