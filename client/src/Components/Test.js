const Test=()=>{


    let cart = JSON.parse(localStorage.getItem('cart'))

    let count = cart.reduce((sum, item)=> sum + item.quantity, 0)

    console.log(cart)

    console.log(count)

    return(
        <div>
            <h1>Test</h1>
        </div>
    )
}

export default Test