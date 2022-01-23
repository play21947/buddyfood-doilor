import axios from "axios"
import { useSelector } from "react-redux"
import { ClearCart } from "../Actions/CartActions"
import { useDispatch } from "react-redux"
import Swal from "sweetalert2"
import { useHistory } from "react-router"
import io from 'socket.io-client'

let socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

const CheckoutCreditCard = () => {

    let Th_time = new Date();
    let time = Th_time.toLocaleString("th-th")

    let user_data = useSelector(state=> state.user_data.userData)

    let dispatch = useDispatch()
    let history = useHistory()

    let cookie = localStorage.getItem('username')
    let cart = useSelector(state => state.cart.cart)

    let total = cart.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)

    // console.log(cart)

    let OmiseCard

    let HandleLoadScript = () => {
        OmiseCard = window.OmiseCard
        OmiseCard.configure({
            publicKey: 'pkey_test_5onhu6tsiwtl37ofp6n',
            currency: 'thb',
            frameLabel: 'Doilor Delivery',
            submitLabel: 'Pay Now',
            buttonLabel: 'Pay with Omise'
        })
    }

    HandleLoadScript()

    let CreditCardConfigure = () => {
        OmiseCard.configure({
            defaultPaymentMethod: 'credit_card',
            otherPaymentMethods: []
        })
        OmiseCard.configureButton('#credit-card')
        OmiseCard.attach()
    }


    let omiseCartHandler = () => { // รับ Token
        OmiseCard.open({
            frameDescription: 'กรอกข้อมูล',
            amount: total * 100,
            onCreateTokenSuccess: (token) => {
                axios.post(process.env.REACT_APP_DOMAIN_KEY+"/checkout-credit-card", {
                    username: cookie,
                    amount: total,
                    time: time,
                    cart: cart,
                    store: cart[0].owner,
                    tel: user_data[0].tel,
                    token: token
                }).then((res) => {
                    // console.log(res.data)
                    if (res.data.status === "successful") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ทำธุรกรรมสำเร็จจ่ายเงินจำนวน ' + res.data.amount+ ' บาท',
                            showConfirmButton: false,
                            timer: 2500
                        })
                        socket.emit("notification", {room: cart[0].owner, text: 'มีออเดอร์เข้ามา +1'})
                        setTimeout(()=>{
                            dispatch(ClearCart())
                            // history.push('/myprofile')
                        }, 3000)
                    }
                })
            },
            onFormClosed: () => { },
        })
    }


    let PaymentMethod = (e) => {
        e.preventDefault()

        CreditCardConfigure()
        omiseCartHandler()
    }

    return (
        <div className="own-form">
            <form>
                <button id="credit-card" onClick={(e) => {
                    PaymentMethod(e)
                }} className="credit-card" type="button">จ่ายด้วยบัตรเครดิต</button>
            </form>
        </div>
    )
}

export default CheckoutCreditCard