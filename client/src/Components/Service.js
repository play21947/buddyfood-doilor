import axios from 'axios'
import { useEffect, useState } from 'react'
import ServiceItem from './ServiceItem'
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)


const Service = () => {

    let url = process.env.REACT_APP_DOMAIN_KEY+"/all_order"

    let [orders, setOrders] = useState([])


    const LoadApi = async (api) => {
        return new Promise((resolve, reject) => {
            axios.get(api).then((res) => {
                resolve(res.data)
            })
        })
    }

    useEffect(async () => {
        // await LoadApi(url).then((res) => {
        // })
        socket.on("admin_orders", (rs)=>{
            setOrders(rs)
        })
    }, [])

    console.log(orders)

    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Call Center</h1>
            <div className="grid-service">
                {orders && orders.length > 0 ? orders.map((item) => {
                    let Json_bill = JSON.parse(item.bill)
                    return <ServiceItem key={item.id} bill={Json_bill} store={item.store} num={item.id} tel={item.tel_owner_market} confirm_market={item.confirm_market} owner_bill={item.owner_bill} first_name={item.first_name_owner_bill}></ServiceItem>
                }) : <div><p>ไม่มีสินค้า</p></div>}
            </div>
        </div>
    )
}

export default Service