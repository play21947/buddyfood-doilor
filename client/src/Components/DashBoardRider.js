import axios from "axios"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import Swal from "sweetalert2"

const DashBoardRider = () => {

    // const LoadApi=(api)=>{
    //     return new Promise((resolve, reject)=>{
    //         axios
    //     })
    // }

    const cookie = localStorage.getItem('username')

    let [user, setUser] = useState([])

    let [order, setOrder] = useState([])

    let [other, setOther] = useState([])

    let history = useHistory()

    let inventory
    let total

    if (user && user.length > 0 && user[0].rider_inventory) {
        inventory = JSON.parse(user[0].rider_inventory)
    }

    if (inventory && inventory.length > 0) {
        total = inventory.reduce((sum, item) => sum + (item.quantity * item.food_price), 0)
    }

    const LoadApiUser = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                resolve(res.data)
            })
        })
    }

    const LoadApiOrder = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                console.log(res.data)
                resolve(res.data)
            })
        })
    }

    const LoadPositionMarket = (api, market) => {
        return new Promise((resovle, reject) => {
            axios.post(api, {
                market: market
            }).then((res) => {
                resovle(res)
            })
        })
    }


    let FinishDeliver = (id) => {

        Swal.fire({
            text: "คุณจะยืนยันว่าส่งอาหารแล้ว",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(process.env.REACT_APP_DOMAIN_KEY+"/finish_deliver", {
                    username: cookie,
                    food_id: id,
                    date: new Date().toLocaleTimeString('th-th')
                }).then((res) => {
                    if (res.data.finish) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'ส่งอาหารเรียบร้อย',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            history.push("/home")
                            history.push('/dashboard_rider')
                        }, 2000)
                    }
                })
            }
        })
    }

    useEffect(async () => {
        await LoadApiUser(process.env.REACT_APP_DOMAIN_KEY+'/user', cookie).then((res) => {
            setUser(res)

            console.log(res)


            LoadPositionMarket(process.env.REACT_APP_DOMAIN_KEY+"/position_market", res[0].buy_store).then((res) => {
                setOther(res.data)
            })
        })

        if (cookie) {
            await LoadApiOrder(process.env.REACT_APP_DOMAIN_KEY+'/order_client', cookie).then((res) => {
                setOrder(res)
                console.log(res)
            })
        }
    }, [])

    return (
        <div className="rider-contain">
            <h1 style={{ textAlign: 'center' }}>สรุปการส่ง</h1>
            <p style={{ textAlign: 'center' }}>ส่งไปเเล้ว : {user && user.length > 0 ? user[0].rider_count : null} ครั้ง</p>
            <p style={{ textAlign: 'center' }}>เงินรวมที่จะได้ทั้งหมด : {user && user.length > 0 ? user[0].rider_money : null} บาท</p>
            <p style={{ textAlign: 'center' }}>*ไรเดอร์จะได้เงินครั้งละ 10 บาทจากการส่งสินค้า 1 ครั้ง*</p>
            {user && user.length > 0 ? user[0].rider_inventory ? <div className="rider-client">
                <div className='flex'>
                    <h2 style={{ color: 'green' }}>ออเดอร์ที่ : {user && user.length > 0 ? user[0].id : null}</h2>
                    <div className="detail-rider-order">
                        <p>ลูกค้า : {user && user.length > 0 ? user[0].owner_order : null}</p>
                        <p>โทร : {user && user.length > 0 ? user[0].owner_order_tel : null}</p>
                        <p>ร้านค้า : {user && user.length > 0 ? user[0].buy_store : null}</p>
                        <p>โทร : {user && user.length > 0 ? user[0].buy_store_tel : null}</p>
                        <p>เวลาที่สั่ง : {user && user.length > 0 ? user[0].buy_time : null}</p>
                    </div>
                </div><br />
                <hr />
                {inventory && inventory.length > 0 ? inventory.map((item) => {
                    return (
                        <div>
                            <p>{item.food_name} x {item.quantity} = {(item.food_price * item.quantity)}</p>
                            <p>ค่าส่ง 15 บาท</p>
                            {user && user.length > 0 ? user[0].ticket !== 0 ? <p>ลดราคา : {user[0].ticket} บาท</p> : null : null}
                        </div>
                    )
                }) : null}
                <hr />
                {user && user.length > 0 ? user[0].ticket !== 0 ? <p style={{color: 'green', fontSize: '20px', textAlign: 'center'}}>รวมทั้งสิ้น : {total} บาท</p> : <p style={{color: 'green', fontSize: '20px', textAlign: 'center'}}>รวมทั้งสิ้น : {total+15} บาท</p> : null}
                <button onClick={() => FinishDeliver(user[0].food_id)} className="btn-to-order">ยืนยันยันการส่งสินค้า</button><br />
                <div className="grid-rider-btn">
                    <button className="btn-to-market" onClick={() => {
                        window.location = "https://www.google.co.th/maps/dir//" + other[0].lat + "," + other[0].longitude + "/@18.5128061,98.8415783,13.75z/data=!4m2!4m1!3e0"
                    }}>นำทาง : ร้าน</button>
                    <button onClick={() => {
                        // let url = "https://www.google.co.th/maps/dir/"+user[0].lat_client+","+user[0].long_client+"/"+user[0].lat+","+user[0].longitude+"/data=!4m5!4m4!1m0!1m1!4e1!3e0"
                        // window.location = "https://www.google.co.th/maps/dir/"+user[0].lat_client+","+user[0].long_client+"/"+user[0].lat+","+user[0].longitude+"/data=!4m5!4m4!1m0!1m1!4e1!3e0"
                        window.location = "https://www.google.co.th/maps/dir//" + user[0].lat_client + "," + user[0].long_client + "/@18.5128061,98.8415783,13.75z/data=!4m2!4m1!3e0"
                    }} style={{ marginLeft: '10px' }} className="btn-to-market">นำทาง : ลูกค้า</button>
                </div>
            </div> : <p>ยังไม่มีออเดอร์ที่รับ</p> : null}
        </div>
    )
}

export default DashBoardRider