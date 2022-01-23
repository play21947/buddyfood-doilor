import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import HistoryOrderItem from "./HistoryOrderItem"

const HistoryOrder = () => {

    let cookie = localStorage.getItem('username')

    let [order, setOrder] = useState([])

    useEffect(() => {

        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/history_order", {
            username: cookie
        }).then((res) => {
            setOrder(res.data)
        })
        
    }, [])

    console.log(order)


    return (
        <div className="history-screen">
            <h1 className="header-order">ประวัติการสั่งซื้อของคุณ (History)</h1>

            <div className="grid-history">
                {order && order.length > 0 ? order.map((item) => {
                    return <HistoryOrderItem item={JSON.parse(item.bill_storage)} time={item.time} store={item.store} finish_time={item.finish_time}/>
                }) : <p>ไม่มีประวัติการสั่งซื้อของคุณ</p>}
            </div>
        </div>
    )
}

export default HistoryOrder