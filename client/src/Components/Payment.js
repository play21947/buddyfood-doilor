import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import io from "socket.io-client"
import Swal from "sweetalert2"
import { ClearCart } from "../Actions/CartActions"
import CheckoutCreditCard from "./CheckoutCreditCard"

let socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

const Payment = ({ count, cart, code }) => {

    let cookie = localStorage.getItem('username')
    let history = useHistory()
    let user_data = useSelector(state => state.user_data.userData)

    let dispatch = useDispatch()

    // if (cart && cart.length > 0) {
    //     console.log(cart[0].owner)
    // }

    let Th_time = new Date();
    let time = Th_time.toLocaleString("th-th")

    let cvt_time = time.split(':')
    let result_time = cvt_time[0] + ":" + cvt_time[1]

    let Now_Time = parseInt(time.split(':')[0].split(' ')[1]) //Real Time

    let test_time = 15 //Test Time

    console.log(Now_Time)


    let Bill = () => {  
        Swal.fire({
            title: 'ยืนยันการสั่งซื้อ',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'สั่งเลย',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {

                if (test_time > 17 || test_time < 8) {
                    Swal.fire({
                        text: 'ขออภัยนอกเวลาทำการ", เวลาทำการ (8.00น - 17.00น)',
                        icon: 'error'
                    })
                }
                else {
                    if (cart && cart.length > 0) {
                        socket.emit("send_notification", { text: "Hello This is my notification", market: cart[0].owner })
                        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/bill", {
                            username: cookie,
                            time: result_time,
                            cart: cart,
                            store: cart[0].owner,
                            tel: user_data[0].tel,
                            food_id: cart[0].id,
                            first_name: user_data[0].first_name,
                            code: code
                        }).then((res) => {
                            if (res.data.bill) {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'การสั่งซื้อสำเร็จ',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                setTimeout(() => {
                                    dispatch(ClearCart())
                                    history.push('/my_order')
                                }, 2000)
                            }
                            if(res.data.code_err){
                                Swal.fire("โค้ดไม่ถูกต้อง")
                            }
                            if(res.data.maximum){
                                Swal.fire("โค้ดหมดเเล้ว")
                            }
                            if(res.data.another_code){
                                Swal.fire("ไม่ใช่ร้านส่วนลด")
                            }
                            if(res.data.less_money){
                                Swal.fire("ต้องซื้อของมากกว่า 150 บาทขึ้นไปจะใช้โค้ดส่วนลดได้")
                            }
                        })
                    }
                }
            }
        })
    }

    return (
        <div>
            {count > 0 ? <div className="payment">
                {user_data && user_data.length > 0 ? user_data[0].lat > 0 && user_data[0].longitude > 0 ? <button onClick={() => Bill()} className="pay-destination">จ่ายปลายทาง</button> : <button className="gps-navigation" onClick={() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'กรุณาระบุตำเเหน่ง!',
                        text: '(ไปหน้า "โปรไฟล์" เพื่ออัพเดตตำเเหน่ง)',
                        confirmButtonText: 'OK',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          history.push("/myprofile")
                        }
                      })
                }}>จ่ายปลายทาง</button> : null}
                <CheckoutCreditCard />
            </div> : null}
        </div>
    )
}

export default Payment