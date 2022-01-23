import axios from "axios"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)


const RiderItem = ({ item, owner_bill, store, id, confirm_rider, time, num, first_name, code_discount }) => {

    let history = useHistory()

    let cookie = localStorage.getItem('username')

    let day = time.split('/')[0]

    let today = new Date().toLocaleString("th-th")
    let today_config = today.split('/')

    let past_day = parseInt(today_config[0]) - parseInt(day)


    // console.log(past_day)

    // console.log(today_config[0])

    // console.log(item)

    let Receive_Order = (id) => {
        Swal.fire({
            title: 'จะรับไปส่งออเดอร์หรือไม่?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY+"/get_rider", {
                    id: id,
                    username: cookie,
                    date: today
                }).then((res) => {
                    if (res.data.rider_get) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'รับออเดอร์ที่จะไปส่งเรียบร้อยเเล้ว',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            socket.emit('user', owner_bill)
                            history.push('/dashboard_rider')
                        }, 2000)
                    }
                    else {
                        if (res.data.refresh_again) {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'มีคนรับออเดอร์ชิ้นนี้เเล้วโปรดลองใหม่',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(() => {
                                window.location.reload(true)
                            }, 2000)
                        }
                        else {
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'คุณมีออเดอร์ที่รับไว้อยู่เเล้ว',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                })
            }
        })
    }

    return (
        <div>
            <div className="box-rider-order">
                <p className="order-id">ออเดอร์ที่ : {num}</p>
                <p>{time}</p>
                <div className="flex">
                    <p>ผู้สั่ง : {first_name}</p>
                    <p>ร้าน : {store}</p>
                </div>
                <hr />
                {item && item.length > 0 ? item.map((item) => {
                    return (
                        <div style={{ marginTop: '10px' }}>
                            <p>{item.food_name} x {item.quantity}</p>
                            {code_discount ? <p>ส่วนลด {code_discount} บาท</p> : null}
                        </div>
                    )
                }) : null}
                {confirm_rider != 0 ? <button className="btn-already">มีคนรับออเดอร์เรียบร้อยเเล้ว</button> : <button onClick={() => Receive_Order(id)} className="rider-confirm">รับออเดอร์</button>}
            </div>
        </div>
    )
}

export default RiderItem