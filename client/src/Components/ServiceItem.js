import Swal from 'sweetalert2'
import axios from 'axios'
import { useHistory } from 'react-router'

const ServiceItem = ({ bill, store, num, tel, confirm_market, owner_bill, first_name }) => {

    let history = useHistory()

    let date = new Date()
    let th_date = date.toLocaleString("th-th")


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
                            history.push("/service")
                        }, 2000)
                    }
                })
            }
        })
    }


    return (
        <div className="box-service">
            <p className="order-id">ออเดอร์ที่ : {num}</p>
            <p>ร้าน : {store}</p>
            <p>ลูกค้า : {first_name}</p>
            {bill && bill.length > 0 ? bill.map((item) => {
                return (
                    <div>
                        <p>{item.food_name} x {item.quantity} = {item.quantity * item.food_price}</p>
                    </div>
                )
            }) : null}
            <div className="btn-confirm">
                {!confirm_market ? <button onClick={() => {
                    GetOrder(num)
                }} className="confirm-market">ยืนยันที่จะรับออเดอร์</button> : <button className="get-already">รับออเดอร์เรียบร้อยแล้ว</button>}
                <button onClick={() => {
                    window.open('tel: ' + tel)
                }} className="tel-config">โทร : {tel}</button>
            </div>
        </div>
    )
}

export default ServiceItem