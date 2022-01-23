import axios from "axios"
import { useEffect, useState } from "react"
import StatusOrder from "./StatusOrder"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)


const MyOrder = () => {

    let history = useHistory()

    let inventory
    let total

    if (user && user.length > 0 && user[0].rider_inventory) {
        inventory = JSON.parse(user[0].rider_inventory)
    }
    
    if (inventory && inventory.length > 0) {
        total = inventory.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)
    }

    let [user, setUser] = useState([])

    let [order, setOrder] = useState([])

    const cookie = localStorage.getItem('username')

    const LoadApiUser = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api,{
                username: cookie
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const LoadApiOrder=(api, cookie)=>{
        return new Promise((resolve, reject)=>{
            axios.post(api,{
                username: cookie
            }).then((res)=>{
                resolve(res.data)
            })
        })
    }

    useEffect(async() => {
        await LoadApiUser(process.env.REACT_APP_DOMAIN_KEY+'/user', cookie).then((res)=>{
            setUser(res)

            // socket.emit("get_username", cookie)

            // socket.on("value_status", (payload)=>{
            //     setOrder(payload)
            // })

            LoadApiOrder(process.env.REACT_APP_DOMAIN_KEY+'/order_client', cookie).then((res)=>{
                setOrder(res)
            })
            
        })
    }, [])

    return (
        <div>
            {user && user.length > 0 ? 
            <div className="box-order-client">
                <br />
                <h1 style={{ textAlign: 'center', fontSize: '25px' }}>ออเดอร์ของฉัน</h1>
                <p style={{ textAlign: 'center' }}>*สเตตัสจะหายไปเมื่อมีการส่งสินค้าเสร็จสิ้น*</p>
                {order && order.length > 0 ? order.map((item) => {
                    return <StatusOrder item={JSON.parse(item.bill)} confirm_market={item.confirm_market} confirm_rider={item.confirm_rider} time={item.time} confirm_market_time={item.confirm_market_time} confirm_rider_time={item.confirm_rider_time} code_discount={item.code_discount} />
                }) : <p style={{ textAlign: 'center' }}>คุณยังไม่ได้สั่งสินค้า</p>}
            </div> : null}
        </div>
    )
}

export default MyOrder;