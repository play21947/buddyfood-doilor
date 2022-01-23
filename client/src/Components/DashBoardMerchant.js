import axios from 'axios'
import React, { useEffect, useState } from 'react'

const DashBoardMerchant = () => {

    const cookie = localStorage.getItem('username')

    let [orders, setOrders] = useState([])
    let [user, setUser] = useState([])
    let cvtOrders = []


    if (orders && orders.length > 0) {
        orders.map((item) => {
            let cvt = JSON.parse(item.bill_storage)
            if (cvt && cvt.length > 0) {
                cvt.map((item) => {
                    cvtOrders.push(item)
                })
            }
        })
    }

    let total_money = cvtOrders.reduce((sum, item) => sum = sum + item.food_price, 0)
    console.log(total_money)

    console.log(cvtOrders)

    const LoadUser = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const LoadOrders = (api, market) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                market: market
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    useEffect(async () => {

        await LoadUser(process.env.REACT_APP_DOMAIN_KEY+'/user', cookie).then((res) => {
            setUser(res)

            LoadOrders(process.env.REACT_APP_DOMAIN_KEY+'/order_storage', res[0].market).then((res) => {
                console.log(res)
                setOrders(res)
            })
        })
    }, [])

    return (
        <div className="dashboard-merchant">
            <div className="dashboard-total">
                <h3>การขายล่าสุด</h3>
                {cvtOrders && cvtOrders.length > 0 ? <p>{cvtOrders[cvtOrders.length - 1].food_name} x {cvtOrders[cvtOrders.length - 1].quantity}</p> : null}
                <p>{cvtOrders && cvtOrders.length > 0 ? cvtOrders[cvtOrders.length - 1].food_price : null} บาท</p>
            </div>
            <div className="dashboard-total">
                <h3>ยอดรวมทั้งสิ้น</h3>
                <p>{total_money} บาท</p>
            </div>
        </div>
    )
}

export default DashBoardMerchant