import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { AddToCart } from "../Actions/CartActions"
import Swal from "sweetalert2"

const ProfileMarket = () => {

    let history = useHistory()

    let cookie = localStorage.getItem('username')

    let cart = useSelector(state => state.cart.cart)
    let user_data = useSelector(state => state.user_data.userData)

    console.log(user_data)

    if (!cookie) {
        history.push("/")
    }

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

    let dispatch = useDispatch()

    let owner = useParams()
    console.log(owner)

    let [market, setMarket] = useState([])

    let [remark, setRemark] = useState('')

    let [status, setStatus] = useState(false)

    let [menu, setMenu] = useState([])
    let [img, setImg] = useState('')

    let now_time = 18


    let open_buy = (id) => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY + "/get_food", {
            id: id
        }).then((res) => {
            // console.log(res.data)
            setMenu(res.data)
            setImg(res.data[0].food_img)
        })
    }

    console.log(market)

    let buy = (item) => {
        if (cart && cart.length > 0) {
            cart.map((item) => {
                if (item.quantity < 10) {
                    Toast.fire({
                        icon: 'success',
                        title: 'ใส่ตะกร้าเรียบร้อยแล้ว'
                    })
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

    console.log(cart)

    useEffect(() => {
        axios.post(process.env.REACT_APP_DOMAIN_KEY + "/profile_market", {
            owner: owner.market
        }).then((res) => {
            setMarket(res.data)
        }).catch((err) => {
            if (err) throw err
        })
    }, [])

    console.log(market)

    return (
        <div>
            {status ?
                <div className="warp">
                    <div className="modal-buy">
                        <p style={{ cursor: 'pointer' }} className="x-buy" onClick={() => {
                            setStatus(false)
                        }}>X</p>
                        <div className="grid-modal">
                            <img src={menu && menu.length > 0 ? '../resize_pictures_food/' + menu[0].food_img : null}></img>
                            <div className="modal-food-detail">
                                <h1 className="header-modal-food">{menu && menu.length > 0 ? menu[0].food_name : null}</h1>
                                <p>{menu && menu.length > 0 ? "เจ้าของร้าน : " + menu[0].owner : null}</p>
                                <p>{menu && menu.length > 0 ? "ราคา : " + menu[0].food_price : null} ฿</p>
                                <input className="text-area" placeholder="หมายเหตุ" onChange={(e) => {
                                    setRemark(e.target.value)
                                }}></input>
                                {cart && cart.length > 0 && menu && menu.length > 0 && user_data && user_data.length > 0 ? cart[0].owner === menu[0].owner ? <button className="btn-buy" onClick={() => buy(menu[0])}>ใส่ตะกร้า</button> : <button onClick={() => history.push("/cart")} className="btn-go-to-cart">ชำระสินค้าในตะกร้าก่อน</button> : user_data && user_data.length > 0 && menu && menu.length > 0 ? user_data[0].market == menu[0].owner ? <button className="btn-buy-rider">ไม่สามารถซื้อร้านของตัวเองได้</button> : <button className="btn-buy" onClick={() => buy(menu[0])}>ใส่ตะกร้า</button> : null}
                            </div>
                        </div>
                    </div>
                </div> : <div className="modal-buy-close"></div>}

            <div className="home">
                {/* <i onClick={() => history.goBack()} class="fas fa-arrow-left backprofile"></i> */}
                <div className="profile-detail">
                    <h1>ร้าน : {owner.market}</h1>
                </div>
                <div className="stock">
                    {market && market.length > 0 ? market.map((item) => {
                        return (
                            <div>
                                {item.close === 0 ? item.auto_time_open != '' && item.auto_time_close != '' ? now_time >= item.auto_time_open && now_time < item.auto_time_close ?
                                    <div className="stock-box" onClick={() => { //ร้านเปิด
                                        open_buy(item.id)
                                        setStatus(true)
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
                                    </div> : <div className="stock-box" onClick={() => { //ร้านเปิด
                                        open_buy(item.id)
                                        setStatus(true)
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
                    }) : null}
                </div>
            </div>
        </div>
    )
}

export default ProfileMarket