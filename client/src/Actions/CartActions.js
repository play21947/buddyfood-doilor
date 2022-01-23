export const AddToCart=(data)=>{
    return {
        type: "ADD_TO_CART",
        payload: data
    }
}

export const Increment=(id)=>{
    return{
        type: 'INCREMENT',
        payload: id
    }
}

export const Decrement=(id)=>{
    return{
        type: 'DECREMENT',
        payload: id
    }
}

export const ClearCart=()=>{
    return{
        type: "CLEAR_CART",
    }
}


export const DeleteFromCart=(id)=>{
    return{
        type: 'DELETE_FROM_CART',
        payload: id
    }
}

export const AsnycDeleteFromCart=(id ,cb)=>{
    return(dispatch)=>{
        dispatch(DeleteFromCart(id))
        cb()
    }
}