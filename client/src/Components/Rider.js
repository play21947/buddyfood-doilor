import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { AsnycOrders } from "../Actions/OrdersActions"
import RiderItem from "./RiderItem"
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

const Rider=()=>{

    let cookie = localStorage.getItem('cookie')

    let history = useHistory()
    let dispatch = useDispatch()
    // let order = useSelector(state => state.order_data.ordersData)
    let [order, setOrder] = useState([])
    let [user, setUser] = useState([])



    const GetApi=(api)=>{
        return new Promise((resolve, reject)=>{
            axios.get(api).then((res)=>{
                resolve(res.data)
            })
        })
    }


    useEffect(async()=>{


        await GetApi(process.env.REACT_APP_DOMAIN_KEY+'/all_order').then((res)=>{
            setOrder(res)
        })

        // axios.get(process.env.REACT_APP_DOMAIN_KEY+'/user',{
        //     username: cookie
        // }).then((res)=>{
        //     setUser(res.data)
        // })
    }, [])

    console.log(order)

    // console.log(order)

    return(
        <div className="grid-rider-order">
            {order && order.length > 0 ? order.map((item)=>{
                return <RiderItem key={item.id} num={item.id} item={JSON.parse(item.bill)} owner_bill={item.owner_bill} store={item.store} id={item.id} confirm_rider={item.confirm_rider} time={item.time} first_name={item.first_name_owner_bill} code_discount={item.code_discount}/>
            }) : <p>กำลังโหลดข้อมูล</p>}
        </div>
    )
}

export default Rider