import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AsnycOrders } from '../Actions/OrdersActions'
import CopyRight from './CopyRight'
import OrdersItem from './OrdersItem'
import io from 'socket.io-client'
// import io from 'socket.io-client'

let socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)


const Orders = () => {

    let cookie = localStorage.getItem('username')
    let [userdata, setUserdata] = useState([])
    let [status, setStatus] = useState(false)
    let [order, setOrder] = useState([])
    let [keep, setKeep] = useState([])
    let [newOrder, setNewOrder] = useState([])


    let reduce = order.filter((item)=> item.store === userdata[0].market)

    // let dispatch = useDispatch()
    // let order_data = useSelector(state => state.order_data.ordersData)
    // let user_data = useSelector(state => state.user_data.userData)

    // const LoadApi=async(api)=>{
    //     return new Promise((resolve, reject)=>{
    //         axios.post(api).then((res)=>{
    //             resolve(res)
    //         })
    //     })
    // }

    useEffect(() => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY+"/user", {
            username: cookie
        }).then((res) => {
            setUserdata(res.data)
            setStatus(true)
        })


        if (userdata && userdata.length > 0 && status) {

            //Realtime
            // socket.on('admin_orders', (payload)=>{
            //     setOrder(payload)
            // })

            // Not Realtime
            axios.post(process.env.REACT_APP_DOMAIN_KEY+"/order_store", {
                market: userdata[0].market
            }).then((res) => {
                // console.log(res.data)
                setOrder(res.data)
            })
        }

    }, [status])

    // if(order && order.length > 0){
    //     order.map((item)=>{
    //         console.log(item)

    //     })
    // }



    return (
        <div>
            <div className="grid-order">
                {reduce && reduce.length > 0 ? reduce.map((item, index) => {
                    return <OrdersItem num={item.id} item={JSON.parse(item.bill)} store={item.store} time={item.time} owner_bill={item.owner_bill} id={item.id} confirm_market={item.confirm_market} tel={item.tel_owner_bill} first_name={item.first_name_owner_bill} code_discount={item.code_discount} />
                }) : <p style={{ textAlign: 'center' }}>ยังไม่มีสินค้าเข้ามาค่ะ</p>}
            </div>
        </div>
    )
}

export default Orders