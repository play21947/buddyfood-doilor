import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router"
import { Decrement, Increment, DeleteFromCart, AsnycDeleteFromCart } from "../Actions/CartActions"
import Payment from "./Payment"


const Cart = () => {

    let history = useHistory()

    let cart = useSelector(state => state.cart.cart)

    let dispatch = useDispatch()

    // console.log(cart)

    let storage_cart = JSON.parse(localStorage.getItem('cart'))

    // console.log(storage_cart)

    // console.log(cookie_cart)

    let count
    let total

    let [status_code, setStatus_code] = useState(false)
    let [text_code, setText_code] = useState('')
    let [detailCode, setDetailCode] = useState([])

    if (storage_cart && storage_cart.length > 0) {
        storage_cart.map((item) => {
            count = storage_cart.reduce((sum, item) => sum + item.quantity, 0)
            total = storage_cart.reduce((sum, item) => sum + (item.food_price * item.quantity), 0)
        })
    }

    return (
        <div className="show-cart">
            <div className="split">
                <div className="show">
                    <h1>รายการสั่งซื้อ</h1>
                    {storage_cart && storage_cart.length > 0 ? storage_cart.map((item) => {
                        return (
                            <div className="box-show">
                                <p className="delete-item" onClick={() => {
                                    dispatch(DeleteFromCart(item.id))
                                }}>X</p>
                                <img src={'../resize_pictures_food/' + item.food_img}></img>
                                <div className="detail">
                                    <p className="food-detail-cart">{item.food_name}</p>
                                    <p>เจ้าของ : {item.owner}</p>
                                    <p>ราคา : {item.food_price} ฿</p>
                                    {item.remark ? <p>หมายเหตุ : {item.remark}</p> : null}
                                    <div className="btn-detail">
                                        <button style={{backgroundColor: 'white'}} className="btn-increment" onClick={() => {
                                            dispatch(Decrement(item.id))
                                        }}>-</button>
                                        <h2>{item.quantity}</h2>
                                        <button style={{backgroundColor: 'white'}} className="btn-decrement" onClick={() => {
                                            dispatch(Increment(item.id))
                                        }}>+</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : "ยังไม่มีสินค้าในตะกร้า"}
                </div>
                <div className="cashier">
                    <div className="cashier-pos">
                        <h1>จ่ายบิล</h1>
                        <p className="add-code" onClick={()=>{
                            setStatus_code(!status_code)
                            setText_code('')
                        }}>+ ใช้ code</p>
                        <hr /><br />
                        {storage_cart && storage_cart.length > 0 ? storage_cart.map((item) => {
                            return (
                                <div>
                                    <p className="name-food-cart">{item.food_name} X {item.quantity} = {item.food_price * item.quantity} บาท</p>
                                </div>
                            )
                        }) : <p>ไม่มีสินค้า</p>}<br />
                        {cart && cart.length > 0 ? <div>
                            <p>รวมสินค้าทั้งหมด : {count} ชิ้น</p><br/>
                            <p>ค่าขนส่ง 15 บาท</p>
                            <p>ยอดรวมทั้งสิ้น : {total + 15} บาท</p><br />
                        </div> : null}
                        <hr />
                        <br />
                        {status_code ? <div>
                            <p>กรุณาใส่ Code</p>
                            <input onChange={(e)=>{
                                setText_code(e.target.value)
                            }}></input>
                        </div> : null}
                        {status_code ? <br/> : null}
                        <Payment code={text_code} count={count} cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart