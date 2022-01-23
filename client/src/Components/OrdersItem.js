import axios from "axios"
import { useHistory } from "react-router"
import Swal from "sweetalert2"
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

const OrdersItem = ({ item, owner_bill, time, id, confirm_market, tel, store, num, first_name, code_discount }) => {

    // console.log(item)

    let history = useHistory()


    let count

    count = item.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)

    let date = new Date()
    let th_date = date.toLocaleString("th-th")

    // console.log(count)

    let GetOrder = (id) => {

        Swal.fire({
            title: 'ต้องการรับออเดอร์?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY+"/get_order", {
                    id: id,
                    store: store,
                    date: th_date
                }).then((res) => {
                    if (res.data.get) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'รับออเดอร์เรียบร้อย',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            history.push("/home")
                            history.push("/orders")
                        }, 2000)
                    }
                })
            }
        })
    }

    let today = new Date().toLocaleString('th-TH')

    let today_config = today.split('/')[0]

    let past_day = (today_config - time.split('/')[0]) + 31 // 31 1 เดือน 31 วัน

    return (
        <div className="order-box">
            <p className="order-id">ออเดอร์ที่ : {num}</p>
            <div className="flex">
                <p>ผู้สั่งซื้อ : {first_name}</p>
                <p>ราคา : {count} ฿</p>
            </div>
            <hr /><br />
            {item && item.length > 0 ? item.map((item) => {
                // console.log(item)
                return (
                    <div>
                        <p>{item.food_name} x {item.quantity} = {(item.quantity * item.food_price)}</p>
                        {item.remark ? <p style={{ color: 'firebrick' }}>หมายเหตุ : {item.remark}</p> : null}
                    </div>
                )
            }) : null}<br />
            <hr /><br />
            <p style={{ textAlign: 'center' }}>{time}</p><br />
            <hr />
            <div className="btn-confirm">
                {confirm_market != 1 ? <button onClick={() => {
                    GetOrder(id)
                }} className="confirm-market">ยืนยันที่จะรับออเดอร์</button> : <button className="get-already">รับออเดอร์เรียบร้อยแล้ว</button>}
                <button onClick={() => window.open('tel: ' + tel)} className="tel-config" style={{ cursor: 'pointer' }}>โทรไปแก้ไข</button>
            </div>
        </div>
    )
}

export default OrdersItem