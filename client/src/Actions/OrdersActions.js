import axios from "axios"

const StartOrders=()=>{
    return{
        type: "START_ORDERS"
    }
}


const ReceiveOrders=(data)=>{
    return{
        type: "RECEIVE_ORDERS",
        payload: data
    }
}

const ErrorOrders=()=>{
    return{
        type: "ERROR_ORDERS"
    }
}


export const AsnycOrders=()=>{
    return (dispatch)=>{
        dispatch(StartOrders())
        axios.get(process.env.REACT_APP_DOMAIN_KEY+"/orders").then((res)=>{
            dispatch(ReceiveOrders(res.data))
        }).catch((err)=>{
            if(err){
                dispatch(ErrorOrders())
            }
        })
    }
}