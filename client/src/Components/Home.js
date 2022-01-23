import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from "react"
import { AsnycStock } from "../Actions/StockActions"
import { AddToCart, AsyncCart } from "../Actions/CartActions"
import Swal from "sweetalert2"
import axios from "axios"
import CopyRight from "./CopyRight"
import io from 'socket.io-client'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)

const Home = () => {

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    let history = useHistory()
    let dispatch = useDispatch()

    let [SearchWords, setSearchWords] = useState('')
    let [test, setTest] = useState('')
    let [all_user, setAll_User] = useState([])
    let count_rider = 0
    let itemSearch
    let resultItem
    let free_rider = 0
    let busy_rider = 0
    let count_market = 0
    let time

    let [stock, setStock] = useState([])

    if (!stock.isLoading && stock && stock.length > 0) {
        itemSearch = stock.filter((item) => {
            return item.food_name.includes(SearchWords) || item.owner.includes(SearchWords) || item.type.includes(SearchWords)
        })
    }

    let cart = useSelector(state => state.cart.cart)

    // navigator.geolocation.getCurrentPosition((position)=>{
    //     console.log("Lat : ", position.coords.latitude)
    //     console.log("Long : ", position.coords.longitude)
    // })

    // navigator.geolocation.watchPosition((position)=>{
    //     console.log(position.coords.latitude)
    //     console.log(position.coords.longitude)
    // })

    let [store, setStore] = useState([])

    let LoadApiGet = (api) => {
        return new Promise((resolve, reject) => {
            axios.get(api).then((res) => {
                resolve(res.data)
            })
        })
    }

    const LoadApiPost = (api) => {
        return new Promise((resolve, reject) => {
            axios.post(api).then((res) => {
                resolve(res.data)
            })
        })
    }


    useEffect(async () => {
        // axios.post("http://play2lover.ddns.net:3001/position",{
        //     lat: position.coords.latitude,
        //     long: position.coords.longitude,
        //     username: cookie
        // }).then((res)=>{
        //     console.log(res.data)
        // })

        // socket.on('all_stock', (data)=>{
        //     setStock(data)
        //     // console.log(data)
        // })

        // localStorage.removeItem('cart')
        // localStorage.setItem('cart', JSON.stringify(cart))

        await LoadApiGet(process.env.REACT_APP_DOMAIN_KEY + "/stock").then((res) => {
            setStock(res)

            // setStock(res)
        })

        await LoadApiGet(process.env.REACT_APP_DOMAIN_KEY + '/get_whole_store').then((res) => {
            setStore(res)
            console.log("Here : ", res)
        })

        await LoadApiPost(process.env.REACT_APP_DOMAIN_KEY + '/all_user').then((res) => {
            setAll_User(res)
        })

    }, [])

    count_rider = all_user.filter((item) => item.role == 2).length

    free_rider = all_user.filter((item) => item.rider_inventory === '' && item.role == 2).length
    busy_rider = all_user.filter((item) => item.rider_inventory !== '' && item.role == 2).length
    count_market = all_user.filter((item) => item.role == 1).length


    let cookie = localStorage.getItem('username')

    let user_data = useSelector(state => state.user_data.userData)

    // if (cart && cart.length > 0) {
    //     console.log(cart[0].owner)
    // }

    // console.log(user_data)

    if (!cookie) {
        history.push("/")
    }

    let [remark, setRemark] = useState('')

    let buy = (item) => { //รอบเเรก จะไม่เข้า conditaion if

        if (cart && cart.length > 0) {
            cart.map((item) => {
                if (item.quantity < 10) {
                    Toast.fire({
                        icon: 'success',
                        title: 'ใส่ตะกร้าเรียบร้อยแล้ว'
                    })
                    setStatus(false)
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: 'ไม่สามารถเพิ่มได้อีก'
                    })
                }
            })
        }

        let food = {
            ...item,
            quantity: 1,
            remark: remark
        }

        dispatch(AddToCart(food))

        Toast.fire({
            icon: 'success',
            title: 'ใส่ตะกร้าเรียบร้อยแล้ว'
        })
        setStatus(false)
    }

    let [menu, setMenu] = useState([])
    let [img, setImg] = useState('')

    let open_buy = (id) => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY + "/get_food", {
            id: id
        }).then((res) => {
            // console.log(res.data)
            setMenu(res.data)
            setImg(res.data[0].food_img)
        })
    }

    let [status, setStatus] = useState(false)

    time = new Date().toLocaleString('th-th')
    let cvt_time = time.split(':')
    let hours = cvt_time[0].split(' ')[1]

    setInterval(() => {
        hours = cvt_time[0].split(' ')[1]
        console.log(hours)
    }, 1000 * 1800)

    // console.log("Hours : ", hours)

    let now_time = 18

    // console.log("Now Time : ", now_time)

    let FindGps = () => {
        if (navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                axios.post(process.env.REACT_APP_DOMAIN_KEY + '/update_location', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    username: cookie
                }).then((res) => {
                    if (res.data.success) {
                        Swal.fire('อัพเดทตำเเหน่งเรียบร้อย')
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000)
                    }
                })
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)
            })
        } else {
            console.log("supposed to open gps")
        }
    }

    return (
        <div>
            <div className="choose">
                <i onClick={() => {
                    setSearchWords('อาหาร')
                }} className="fas fa-hamburger"></i>
                <i onClick={() => {
                    setSearchWords('เครื่องดื่ม')
                }} className="fas fa-coffee"></i>
                <i onClick={() => {
                    setSearchWords('ขนม')
                }} className="fas fa-birthday-cake"></i>
                <i onClick={() => {
                    setSearchWords('ร้าน')
                }} className="fas fa-store"></i>
            </div>

            {/* <div className={status ? "modal-buy" : "modal-buy-close"}>
                <p style={{ cursor: 'pointer' }} className="x-buy" onClick={() => {
                    setStatus(false)
                }}>X</p>
                <div className="grid-modal">
                    <img src={menu && menu.length > 0 ? '../resize_pictures_food/' + menu[0].food_img : null}></img>
                    <div className="modal-food-detail">
                        <h1 className="header-modal-food">{menu && menu.length > 0 ? menu[0].food_name : null}</h1>
                        <p>{menu && menu.length > 0 ? "เจ้าของร้าน : " + menu[0].owner : null}</p>
                        <p>{menu && menu.length > 0 ? "ราคา : " + menu[0].food_price : null} ฿</p>
                        <p>จัดส่งภายใน 30 นาที</p>
                        <input className="text-area" placeholder="หมายเหตุ" onChange={(e) => {
                            setRemark(e.target.value)
                        }}></input>
                        {menu && menu.length > 0 && user_data && user_data.length > 0 ? user_data[0].role != 2 ? cart && cart.length > 0 ? cart[0].owner == menu[0].owner ? <button onClick={() => buy(menu[0])} className="btn-buy">ใส่ตะกร้า</button> : <button className="btn-go-to-cart" onClick={() => { history.push('/cart') }}>ชำระสินค้าที่อยู่ในตะกร้าของคุณก่อน</button> : <button onClick={() => buy(menu[0])} className="btn-buy">ใส่ตะกร้า</button> : <button disabled className="btn-buy-rider">ไรเดอร์ไม่สามารถซื้อได้</button> : null}
                    </div>
                </div>
            </div> */}

            <div className="detail-app">
                <div className="inline">
                    <img className="show-pic" src="../img/people.png"></img>
                    <p>{all_user ? all_user.length : null}</p>
                </div>
                <div className="inline">
                    <img className="show-pic" src="../img/market-count.png"></img>
                    <p>{count_market ? count_market : 0}</p>
                </div>
                <div className="inline">
                    <img className="show-pic" src="../img/rider.png"></img>
                    <div>
                        <p><img className="online" src="../img/free_work.png"></img> {free_rider ? free_rider : '-'}</p>
                        <p><img className="online" src="../img/red.png"></img> {busy_rider ? busy_rider : '-'}</p>
                    </div>
                </div>
            </div>

            <div className="search-box">
                <i className="fas fa-search img-search"></i>
                <input value={SearchWords} onChange={(e) => setSearchWords(e.target.value)} className="search" placeholder="ค้นหา" ></input>
                {SearchWords.length > 0 ? <p onClick={() => {
                    setSearchWords('')
                }} className="reset-search">x</p> : null}
                <div className="find-gps">
                    <button onClick={() => {
                        FindGps()
                    }}>บันทึกพิกัด</button>
                </div>
            </div>

            <div className="home">
                {/* <div className="header-doilor">
                    <h1>อาหารจาก ดอยหล่อ</h1>
                </div> */}
                <div className="stock">
                    {!stock.isLoading && stock && stock.length > 0 ? store && store.length > 0 ? SearchWords === 'ร้าน' ? store.map((item) => {
                        return (
                            <div className="stock-box" onClick={() => {
                                // open_buy(item.id)
                                // setStatus(true)
                                history.push('/profilemarket/' + item.market)
                            }}>
                                <div className="set-stock">
                                    <div className="img-food">
                                        <img src={'../logo_food/' + item.market_logo}></img>
                                    </div>
                                    <div className="detail-food">
                                        <div style={{ textAlign: 'center' }}>
                                            <h3>{item.market}</h3>
                                        </div>
                                    </div><br />
                                </div>
                                {/* {user_data && user_data.length > 0 ? user_data[0].role === 2 ? <button disabled className="btn-buy-rider">ไรเดอร์ไม่สามารถสั่งอาหารได้</button> : cart && cart.length > 0 ? cart[0].owner === item.owner ? <button onClick={() => buy(item)} className="btn-buy">นำใส่ตะกร้า</button> : <button disabled onClick={() => buy(item)} className="btn-buy-rider">ไม่สามารถซื้อได้</button> : <button onClick={() => buy(item)} className="btn-buy">นำใส่ตะกร้า</button> : null} */}
                            </div>
                        )
                    }) : itemSearch && itemSearch.length > 0 ? itemSearch.map((item) => { // 8 >= 10 8 < 17
                        return (
                            <div>
                                {item.close === 0 ? item.auto_time_open != '' && item.auto_time_close != '' ? now_time >= item.auto_time_open && now_time < item.auto_time_close ?
                                    <div className="stock-box" onClick={() => { //ร้านเปิด
                                        // open_buy(item.id)
                                        // setStatus(true)
                                        history.push('/profilemarket/' + item.owner)
                                    }} key={item.id}>
                                        <div className="set-stock">
                                            <div className="img-food">
                                                <img src={'../resize_pictures_food/' + item.food_img}></img>
                                            </div>
                                            <div className="detail-food">
                                                <div className="flex">
                                                    <h3 className="food_name">{item.food_name}</h3>
                                                    <h3>{item.food_price} ฿</h3>
                                                    <p>{item.auto_time_open}</p>
                                                </div>
                                                <div className="flex">
                                                    <p className="owner">{item.owner}</p>
                                                    <div>
                                                        <p className="star_count">{item.star}</p>
                                                        <img className="star" src="../img/star_real.png"></img>
                                                    </div>
                                                </div>
                                            </div><br />
                                        </div>
                                    </div> : //ร้านปิด
                                    <div className="stock-box-gray" onClick={() => {
                                        // open_buy(item.id)
                                        // setStatus(true)
                                        // history.push('/profilemarket/' + item.owner)
                                    }} key={item.id}>
                                        <div className="set-stock">
                                            <div className="show-img-food">
                                                <p className="sold-out">นอกเวลาบริการ</p>
                                                <div className="img-food">
                                                    <img src={'../resize_pictures_food/' + item.food_img}></img>
                                                </div>
                                            </div>
                                            <div className="detail-food">
                                                <div className="flex">
                                                    <h3 className="food_name">{item.food_name}</h3>
                                                    <h3>{item.food_price} ฿</h3>
                                                    <p>{item.auto_time_open}</p>
                                                </div>
                                                <div className="flex">
                                                    <p className="owner">{item.owner}</p>
                                                    <div>
                                                        <p className="star_count">{item.star}</p>
                                                        <img className="star" src="../img/star_real.png"></img>
                                                    </div>
                                                </div>
                                            </div><br />
                                        </div>
                                    </div> : <div className="stock-box" onClick={() => { //ร้านเปิด
                                        // open_buy(item.id)
                                        // setStatus(true)
                                        history.push('/profilemarket/' + item.owner)
                                    }} key={item.id}>
                                    <div className="set-stock">
                                        <div className="img-food">
                                            <img src={'../resize_pictures_food/' + item.food_img}></img>
                                        </div>
                                        <div className="detail-food">
                                            <div className="flex">
                                                <h3 className="food_name">{item.food_name}</h3>
                                                <h3>{item.food_price} ฿</h3>
                                            </div>
                                            <div className="flex">
                                                <p className="owner">{item.owner}</p>
                                                <div>
                                                    <p className="star_count">{item.star}</p>
                                                    <img className="star" src="../img/star_real.png"></img>
                                                </div>
                                            </div>
                                        </div><br />
                                    </div>
                                </div> : <div className="stock-box-gray" onClick={() => {
                                    // open_buy(item.id)
                                    // setStatus(true)
                                    // history.push('/profilemarket/' + item.owner)
                                }} key={item.id}>
                                    <div className="set-stock">
                                        <div className="show-img-food">
                                            <p className="sold-out">นอกเวลาบริการ</p>
                                            <div className="img-food">
                                                <img src={'../resize_pictures_food/' + item.food_img}></img>
                                            </div>
                                        </div>
                                        <div className="detail-food">
                                            <div className="flex">
                                                <h3 className="food_name">{item.food_name}</h3>
                                                <h3>{item.food_price} ฿</h3>
                                            </div>
                                            <div className="flex">
                                                <p className="owner">{item.owner}</p>
                                                <div>
                                                    <p className="star_count">{item.star}</p>
                                                    <img className="star" src="../img/star_real.png"></img>
                                                </div>
                                            </div>
                                        </div><br />
                                    </div>
                                </div>}
                            </div>
                        )
                    }) : null : null : null}
                </div>
            </div>
            {SearchWords.length > 0 ? null : <CopyRight />}
        </div>
    )
}


export default Home