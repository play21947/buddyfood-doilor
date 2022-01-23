import axios from "axios"

let StockStart=()=>{
    return{
        type: "STOCK_START"
    }
}

let StockReceive=(data)=>{
    return{
        type: "STOCK_RECEIVE",
        payload: data
    }
}

let StockError=()=>{
    return{
        type: "STOCK_ERROR"
    }
}


export const AsnycStock=()=>{
    return (dispatch)=>{
        dispatch(StockStart())
        axios.get(process.env.REACT_APP_DOMAIN_KEY+"/stock").then((res)=>{
            dispatch(StockReceive(res.data))
        }).catch((err)=>{
            if(err){
                dispatch(StockError())
            }
        })
    }
}