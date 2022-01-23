import axios from "axios"

const Start_User=()=>{
    return{
        type: "START_USER"
    }
}

const Receive_User=(username)=>{
    return{
        type: "RECEIVE_USER",
        payload: username
    }
}

const Error_User=()=>{
    return{
        type: "ERROR_USER"
    }
}

export const AsyncUser=(username)=>{
    return (dispatch)=>{
        dispatch(Start_User())
        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/user",{
            username: username
        }).then((res)=>{
            dispatch(Receive_User(res.data))
        }).catch((err)=>{
            if(err){
                dispatch(Error_User())
            }
        })
    }
}