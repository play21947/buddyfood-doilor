import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import { useHistory } from "react-router-dom"
import { AsyncUser } from "../Actions/UserActions"
import { AsnycStock } from "../Actions/StockActions"
import axios from "axios"
import io from 'socket.io-client'
import ReactHowler from 'react-howler'

const socket = io.connect(process.env.REACT_APP_DOMAIN_KEY)


const Navbar = ({ count, rider_count }) => {
    let history = useHistory()

    const ref = useRef()
    const test = useRef()

    let dispatch = useDispatch()
    let cart = useSelector(state => state.cart)
    let storage_cart = JSON.parse(localStorage.getItem('cart'))

    let user_data = useSelector(state => state.user_data.userData)

    let Total

    if (storage_cart && storage_cart.length > 0) {
        Total = storage_cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    let [IsNavOpen, SetIsNavOpen] = useState(false)
    let [order, setOrder] = useState([])
    let [userdata, setUserdata] = useState([])
    let [notifyRider, setNotifyRider] = useState([])
    let [status, setStatus] = useState(false)

    let closeNav = () => {
        SetIsNavOpen(false)
    }

    let cookie = localStorage.getItem('username')

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-right',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    })

    let [handleSound, setHandleSound] = useState('')

    // socket.on('notify', (payload) => {
    //     Toast.fire({
    //         icon: 'success',
    //         title: payload.notify
    //     })
    //     console.log("Here : ", payload)
    //     setHandleSound(payload.notify)
    // })

    // const playAudio = () => {
    //     setTimeout(() => {
    //         var audio = new Audio('../sound/cake.mp3')
    //         audio.volume = 0.2
    //         audio.play()
    //         console.log("Test Sound")
    //         setHandleSound('')
    //     }, 1600)
    // }

    // if (handleSound && handleSound != '') {
    //     ref.current.click()
    // }

    const inside = useRef()
    const navbar = useRef()

    const manage = (e) => {
        if (inside && inside.current && inside.current.contains(e.target) || navbar && navbar.current && navbar.current.contains(e.target)) {
            console.log("InSide")
        } else {
            SetIsNavOpen(false)
        }
    }

    const LoadApiUser = (api, cookie) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                username: cookie
            }).then((res) => {
                if (res.data && res.data.length > 0) {
                    socket.emit('connect_market', res.data[0].market)
                    resolve(res.data)
                }
            })
        })
    }

    const LoadApiOrderStore = (api, userdata) => {
        return new Promise((resolve, reject) => {
            axios.post(api, {
                market: userdata[0].market
            }).then((res) => {
                resolve(setOrder(res.data))
            })
        })
    }


    useEffect(async () => {

        window.addEventListener('scroll', () => {
            if (window.scrollY > 120) {
                setText(true)
            }
            else {
                setText(false)
            }
        })


        dispatch(AsyncUser(cookie))


        // axios.get("http://play2lover.ddns.net:3001/notification_rider").then((res)=>{
        //     setNotifyRider(res.data)
        // })


        await LoadApiUser(process.env.REACT_APP_DOMAIN_KEY+"/user", cookie).then((res) => {
            setUserdata(res)

            LoadApiOrderStore(process.env.REACT_APP_DOMAIN_KEY+'/order_store', res)
        })

        // await LoadApiOrderStore("http://play2lover.ddns.net:3001/order_store", userdata[0].market)

        // await LoadApiOrderStore("http://play2lover.ddns.net:3001/order_store", userdata[0].market)

        document.addEventListener('click', manage)

        return () => {
            document.removeEventListener('click', manage)
        }

    }, [])



    // console.log(order.length)
    // notification
    // <i class="fas fa-bell"></i>

    let [text, setText] = useState(false)

    // console.log(text)    


    return (
        <div>
            {/* <button style={{ display: 'none' }} ref={ref} onClick={() => {
                playAudio()
                console.log("Clicked")
            }}>sound</button> */}

            {IsNavOpen ?
                <div ref={inside} className="modal-menu">
                    <div className="modal-menu-detail">
                        <p onClick={() => {
                            SetIsNavOpen(false)
                        }} className="x-modal">X</p>
                        {cookie ? <Link to="/home" className="link" onClick={() => closeNav()}><h1>หน้าหลัก</h1></Link> : <Link to="/" className="link" onClick={() => closeNav()}><h1>หน้าหลัก</h1></Link>}
                        {cookie && user_data && user_data.length > 0 ? <Link className="link" onClick={() => closeNav()} to="/myprofile"><h1>โปรไฟล์ : {user_data ? user_data[0].first_name : null}</h1></Link> : <Link className="link" to="/login" onClick={() => closeNav()}><h1>เข้าสู่ระบบ</h1></Link>}
                        {cookie && user_data && user_data.length > 0 ? <Link className="link" to="/my_order"><h1 onClick={() => closeNav()}>สั่งซื้อ : ออเดอร์</h1></Link> : null}
                        {cookie ? <Link className="link" onClick={() => closeNav()} to="/history_order"><h1>สั่งซื้อ : ประวัติ</h1></Link> : null}
                        {cookie ? null : <Link className="link" to="/register" onClick={() => closeNav()}><h1>สมัครสมาชิก</h1></Link>}
                        {cookie && user_data && user_data.length > 0 && user_data[0].role === 1 ? <Link className="link" to="/ownmarket" onClick={() => closeNav()}>{user_data && user_data.length > 0 ? <h1>ร้านค้า : {user_data[0].market}</h1> : null}</Link> : null}
                        {cookie && user_data && user_data.length > 0 && !user_data[0].market && user_data[0].role !== 2 && user_data[0].role !== 3 ? <Link className="link" to="/market"><h1 onClick={() => closeNav()}>สมัคร : เป็นร้านค้า</h1></Link> : null}
                        {cookie ? user_data && user_data.length > 0 ? user_data[0].role === 2 ? <Link className="link" to="/rider"><h1 onClick={() => closeNav()}>ไรเดอร์ : ออเดอร์</h1></Link> : user_data[0].role === 1 || user_data[0].role === 3 ? null : <Link className="link" to="/rider_register"><h1 onClick={() => closeNav()}>สมัคร : เป็นไรเดอร์</h1></Link> : null : null}
                        {cookie ? userdata && userdata.length > 0 ? userdata[0].role === 3 ? <Link className="link" to="/service"><h1 onClick={() => closeNav()}>แอดมิน : ออเดอร์</h1></Link> : null : null : null}
                        {cookie && user_data && user_data.length > 0 && user_data[0].role === 1 ? <Link className="link" to="/orders"><h1 onClick={() => closeNav()}>ร้านค้า : ออเดอร์</h1></Link> : null}
                        {cookie && user_data && user_data.length > 0 && user_data[0].role === 2 ? <Link className="link" to="/dashboard_rider"><h1 onClick={()=> closeNav()}>ไรเดอร์ : สรุปการส่ง</h1></Link> : null}
                        {cookie && user_data && user_data.length > 0 && user_data[0].role === 1 ? <Link className="link" to="/dashboard_merchant"><h1 onClick={()=> closeNav()}>ร้านค้า : สรุปการขาย</h1></Link> : null}
                        {cookie ? <Link className="link" onClick={() => closeNav()} to="/map"><h1>แผนที่ร้านค้า</h1></Link> : null}
                        {cookie ? <h1 style={{ cursor: 'pointer', color: 'firebrick' }} className="link" onClick={() => {
                            SetIsNavOpen(false)
                            Swal.fire({
                                title: 'ออกจากระบบ?',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'ยืนยัน',
                                cancelButtonText: 'ยกเลิก'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'กำลังออกจากระบบ',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    setTimeout(() => {
                                        localStorage.removeItem('username')
                                        history.push("/")
                                        window.location.reload(true)
                                    }, 2000)
                                }
                            })
                        }}>ออกจากระบบ</h1> : null}
                    </div>
                </div> : <div className="modal-menu-close"></div>}



            <div id="warp" ref={test} className="warpper">
                <div className={'nav-fix'}>
                    {/* <div className="logo">
                    {cookie ? <h1><Link className="link" to="/" onClick={() => closeNav()}>หน้าหลัก</Link></h1> : <h1><Link className="link" to="/" onClick={() => closeNav()}>Doilor Delivery</Link></h1>}
                </div> */}

                    {cookie && user_data && user_data.length > 0 ? user_data[0].role == 1 ? <div className="notification"><Link to="/orders"><i onClick={() => closeNav()} class="fas fa-bell">{count && count > 0 ? <p>{count}</p> : null}</i></Link></div> : user_data[0].role === 2 ? <div className="notification"><Link to="/rider"><i onClick={() => closeNav()} class="fas fa-bell">{rider_count ? rider_count > 0 ? <p>{rider_count}</p> : null: null}</i></Link></div> : null : null}

                    <div className="menu-close">
                        <ul>
                            {cookie ? <Link className="link" onClick={() => closeNav()} to="/myprofile"><li>โปรไฟล์ : {cookie}</li></Link> : <Link className="link" to="/login" onClick={() => closeNav()}><li>เข้าสู่ระบบ</li></Link>}
                            {cookie ? <Link className="link" onClick={() => closeNav()} to="/history_order"><li>ประวัติ : การสั่งซื้อ</li></Link> : null}
                            {cookie ? null : <Link className="link" to="/register" onClick={() => closeNav()}><li>สมัครสมาชิก</li></Link>}
                            {cookie && user_data && user_data.length > 0 && user_data[0].role === 1 ? <Link className="link" to="/ownmarket"><li onClick={() => closeNav()}>{user_data && user_data.length > 0 ? <p>ร้าน : {user_data[0].market}</p> : null}</li></Link> : null}
                            {cookie && user_data && user_data.length > 0 && !user_data[0].market && user_data[0].role !== 2 ? <Link className="link" to="/market"><li onClick={() => closeNav()}>สมัคร : เป็นร้านค้า</li></Link> : null}
                            {cookie && user_data && user_data.length > 0 && user_data[0].role === 1 ? <Link className="link" to="/orders"><li onClick={() => closeNav()}>ออเดอร์ : ร้านค้า</li></Link> : null}
                            {cookie ? user_data && user_data.length > 0 ? user_data[0].role === 2 ? <Link className="link" to="/rider"><li onClick={() => closeNav()}>ออเดอร์ : ไรเดอร์</li></Link> : user_data[0].role === 1 ? null : <Link className="link" to="/rider_register"><li onClick={() => closeNav()}>สมัคร : เป็นไรเดอร์</li></Link> : null : null}
                            {cookie ? <Link className="link" onClick={() => closeNav()} to="/map"><li>แผนที่ : ร้านค้า</li></Link> : null}
                            {/* <div className="dropdown">
                            <li className="link theme">Theme</li>
                            <div className="dropdown-content">
                                <li>Dark</li>
                                <hr />
                                <li>White</li>
                            </div>
                        </div> */}
                            {cookie ? <li className="quit" onClick={() => {
                                Swal.fire({
                                    title: 'ออกจากระบบ',
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'ยืนยัน',
                                    cancelButtonText: 'ยกเลิก'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        localStorage.removeItem('username')
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: 'ออกจากระบบสำเร็จ',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        setTimeout(() => {
                                            history.push("/")
                                            closeNav()
                                        }, 2000)
                                    }
                                })
                            }}>ออกจากระบบ</li> : null}
                        </ul>
                    </div>

                    <div className="container-logo">
                        <img onClick={() => {
                            history.push("/")
                        }} className="logo" src="../img/buddyfood_logo_dad.png"></img>
                    </div>

                    <div ref={navbar} onClick={() => {
                        if (IsNavOpen) {
                            SetIsNavOpen(false)
                        }
                        else {
                            SetIsNavOpen(true)
                        }
                    }} className="toggle">
                        <i className="fas fa-bars"></i>
                    </div>
                    
                    {cookie ? <div className="cart-pos">
                        <div onClick={() => history.push("/cart")} className="cart">
                            <i onClick={() => closeNav()} className="fas fa-shopping-cart"></i>
                            {Total && Total > 0 ? <p>{Total}</p> : null}
                        </div>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}


export default Navbar