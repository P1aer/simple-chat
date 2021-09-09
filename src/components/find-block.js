import React, { useState } from "react"
import axios from "axios";

function FindBlock({ onLogin }) {
    const [form, setForm] = useState({
        id: "",
        name: ""
    })
    const [isLoading, setLoading] = useState(false)
    const changeHandler = (ev) => {
        setForm({...form,[ev.target.name]: ev.target.value})
    }
    const onSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true)
       await axios.post('/rooms', {
            roomId: form.id,
            nickname: form.name
        })
        onLogin({
            roomId: form.id,
            nickname: form.name
        })
    }
   return (
       <form onSubmit={onSubmit} className="find-block">
           <input required onChange={changeHandler} value={form.id} name={"id"} type="text" placeholder="Room ID"/>
           <input required onChange={changeHandler} value={form.name} name={"name"} type="text" placeholder="Nickname"/>
           <button disabled={isLoading} type="submit">{!isLoading? "Войти": "Входим"}</button>
       </form>
   )
}

export default FindBlock
